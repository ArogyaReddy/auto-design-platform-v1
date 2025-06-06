// support/hooks.js
const {Before, After, BeforeAll, AfterAll, setDefaultTimeout} = require('@cucumber/cucumber');
const {chromium} = require('playwright');

setDefaultTimeout(60 * 1000); // Set default step timeout

BeforeAll(async function () {
  global.browser = await chromium.launch({headless: false}); // Launch browser once
});

Before(async function (scenario) {
  console.log(`Starting scenario: ${scenario.pickle.name}`);
  global.context = await global.browser.newContext();
  global.page = await global.context.newPage();
});

After(async function (scenario) {
  console.log(`Finished scenario: ${scenario.pickle.name} - Status: ${scenario.result.status}`);
  if (global.page) {
    await global.page.close();
  }
  if (global.context) {
    await global.context.close();
  }
});

AfterAll(async function () {
  if (global.browser) {
    await global.browser.close();
  }
});
