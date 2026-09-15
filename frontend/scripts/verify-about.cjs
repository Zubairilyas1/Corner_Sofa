const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs/promises');

const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
let browser;

(async () => {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await fs.mkdir('artifacts', { recursive: true });
  await page.goto(`${base}/about/`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: /Timeless comfort/ })).toBeVisible();
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Free UK delivery.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cash on delivery.' })).toBeVisible();

  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 1) throw new Error(`About page overflows at ${width}px by ${overflow}px`);
  }

  const carousel = page.getByRole('region', { name: 'Sofa collections' });
  await page.getByRole('button', { name: 'Next collection' }).click();
  await expect(carousel.getByRole('heading', { name: 'Corner Collection' })).toBeVisible();
  await expect(carousel.getByRole('link', { name: 'Explore Corner Collection' })).toHaveAttribute('href', /^\/products\/?\?category=Corner$/);
  await page.getByRole('button', { name: 'Previous collection' }).click();
  await expect(carousel.getByRole('heading', { name: 'Sofa Collection' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Navigation menu' });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Plan your room' })).toHaveAttribute('href', '/room-planner/');
  await page.keyboard.press('Tab');
  const focusInside = await menu.evaluate(dialog => dialog.contains(document.activeElement));
  if (!focusInside) throw new Error('Menu focus escaped the dialog');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused();

  await page.getByRole('button', { name: /^Open basket/ }).click();
  await expect(page.getByRole('dialog', { name: 'Your basket' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Your basket' })).toBeHidden();

  await page.getByRole('button', { name: 'Search sofas', exact: true }).click();
  const search = page.getByRole('dialog', { name: 'Search the collection' });
  await expect(search.getByRole('searchbox', { name: 'Search sofas' })).toBeFocused();
  await search.getByRole('searchbox', { name: 'Search sofas' }).fill('corner');
  await search.getByRole('button', { name: 'Search', exact: true }).click();
  await page.waitForURL(/\/products\/?\?q=corner/);
  await expect(page.getByRole('searchbox', { name: 'Search sofas', exact: true })).toHaveValue('corner');

  await page.goto(`${base}/about/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'artifacts/about-mobile.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/about-mobile-first-view.png' });
  await page.getByRole('region', { name: 'Sofa collections' }).scrollIntoViewIfNeeded();
  await page.getByRole('region', { name: 'Sofa collections' }).screenshot({ path: 'artifacts/about-mobile-collection.png' });
  await expect.poll(() => page.locator('header').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(252, 250, 245)');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.locator('header').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  await page.screenshot({ path: 'artifacts/about-desktop.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/about-desktop-first-view.png' });

  const broken = await page.locator('img').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.currentSrc));
  if (broken.length) throw new Error(`Broken About page images: ${broken.join(', ')}`);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('PASS: About page, responsive layouts, collection navigation, menu focus, search, basket and images.');
  await browser.close();
})().catch(async error => { console.error(error); await browser?.close(); process.exit(1); });
