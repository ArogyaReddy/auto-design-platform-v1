// AI-Driven-Framework/steps/TeamA/ProjectA/sampleSteps.js
console.log('DEBUG: sampleSteps.js file is being loaded by Cucumber!');

const {Given, When, Then, And, BeforeAll, AfterAll, setDefaultTimeout} = require('@cucumber/cucumber');
const {chromium} = require('playwright');
const {expect} = require('chai');

setDefaultTimeout(60 * 1000);
let browser;
let page;
let context;

BeforeAll(async function () {
  browser = await chromium.launch({headless: true});
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

// Given('I navigate to {string}', async function (url) {
//   context = await browser.newContext();
//   page = await context.newPage();
//   await page.goto(url);
// });

Then('the page title should contain {string}', async function (expectedTitleSubstring) {
  const title = await page.title();
  expect(title).to.include(expectedTitleSubstring);
  await page.close();
  await context.close();
});

Given('I navigate to nothing', async function () {
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(url);
});

Then('I close the browser', async function () {
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(url);
});
Then('the title should be something', async function () {
  const title = await page.title();
  expect(title).to.include(expectedTitleSubstring);
  await page.close();
  await context.close();
});

Given('I open the browser', async function () {
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(url);
});

When('I navigate to {string}', async function (url) {
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(url);
});

// Inside steps/TeamA/ProjectA/sampleSteps.js

// ... other code ...

// === MANUALLY RETYPE THE FOLLOWING LINE CAREFULLY ===
Given('I navigate to {string}', async function (url) {
  // ... your code ...
});

// === MANUALLY RETYPE THE FOLLOWING LINE CAREFULLY ===
Then('the page title should contain {string}', async function (expectedTitleSubstring) {
  // ... your code ...
});
