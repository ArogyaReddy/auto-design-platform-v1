// support/world.js
const {setWorldConstructor, World} = require('@cucumber/cucumber');
const playwright = require('playwright');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    // Initialize Playwright specific instances here if needed per scenario
    // this.browser = null; // Will be set in a Before hook
    // this.page = null;
    this.testData = {};
    this.worldParameters = options.parameters; // Access worldParameters from config
  }

  // Add custom methods to your world
  async openUrl(url) {
    await page.goto(url); // Assuming 'page' is attached to the global scope or 'this' by a hook
  }
}
setWorldConstructor(CustomWorld);
