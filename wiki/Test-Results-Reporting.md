# Test Results Reporting

This document explains how test results are reported and analyzed in our Cypress framework.

## Automatic Test Reporting

### Test Results API Integration

Our framework automatically sends test results to a reporting API after each test run. The results include:

```javascript
{
  "project": 1,
  "date": "2025-10-02",
  "summary": {
    "totalTests": 2,
    "passed": 1,
    "failed": 1,
    "skipped": 0,
    "executionTime": "8340ms"
  },
  "detailedResults": [
    {
      "testCaseId": "TC-001",
      "testCaseName": "Test name",
      "status": "Passed/Failed",
      "executionTime": "2017ms",
      "steps": [
        {
          "step": 1,
          "description": "Step description",
          "status": "Passed/Failed"
        }
      ]
    }
  ]
}
```

### Coverage Reports

Code coverage reports are generated using `@cypress/code-coverage`:

1. Install the plugin:
```bash
npm install --save-dev @cypress/code-coverage
```

2. Configure in your application:
```javascript
// cypress.config.js
module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },
}
```

### Screenshots and Videos

Screenshots are automatically captured on test failure:
```
cypress/screenshots/
└── test-name/
    └── failure-screenshot.png
```

## GitHub Actions Integration

Test results are available in GitHub Actions:

```yaml
- name: Upload Test Results
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: test-results
    path: cypress/reports/
```

## Local Test Results

To view test results locally:

1. Run tests with reporting:
```bash
npm run test
```

2. View results in `cypress/reports/`

## Interpreting Results

### Success Criteria

- All tests pass
- Code coverage meets minimum threshold
- No critical path failures

### Common Failure Patterns

1. **Network Issues**
   - Connection timeouts
   - API response errors

2. **Element Interaction Issues**
   - Elements not visible
   - Wrong selectors

3. **Assertion Failures**
   - Unexpected state
   - Data validation errors

### Debugging Failed Tests

1. Check the screenshot:
```bash
open cypress/screenshots/
```

2. Review test logs:
```bash
cat cypress/logs/test.log
```

3. Analyze network logs in `cypress/network-logs/`