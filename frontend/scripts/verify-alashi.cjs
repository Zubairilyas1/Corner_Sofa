// Browser checks use real policy replies and mocked admin writes; no business data is changed.
const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:3100/',{waitUntil:'domcontentloaded'});
await page.getByRole('button',{name:/ALASHI.*Your sofa assistant/}).click();
await expect(page.getByLabel('Message ALASHI')).toBeVisible();
await expect(page.getByText('Add photo',{exact:true})).toBeVisible();await expect(page.getByText('Add document',{exact:true})).toBeVisible();
await page.getByLabel('Message ALASHI').fill('I want a corner sofa');await page.getByRole('button',{name:'Send to ALASHI',exact:true}).click();await expect(page.getByRole('log')).toContainText('Leather Corner Sofa',{timeout:20000});
await page.getByLabel('Message ALASHI').fill('What is the price?');await page.getByRole('button',{name:'Send to ALASHI',exact:true}).click();await expect(page.getByRole('log')).toContainText('VAT included',{timeout:20000});
await expect(page.getByLabel('Message ALASHI')).toBeEnabled({timeout:20000});
await fs.mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/alashi-desktop.png'});
await page.setViewportSize({width:390,height:844});await expect(page.getByLabel('Message ALASHI')).toBeVisible();await page.screenshot({path:'artifacts/alashi-mobile.png'});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Mobile overflow');
await page.getByRole('button',{name:/Add to basket/}).last().click();await page.goto('http://localhost:3100/cart/',{waitUntil:'domcontentloaded'});await expect(page.getByRole('link',{name:'Continue to checkout',exact:true})).toHaveAttribute('href','/alashi-checkout/');
await page.addInitScript(()=>{localStorage.setItem('admin_token','ui-only-test');localStorage.setItem('admin_token_expires',String(Date.now()+3600000));});
let saved;await page.route(/\/api\/admin\/alashi\/?$/,route=>{if(route.request().method()==='POST'){saved=route.request().postDataJSON();return route.fulfill({json:{success:true}});}return route.fulfill({json:{connected:false,records:[{kind:'question',id:'question:test',value:{id:'question:test',text:'Can I request a fabric sample?',created:new Date().toISOString()}}]}});});
await page.setViewportSize({width:1440,height:1000});await page.goto('http://localhost:3100/admin/alashi/',{waitUntil:'domcontentloaded'});await expect(page.getByRole('heading',{name:'ALASHI',exact:true})).toBeVisible();await expect(page.getByText('AI connection needs setup')).toBeVisible();await expect(page.getByText('Minimum (£)',{exact:true})).toHaveCount(6);
await page.getByRole('button',{name:'Answer and teach ALASHI'}).click();await page.getByLabel('Approved answer / business information').fill('Request a sample using the swatch form.');await page.getByRole('button',{name:'Approve and save knowledge'}).click();await expect(page.getByRole('status').filter({hasText:'Saved.'})).toContainText('Saved.');if(saved.action!=='answer')throw Error('Expected owner answer approval');
await page.screenshot({path:'artifacts/alashi-admin.png'});if(errors.length)throw Error(errors.join('\n'));console.log('ALASHI desktop/mobile chat, policy reply, six admin ranges and owner approval UI passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
