// UI-only checks: sign-in responses and populated chart scenarios are intercepted
// in an isolated browser. No real credentials or server-side records are changed.
const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
let browser;
(async () => {
  browser = await chromium.launch({channel:'chrome',headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await fs.mkdir('artifacts',{recursive:true});
  let acceptLogin=false;
  await page.route(/\/api\/admin\/auth\/?$/,route=>route.fulfill({
    status:acceptLogin?200:401,contentType:'application/json',
    body:JSON.stringify(acceptLogin?{success:true,token:'isolated-dashboard-ui-test',expiresAt:Date.now()+3600000}:{success:false,error:'Invalid password'}),
  }));
  await page.goto('http://localhost:3000/admin/',{waitUntil:'networkidle',timeout:120000});
  await expect(page.getByLabel('Admin password')).toBeVisible();
  await expect(page.locator('.site-footer')).toHaveCount(0);
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toHaveCount(0);
  await page.screenshot({path:'artifacts/admin-login.png',fullPage:true});
  await page.getByLabel('Admin password').fill('ui-test');
  await page.getByRole('button',{name:'Sign in to workspace'}).click();
  await expect(page.locator('#admin-login-error')).toContainText('Invalid password');
  acceptLogin=true;
  await page.getByRole('button',{name:'Sign in to workspace'}).click();
  await expect(page.getByRole('heading',{name:'Welcome back, Admin'})).toBeVisible({timeout:20000});
  await expect(page.getByRole('button',{name:'Refresh dashboard'})).toBeEnabled({timeout:30000});
  await expect(page.getByRole('navigation',{name:'Admin navigation'}).getByRole('link',{name:'Dashboard',exact:true})).toHaveAttribute('aria-current','page');
  await page.screenshot({path:'artifacts/admin-dashboard-desktop.png',fullPage:true});
  for(const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:950});
    const size=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
    if(size.document>size.viewport+1) throw Error('Admin horizontal overflow at '+JSON.stringify(size));
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'artifacts/admin-dashboard-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'7 days',exact:true}).click();
  await expect(page.getByRole('button',{name:'7 days',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'12 months',exact:true}).click();
  await expect(page.getByRole('button',{name:'12 months',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByLabel('Filter activity').selectOption('orders');
  await expect(page.getByRole('heading',{name:'On your radar'})).toBeVisible();
  await page.getByLabel('Filter activity').selectOption('all');
  await page.getByRole('searchbox',{name:'Find a workspace'}).fill('products');
  await expect(page.getByRole('link',{name:'Manage products',exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:'View orders',exact:true})).toHaveCount(0);
  await page.getByRole('link',{name:'Manage products',exact:true}).click();
  await expect(page).toHaveURL(/\/admin\/products/);
  await page.getByRole('navigation',{name:'Admin navigation'}).getByRole('link',{name:'Dashboard',exact:true}).click();
  await expect(page.getByRole('button',{name:'Refresh dashboard'})).toBeEnabled({timeout:30000});
  const liveProducts=await (await page.request.get('http://localhost:3000/api/products/')).json();
  const timeBefore=(days)=>new Date(Date.now()-days*86400000).toISOString();
  const fixtureOrders=Array.from({length:40},(_,i)=>({id:'UI-'+i,customer:'Preview customer '+i,total:1799,status:i%2?'pending':'processing',date:timeBefore((i*i+3*i)%29)}));
  const fixtureAppointments=Array.from({length:23},(_,i)=>({id:'UI-APT-'+i,customer_name:'Preview visitor '+i,appointment_date:timeBefore(-7),created_at:timeBefore((i*i+2)%28),status:'pending'}));
  const fixtureSwatches=Array.from({length:31},(_,i)=>({id:'UI-SW-'+i,customer_name:'Preview sample '+i,swatch_ids:['a','b'],created_at:timeBefore((i*5+4)%27),status:'pending'}));
  const fixtures={
    '/api/admin/stats/':{products:liveProducts.length,orders:40,appointments:23,swatchRequests:31,pendingAppointments:23,pendingSwatches:31,lowStockProducts:2},
    '/api/orders/':fixtureOrders, '/api/appointment/':fixtureAppointments, '/api/swatch-request/':fixtureSwatches,
  };
  for(const [url,data] of Object.entries(fixtures)) await page.route('**'+url,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)}));
  await page.reload({waitUntil:'networkidle'});
  await expect(page.getByRole('button',{name:'Refresh dashboard'})).toBeEnabled();
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'artifacts/admin-dashboard-populated-fixture.png',fullPage:true});
  const points=page.locator('svg[aria-label="Orders, appointments, and swatch requests over time"] rect[role="button"]');
  await expect(points).toHaveCount(30);
  await points.nth(10).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(points.nth(11)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.getByRole('button',{name:'7 days',exact:true}).click();
  await expect(points).toHaveCount(7);
  await page.route('**/api/admin/stats/',route=>route.fulfill({status:500,contentType:'application/json',body:'{}'}));
  await page.getByRole('button',{name:'Refresh dashboard'}).click();
  await expect(page.getByText('Some data couldn’t be loaded: overview.')).toBeVisible();
  await page.getByRole('button',{name:'Sign out',exact:true}).click();
  await expect(page.getByLabel('Admin password')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('admin_token'))).toBeNull();
  await page.goto('http://localhost:3000/',{waitUntil:'networkidle',timeout:120000});
  await expect(page.getByRole('heading',{name:'Come home to comfort.'})).toBeVisible();
  await expect(page.locator('.site-footer')).toBeVisible();
  if(errors.length) throw Error(errors.join('\n'));
  console.log('PASS: admin login/error/logout UI, no shop chrome in admin, responsive 320–1440px, period controls, filters, workspace search, navigation, populated chart keyboard tooltips, error states, storefront preserved. Backend untouched; test login and populated data intercepted only in browser.');
  await browser.close();
})().catch(async error=>{console.error(error);await browser?.close();process.exit(1)});
