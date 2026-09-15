const {chromium,expect}=require('@playwright/test');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('http://localhost:3200/products/');
 await page.getByRole('button',{name:/ALASHI.*Your sofa assistant/}).click();
 await expect(page.getByRole('button',{name:'Clear chat',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Save chat',exact:true})).toBeVisible();
 async function send(text){await page.getByLabel('Message ALASHI').fill(text);await page.getByRole('button',{name:'Send to ALASHI',exact:true}).click();await expect(page.getByLabel('Message ALASHI')).toBeEnabled({timeout:20000});}
 await send('I want a corner sofa');
 await send('confirm my order');
 await expect(page.getByRole('log')).toContainText('Please confirm your selection');
 await page.reload();await page.getByRole('button',{name:/ALASHI.*Your sofa assistant/}).click();
 await expect(page.getByRole('log')).toContainText('Please confirm your selection');
 await send('yes');await expect(page.getByRole('button',{name:/Continue to checkout/})).toBeVisible();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Save chat',exact:true}).click();await download;
 await page.getByRole('button',{name:'Clear chat',exact:true}).click();await send('yes');
 await expect(page.getByRole('log')).toContainText('choose one sofa first');
 await expect(page.getByRole('button',{name:/Continue to checkout/})).toHaveCount(0);
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Mobile overflow');
 console.log('Mobile summary, confirmation, refresh recovery, export and full reset passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
