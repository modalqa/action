# CI/CD Integration

This document details how our Cypress framework integrates with CI/CD pipelines, specifically GitHub Actions.

## GitHub Actions Configuration

### Main Workflow

```yaml
name: Cypress Tests
on: 
  schedule:
    - cron: '0 */3 * * *'  # Run every 3 hours
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install Dependencies
        run: npm ci

      - name: Run Cypress Tests
        run: npm run test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: cypress-results
          path: cypress/reports/

      - name: Report Test Results
        if: always()
        run: node report-results.js
        env:
          API_KEY: ${{ secrets.REPORT_API_KEY }}
```

## Environment Setup

### Required Secrets

Set up these secrets in GitHub repository settings:

1. `BASE_URL`: Application URL for testing
2. `REPORT_API_KEY`: API key for test reporting

### Environment Variables

Local development `.env`:
```env
BASE_URL=https://your-app.com
REPORT_API_KEY=your-api-key
```

## Test Execution

### Scheduled Tests

Tests run automatically:
- Every 3 hours
- On push to main branch
- On pull requests

### Manual Triggers

Trigger workflow manually:
1. Go to Actions tab
2. Select "Cypress Tests"
3. Click "Run workflow"

## Reporting Integration

### Test Results API

Results are sent after each run:
```javascript
// report-results.js
const axios = require('axios');

async function sendResults() {
  const results = require('./cypress/reports/results.json');
  await axios.post('https://api.example.com/results', results);
}

sendResults();
```

### Artifacts

Test artifacts are uploaded:
- Screenshots
- Videos
- Reports
- Logs

## Failure Handling

### Retry Strategy

Failed tests are retried:
```javascript
// cypress.config.js
module.exports = {
  e2e: {
    retries: {
      runMode: 2,
      openMode: 0
    }
  }
}
```

### Notifications

Set up failure notifications:
```yaml
- name: Notify on Failure
  if: failure()
  uses: rtCamp/action-slack-notify@v2
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    SLACK_MESSAGE: 'Cypress Tests Failed!'
```

## Performance Optimization

### Caching

Implement dependency caching:
```yaml
- name: Cache Dependencies
  uses: actions/cache@v2
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Parallel Execution

Run tests in parallel:
```yaml
jobs:
  cypress-run:
    strategy:
      fail-fast: false
      matrix:
        containers: [1, 2, 3, 4]
```