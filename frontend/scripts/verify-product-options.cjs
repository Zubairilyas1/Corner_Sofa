const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const net = require('node:net');
const { createHash } = require('node:crypto');
const { spawn } = require('node:child_process');

// This suite always starts its own server and catalogue. It never targets port
// 3000 or creates products in the developer's working catalogue.
const frontend = path.resolve(__dirname, '..');
const artifacts = path.join(frontend, 'artifacts');
const runId = `${Date.now()}-${process.pid}`;
const dataDirectory = path.join(artifacts, `product-options-data-${runId}`);
const actualProductsFile = path.join(frontend, '.local-data', 'products.json');
const password = 'catalogue-test-only';
const title = 'Colour Test Sofa';
const beigeImage = '/images/sofas/premium-two-seater.webp';
const charcoalImage = '/images/sofas/premium-three-seater.webp';
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fingerprint(file) {
  try { return createHash('sha256').update(await fs.readFile(file)).digest('hex'); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function freePort() {
  const reservation = net.createServer();
  await new Promise((resolve, reject) => {
    reservation.once('error', reject);
    reservation.listen(0, '127.0.0.1', resolve);
  });
  const port = reservation.address().port;
  await new Promise((resolve, reject) => reservation.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function stopServer(server) {
  if (!server || server.exitCode !== null || server.signalCode !== null) return;
  const stopped = new Promise((resolve) => server.once('exit', resolve));
  server.kill('SIGTERM');
  await Promise.race([stopped, delay(5000)]);
  if (server.exitCode === null && server.signalCode === null) {
    server.kill('SIGKILL');
    await Promise.race([stopped, delay(3000)]);
  }
}

async function waitForServer(origin, server, getLog, getSpawnError) {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    if (getSpawnError()) throw getSpawnError();
    if (server.exitCode !== null || server.signalCode !== null) throw new Error(`Isolated server exited before readiness:\n${getLog()}`);
    try {
      const response = await fetch(`${origin}/api/products/`, { signal: AbortSignal.timeout(1200) });
      if (response.ok) {
        assert.deepEqual(await response.json(), [], 'The isolated catalogue must start empty.');
        return;
      }
    } catch (error) {
      if (error instanceof assert.AssertionError) throw error;
    }
    await delay(200);
  }
  throw new Error(`Isolated production server was not ready within 45 seconds:\n${getLog()}`);
}

async function assertNoOverflow(page, label, widths = [320, 390, 768, 1440]) {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(sizes.document <= sizes.viewport + 1, `${label} overflows at ${width}px: ${JSON.stringify(sizes)}`);
  }
}

async function expectPhoto(locator, filename) {
  await expect(locator).toBeVisible();
  await expect.poll(async () => decodeURIComponent(await locator.getAttribute('src') || '')).toContain(filename);
  await expect.poll(() => locator.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
}

async function submitEditor(admin, method, buttonName) {
  const responsePromise = admin.waitForResponse((response) => response.request().method() === method
    && /^\/api\/products\//.test(new URL(response.url()).pathname));
  await admin.getByRole('button', { name: buttonName, exact: true }).click();
  const response = await responsePromise;
  const body = await response.json();
  assert.ok(response.ok(), `Admin ${method} failed: ${JSON.stringify(body)}`);
  await expect(admin.getByRole('heading', { name: 'Edit Product', exact: true })).toHaveCount(0);
  return body.product;
}

async function fillColour(admin, index, colour) {
  await admin.locator(`#colour-${index}-name`).locator('xpath=ancestor::fieldset[1]')
    .getByRole('radio', { name: 'Use a colour photo', exact: true }).check();
  await admin.locator(`#colour-${index}-name`).fill(colour.name);
  await admin.locator(`#colour-${index}-swatch`).fill(colour.hex);
  await admin.locator(`#colour-${index}-stock`).fill(String(colour.stock));
  await admin.locator(`#colour-${index}-image`).fill(colour.image);
  if (colour.price != null) await admin.locator(`#colour-${index}-price`).fill(String(colour.price));
}

async function openColours(card) {
  const more = card.getByRole('button', { name: `More colours for ${title}`, exact: true });
  if (await more.count()) await more.click();
  return card.getByRole('group', { name: `Colours for ${title}`, exact: true });
}

async function main() {
  const initialFingerprint = await fingerprint(actualProductsFile);
  let server;
  let browser;
  let admin;
  let shop;
  let detail;
  let serverLog = '';
  let spawnError;
  let failure;
  const browserErrors = [];
  try {
    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(path.join(dataDirectory, 'products.json'), '[]\n', { flag: 'wx' });
    const port = await freePort();
    const origin = `http://127.0.0.1:${port}`;
    server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--port', String(port)], {
      cwd: frontend,
      env: { ...process.env, DATABASE_URL: '', PRODUCT_DATA_DIR: dataDirectory, ADMIN_PASSWORD: password },
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    server.on('error', (error) => { spawnError = error; });
    server.stdout.on('data', (chunk) => { serverLog += chunk.toString(); });
    server.stderr.on('data', (chunk) => { serverLog += chunk.toString(); });
    await waitForServer(origin, server, () => serverLog, () => spawnError);
    console.log(`Isolated catalogue ready on port ${port}.`);

    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    context.setDefaultTimeout(15000);
    context.on('page', (page) => page.on('pageerror', (error) => browserErrors.push(error.message)));
    admin = await context.newPage();
    await admin.goto(`${origin}/admin/products`, { waitUntil: 'networkidle' });
    await admin.getByLabel('Admin password', { exact: true }).fill(password);
    await admin.getByRole('button', { name: 'Sign in to workspace' }).click();
    await expect(admin.getByRole('heading', { name: 'Products', exact: true })).toBeVisible();
    await expect(admin.getByText('No products found.', { exact: true })).toBeVisible();
    await admin.getByRole('button', { name: '+ New Product', exact: true }).click();
    await admin.locator('#product-title').fill(title);
    await admin.locator('#product-selling-price').fill('249');
    await admin.locator('#product-original-price').fill('839.99');
    await admin.locator('#product-category').selectOption('2-Seater');
    await admin.locator('#product-image').fill(beigeImage);
    await admin.locator('#product-description').fill('Isolated browser verification fixture.');
    await admin.getByRole('button', { name: '+ Add colour', exact: true }).click();
    await fillColour(admin, 0, { name: 'Beige', hex: '#d4c5a9', stock: 5, image: beigeImage });
    await admin.getByRole('button', { name: '+ Add colour', exact: true }).click();
    await fillColour(admin, 1, { name: 'Charcoal', hex: '#484b47', stock: 3, price: 299, image: charcoalImage });
    await expect(admin.getByText('Save £590.99', { exact: true })).toBeVisible();
    const created = await submitEditor(admin, 'POST', 'Create Product');
    assert.ok(created.id);

    const getProducts = async () => {
      const response = await context.request.get(`${origin}/api/products/`);
      assert.equal(response.status(), 200);
      return response.json();
    };
    let products = await getProducts();
    assert.equal(products.length, 1);
    const product = products[0];
    assert.equal(product.id, created.id);
    assert.equal(Number(product.base_price), 249);
    assert.equal(Number(product.compare_at_price), 839.99);
    assert.deepEqual(product.images, [beigeImage]);
    assert.equal(product.variants.length, 2);
    const beige = product.variants.find((variant) => variant.color === 'Beige');
    const charcoal = product.variants.find((variant) => variant.color === 'Charcoal');
    assert.ok(beige?.id && charcoal?.id && beige.id !== charcoal.id);
    assert.equal(beige.color_hex, '#d4c5a9');
    assert.equal(charcoal.color_hex, '#484b47');
    assert.equal(beige.range_type, '2-Seater');
    assert.equal(charcoal.range_type, '2-Seater');
    assert.equal(Number(beige.price), 249);
    assert.equal(Number(charcoal.price), 299);
    assert.equal(beige.stock, 5);
    assert.equal(charcoal.stock, 3);
    assert.deepEqual(beige.images, [beigeImage]);
    assert.deepEqual(charcoal.images, [charcoalImage]);

    await admin.reload({ waitUntil: 'networkidle' });
    await admin.getByRole('row').filter({ hasText: title }).getByRole('button', { name: 'Edit', exact: true }).click();
    await expect(admin.locator('#product-selling-price')).toHaveValue('249');
    await expect(admin.locator('#product-original-price')).toHaveValue('839.99');
    await expect(admin.locator('#colour-0-name')).toHaveValue('Beige');
    await expect(admin.locator('#colour-0-swatch')).toHaveValue('#d4c5a9');
    await expect(admin.locator('#colour-0-price')).toHaveValue('249');
    await expect(admin.locator('#colour-0-stock')).toHaveValue('5');
    await admin.locator('#colour-0-name').locator('xpath=ancestor::fieldset[1]')
      .getByRole('radio', { name: 'Use a colour photo', exact: true }).check();
    await expect(admin.locator('#colour-0-image')).toHaveValue(beigeImage);
    await expect(admin.locator('#colour-1-name')).toHaveValue('Charcoal');
    await expect(admin.locator('#colour-1-swatch')).toHaveValue('#484b47');
    await expect(admin.locator('#colour-1-price')).toHaveValue('299');
    await expect(admin.locator('#colour-1-stock')).toHaveValue('3');
    await expect(admin.locator('#colour-1-image')).toHaveValue(charcoalImage);
    await admin.screenshot({ path: path.join(artifacts, 'product-options-admin.png'), fullPage: true });
    console.log('PASS: real admin login, create, persistence, prices, stock and colour photos.');

    shop = await context.newPage();
    await shop.goto(`${origin}/products`, { waitUntil: 'networkidle' });
    const card = shop.getByRole('article', { name: title, exact: true });
    await expect(card).toHaveCount(1);
    await expect(card.locator('[aria-label="Price"]')).toContainText('£249.00');
    await expect(card.getByText('Save £590.99', { exact: true })).toBeVisible();
    const colours = await openColours(card);
    await expect(colours.getByRole('button')).toHaveCount(2);
    assert.deepEqual(await colours.getByRole('button').evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label'))), ['Beige', 'Charcoal']);
    await colours.getByRole('button', { name: 'Charcoal', exact: true }).click();
    await expect(colours.getByRole('button', { name: 'Charcoal', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expectPhoto(card.getByRole('img', { name: `${title} in Charcoal`, exact: true }), 'premium-three-seater.webp');
    await expect(card.locator('[aria-label="Price"]')).toContainText('£299.00');
    await expect(card.getByText('Save £540.99', { exact: true })).toBeVisible();
    const titleLink = card.getByRole('link', { name: title, exact: true });
    const selectedHref = await titleLink.getAttribute('href');
    assert.equal(new URL(selectedHref, origin).searchParams.get('variant'), charcoal.id);
    await card.screenshot({ path: path.join(artifacts, 'product-options-card.png') });

    detail = await context.newPage();
    await detail.goto(new URL(selectedHref, origin).href, { waitUntil: 'networkidle' });
    await expect(detail.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(detail.getByRole('button', { name: 'Charcoal, 2-Seater', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expectPhoto(detail.getByRole('img', { name: `${title} in Charcoal`, exact: true }), 'premium-three-seater.webp');
    await expect(detail.getByText('Save £540.99', { exact: true })).toBeVisible();
    await detail.getByRole('button', { name: /^Add to basket/ }).click();
    await expect.poll(() => detail.evaluate(() => JSON.parse(localStorage.getItem('cart') || '[]'))).toEqual([
      { productId: product.id, variantId: charcoal.id, range_type: '2-Seater', color: 'Charcoal', price: 299, image: charcoalImage, title, quantity: 1 },
    ]);
    await detail.getByRole('button', { name: 'Beige, 2-Seater', exact: true }).click();
    await expectPhoto(detail.getByRole('img', { name: `${title} in Beige`, exact: true }), 'premium-two-seater.webp');
    await expect(detail.getByText('Save £590.99', { exact: true })).toBeVisible();
    await expect(detail.getByRole('button', { name: /^Add to basket/ })).toContainText('£249.00');
    await assertNoOverflow(detail, 'Product detail');
    await detail.getByRole('link', { name: 'View basket', exact: true }).count().then(async (count) => {
      if (count) await detail.getByRole('link', { name: 'View basket', exact: true }).click();
      else await detail.goto(`${origin}/cart`, { waitUntil: 'networkidle' });
    });
    await expect(detail.getByRole('heading', { name: /Your basket/i })).toBeVisible();
    await assertNoOverflow(detail, 'Basket');
    console.log('PASS: card selection, correct variant URL, detail photo/price and basket data.');

    await assertNoOverflow(shop, 'Catalogue grid');
    for (const width of [320, 390, 768, 1440]) {
      await shop.setViewportSize({ width, height: 1000 });
      await colours.getByRole('button', { name: 'Beige', exact: true }).click();
      await expectPhoto(card.getByRole('img', { name: `${title} in Beige`, exact: true }), 'premium-two-seater.webp');
      await colours.getByRole('button', { name: 'Charcoal', exact: true }).click();
      await expect(card.locator('[aria-label="Price"]')).toContainText('£299.00');
    }
    await shop.setViewportSize({ width: 390, height: 844 });
    await card.screenshot({ path: path.join(artifacts, 'product-options-card-mobile.png') });
    await shop.setViewportSize({ width: 1440, height: 1000 });
    await shop.getByRole('button', { name: 'List view', exact: true }).click();
    await expect(shop.getByRole('button', { name: 'List view', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const listColours = await openColours(card);
    await listColours.getByRole('button', { name: 'Beige', exact: true }).click();
    await expectPhoto(card.getByRole('img', { name: `${title} in Beige`, exact: true }), 'premium-two-seater.webp');
    await expect(card.getByText('Save £590.99', { exact: true })).toBeVisible();
    await listColours.getByRole('button', { name: 'Charcoal', exact: true }).click();
    await expectPhoto(card.getByRole('img', { name: `${title} in Charcoal`, exact: true }), 'premium-three-seater.webp');
    await assertNoOverflow(shop, 'Catalogue list');
    await shop.getByRole('button', { name: 'Grid view', exact: true }).click();
    await openColours(card);
    console.log('PASS: responsive colour selection and grid/list layouts at 320, 390, 768 and 1440px.');

    await shop.evaluate(() => {
      window.__productOptionsMessages = 0;
      window.__productOptionsChannel = new BroadcastChannel('corner-sofa-products');
      window.__productOptionsChannel.onmessage = () => { window.__productOptionsMessages += 1; };
    });
    await admin.locator('#product-selling-price').fill('199');
    await expect(admin.locator('#colour-0-price')).toHaveValue('199');
    await expect(admin.locator('#colour-1-price')).toHaveValue('299');
    await admin.locator('#product-original-price').fill('');
    await admin.getByRole('button', { name: 'Remove colour 2', exact: true }).click();
    const updated = await submitEditor(admin, 'PUT', 'Save Changes');
    assert.equal(updated.compare_at_price, null);
    assert.equal(updated.variants.length, 1);
    assert.equal(updated.variants[0].id, beige.id);
    assert.equal(Number(updated.variants[0].price), 199);
    await expect.poll(() => shop.evaluate(() => window.__productOptionsMessages)).toBeGreaterThan(0);
    const remainingColours = card.getByRole('group', { name: `Colours for ${title}`, exact: true });
    await expect(remainingColours.getByRole('button')).toHaveCount(1);
    await expect(remainingColours.getByRole('button', { name: 'Beige', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(card.locator('[aria-label="Price"]')).toContainText('£199.00');
    await expect(card.locator('del')).toHaveCount(0);
    await expect(card.getByText(/^Save £/)).toHaveCount(0);
    await expectPhoto(card.getByRole('img', { name: `${title} in Beige`, exact: true }), 'premium-two-seater.webp');
    await admin.reload({ waitUntil: 'networkidle' });
    await admin.getByRole('row').filter({ hasText: title }).getByRole('button', { name: 'Edit', exact: true }).click();
    await expect(admin.locator('#product-original-price')).toHaveValue('');
    await expect(admin.locator('#product-selling-price')).toHaveValue('199');
    await expect(admin.locator('#colour-0-name')).toHaveValue('Beige');
    await expect(admin.locator('#colour-1-name')).toHaveCount(0);

    const beforeInvalid = await getProducts();
    const missingPhoto = await context.request.put(`${origin}/api/products/${product.id}/`, { data: {
      ...updated,
      variants: [...updated.variants, { color: 'Blue', color_hex: '#596e7c', range_type: '2-Seater', price: 199, stock: 1, images: [] }],
    } });
    assert.equal(missingPhoto.status(), 400, await missingPhoto.text());
    assert.deepEqual(await getProducts(), beforeInvalid, 'Missing-photo validation must not mutate the catalogue.');
    const invalidDiscount = await context.request.put(`${origin}/api/products/${product.id}/`, { data: { ...updated, compare_at_price: 199 } });
    assert.equal(invalidDiscount.status(), 400, await invalidDiscount.text());
    assert.deepEqual(await getProducts(), beforeInvalid, 'Invalid-discount validation must not mutate the catalogue.');
    const deletion = await context.request.delete(`${origin}/api/products/${product.id}/`);
    assert.equal(deletion.status(), 200, await deletion.text());
    assert.deepEqual(await getProducts(), []);
    assert.deepEqual(browserErrors, [], 'The browser must not report uncaught errors.');
    console.log('PASS: admin updates broadcast, removed colours disappear, discount clears, IDs persist, invalid requests reject without mutation, fixture deletion.');
  } catch (error) {
    failure = error;
    await Promise.allSettled([admin, shop, detail].filter(Boolean).map((page, index) => page.screenshot({ path: path.join(artifacts, `product-options-failure-${index}.png`), fullPage: true })));
  } finally {
    await browser?.close();
    await stopServer(server);
    await fs.mkdir(artifacts, { recursive: true });
    await fs.writeFile(path.join(artifacts, `product-options-server-${runId}.log`), serverLog);
    const finalFingerprint = await fingerprint(actualProductsFile);
    if (finalFingerprint !== initialFingerprint) {
      const isolationError = new Error('The actual .local-data/products.json fingerprint changed during verification.');
      failure = failure ? new AggregateError([failure, isolationError], 'Verification and catalogue isolation failed.') : isolationError;
    }
  }
  if (failure) throw failure;
  console.log('PASS: isolated server stopped; actual .local-data/products.json is unchanged.');
}

module.exports = { frontend, artifacts, actualProductsFile, fingerprint, freePort, stopServer, waitForServer, assertNoOverflow, expectPhoto, submitEditor };
if (require.main === module) main().catch((error) => { console.error(error); process.exitCode = 1; });
