Feature: Basic Application Interaction
    Scenario: Navigate to a website and check title
    Given I open the browser
    When I navigate to "https://www.saucedemo.com"
    Then the page title should contain "Swag Labs"
    Then I close the browser