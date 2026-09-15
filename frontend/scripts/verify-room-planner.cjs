// Browser interaction checks use an isolated catalogue and image fixtures; no shop data is changed.
const { chromium, expect } = require('@playwright/test');
const sharp = require('sharp');
const fs = require('node:fs/promises');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const room = await sharp({ create: { width: 1000, height: 700, channels: 3, background: '#e4e0d7' } }).png().toBuffer();
    const sofa = await sharp({ create: { width: 240, height: 90, channels: 4, background: '#64715c' } }).png().toBuffer();
    const product = { id: 'planner-test', slug: 'planner-test', title: 'Planner test sofa', description: '', base_price: 500, images: ['/placeholder.svg'], category: 'Corner', dimensions_cm: { width: 240, depth: 160, height: 90 }, variants: [
      { id: 'olive', color: 'Olive', color_hex: '#64715c', range_type: 'Corner', price: 500, stock: 3 },
      { id: 'blue', color: 'Blue', color_hex: '#596e7c', range_type: 'Corner', price: 550, stock: 2 },
    ] };
    const straight = { ...product, id: 'straight-test', title: 'Straight test sofa', category: '3-Seater', dimensions_cm: null };
    await page.route('**/api/products/', route => route.fulfill({ json: [product, straight] }));
    await page.route('**/api/room-planner/sofa/**', route => route.fulfill({ contentType: 'image/png', body: sofa }));
    await page.goto(`${base}/room-planner/`);
    await expect(page.getByRole('link', { name: 'Try in your room' })).toBeVisible();
    expect(await page.getByRole('navigation', { name: 'Room planner steps' }).getByRole('button').allTextContents()).toEqual([
      expect.stringContaining('Your room'),
      expect.stringContaining('Mark wall space'),
      expect.stringContaining('Fit sofa'),
    ]);

    await page.getByLabel('Upload room photo', { exact: true }).setInputFiles({ name: 'room.png', mimeType: 'image/png', buffer: room });
    await expect(page.getByRole('heading', { name: 'Show the sofa wall.' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Mark wall space/ })).toHaveAttribute('aria-current', 'step');
    await expect(page.getByRole('button', { name: /^Placement point/ })).toHaveCount(4);
    await expect(page.getByRole('spinbutton')).toHaveCount(0);
    await expect(page.getByRole('checkbox')).toHaveCount(0);
    await fs.mkdir('artifacts', { recursive: true });
    await page.screenshot({ path: 'artifacts/room-planner-four-points.png', fullPage: true });
    await page.getByRole('button', { name: 'Choose my sofa' }).click();
    await expect(page.getByRole('heading', { name: 'Choose your sofa.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Choose a sofa first.' })).toBeVisible();

    await page.getByRole('button', { name: /Planner test sofa/ }).click();
    await expect(page.getByRole('heading', { name: 'Fit sofa to wall.' })).toBeVisible();
    await expect(page.getByRole('img', { name: /Planner test sofa in Olive/ })).toBeVisible();
    const box = await page.getByRole('img', { name: /Planner test sofa in Olive/ }).evaluate(image => ({ left: parseFloat(image.style.left), top: parseFloat(image.style.top), width: parseFloat(image.style.width), height: parseFloat(image.style.height) }));
    if (box.left < 0 || box.top < 0 || box.left + box.width > 100.1 || box.top + box.height > 100.1) throw new Error(`Complete sofa must remain inside the room photo: ${JSON.stringify(box)}`);
    await expect(page.getByRole('button', { name: 'Fit marked wall', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('slider', { name: /rotate/i })).toHaveCount(0);
    await expect(page.getByTestId('fit-result')).toContainText('Fitted to your marked wall');
    await page.getByRole('button', { name: 'Blue', exact: true }).click();
    await expect(page.getByRole('img', { name: /Planner test sofa in Blue/ })).toBeVisible();
    await page.getByRole('button', { name: /Straight test sofa/ }).click();
    await expect(page.getByRole('img', { name: /Straight test sofa in Olive/ })).toBeVisible();

    const columns = await Promise.all([
      page.getByRole('complementary', { name: 'Sofa and colour choices' }).boundingBox(),
      page.getByRole('region', { name: 'Room preview' }).boundingBox(),
      page.getByRole('complementary', { name: 'Sofa wall adjustment controls' }).boundingBox(),
    ]);
    if (!columns.every(Boolean) || !(columns[0].x < columns[1].x && columns[1].x < columns[2].x)) throw new Error('Desktop panels must be colour choices, room preview, then compact wall controls.');
    await page.getByRole('button', { name: 'Change marked wall' }).click();
    await expect(page.getByRole('button', { name: /^Placement point/ })).toHaveCount(4);
    await page.getByRole('button', { name: 'Choose my sofa' }).click();
    await page.getByRole('button', { name: /Straight test sofa/ }).click();
    const visualDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Save preview' }).click();
    await visualDownload;
    await page.getByRole('button', { name: 'Add sofa to basket' }).click();
    await expect(page.getByRole('button', { name: 'Added to basket', exact: true })).toBeDisabled();

    await fs.mkdir('artifacts', { recursive: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: 'artifacts/room-planner-three-column.png', fullPage: true });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error(`Planner overflows at ${width}px`);
      await expect(page.getByRole('spinbutton')).toHaveCount(0);
    }
    await page.screenshot({ path: 'artifacts/room-planner-mobile.png', fullPage: true });
    for (const path of ['/products/', '/cart/', '/contact/']) {
      await page.goto(base + path);
      await expect(page.getByRole('link', { name: 'Try in your room' })).toBeVisible();
    }
    expect(errors).toEqual([]);
    console.log('Room planner: marked wall, front-view sofa, left-side colours, compact right-side controls, export, basket and mobile layout passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
