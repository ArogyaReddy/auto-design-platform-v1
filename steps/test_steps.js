const {Given} = require('@cucumber/cucumber');
console.log('Minimal steps loading');
Given('I do something', function () {
  console.log('Minimal step executed');
});
