const { chromium, expect } = require('@playwright/test');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
let browser;
(async () => {
  browser = await chromium.launch({channel:'chrome',headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const products = await (await page.request.get(`${base}/api/products/`)).json();
  const product = products[0];
  const records = [];
  let submitted = '';
  // Review submissions are intercepted; no test reviews enter the shop's stored data.
  await page.route(/\/api\/reviews\/?(?:\?.*)?$/, async route => {
    if (route.request().method() === 'POST') {
      submitted = route.request().postDataBuffer().toString();
      const record = {id:'isolated-review',name:'Review test',text:'A comfortable sofa in our home.',rating:5,product_id:product.id,product_title:product.title,photos:[],created_at:new Date().toISOString()};
      records.unshift(record);
      return route.fulfill({status:201,json:record});
    }
    return route.fulfill({json:route.request().url().includes('summary') ? records.length ? {[product.id]:{count:1,average:5}} : {} : records});
  });
  await page.goto(`${base}/reviews/?product=${product.id}`, {waitUntil:'networkidle'});
  await expect(page.getByRole('heading',{name:/Hear what our/})).toBeVisible();
  await expect(page.locator('select[name=product_id]')).toHaveValue(product.id);
  await page.getByLabel('Your name').fill('Review test');
  await page.getByRole('radio',{name:'5 stars',exact:true}).check();
  await page.getByLabel('Your review', {exact:true}).fill('A comfortable sofa in our home.');
  await page.locator('input[type=file]').setInputFiles('public/images/sofas/premium-sofa-bed.webp');
  await expect(page.getByAltText('Selected sofa photo 1')).toBeVisible();
  await page.getByRole('button',{name:'Share your review',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Your review has been published');
  if (!submitted.includes('name="photos"') || !submitted.includes('name="rating"')) throw Error('Missing review fields or photo');
  await expect(page.getByRole('article')).toHaveCount(1);
  for (const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:1000});
    if (await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw Error(`Overflow at ${width}`);
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'artifacts/reviews-desktop.png',fullPage:true});
  await page.goto(`${base}/product/${product.id}`,{waitUntil:'networkidle'});
  await expect(page.getByRole('link',{name:'5.0 out of 5, 1 reviews. Rate this sofa'}).first()).toBeVisible();
  console.log('PASS: review form, photo selection, product rating and responsive layout (isolated submissions).');
  await browser.close();
})().catch(async error=>{console.error(error);await browser?.close();process.exit(1)});
