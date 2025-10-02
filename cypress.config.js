const { defineConfig } = require("cypress");
const codeCoverageTask = require("@cypress/code-coverage/task");
const CustomReporter = require('./cypress/support/customReporter');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      
      CustomReporter.resetResults();
      
      on('test:after:run', (test) => {
        CustomReporter.onTestComplete(test);
      });

      on('after:run', async () => {
        const fetch = await import('node-fetch');
        try {
          const response = await fetch.default('http://127.0.0.1:8000/api/automation/store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': process.env.API_KEY || 'STATIC-ADMIN-TOKEN-1234567890'
            },
            body: JSON.stringify(CustomReporter.getResults())
          });

          if (!response.ok) {
            throw new Error(`API response: ${response.status}`);
          }
          
          console.log('Test results successfully sent to API');
          
          // Save results locally
          const fs = require('fs');
          const resultsDir = './cypress/results';
          if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
          }
          fs.writeFileSync(
            `${resultsDir}/test-results-${new Date().toISOString().split('T')[0]}.json`,
            JSON.stringify(CustomReporter.getResults(), null, 2)
          );
        } catch (error) {
          console.error('Failed to send test results:', error);
        }
      });

      return config;
    },
    baseUrl: "https://crabal.fata-organa.com",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
  },
  env: {
    coverage: true,
  },
  reporter: "spec",
  coverage: {
    reportsDirectory: "cypress/reports/coverage",
  },
});
