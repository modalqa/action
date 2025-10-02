const CustomReporter = {
  results: {
    project: 1,
    date: new Date().toISOString().split('T')[0],
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      executionTime: "0ms"
    },
    detailedResults: []
  },

  resetResults() {
    this.results.summary = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      executionTime: "0ms"
    };
    this.results.detailedResults = [];
    this.results.date = new Date().toISOString().split('T')[0];
  },

  onTestComplete(test) {
    const testCase = {
      testCaseId: `TC-${this.results.detailedResults.length + 1}`,
      testCaseName: test.title.join(' - '),
      status: test.state === 'passed' ? 'Passed' : 'Failed',
      executionTime: `${test.duration}ms`,
      steps: test.commands?.map((cmd, idx) => ({
        step: idx + 1,
        description: cmd.name,
        status: cmd.state === 'passed' ? 'Passed' : 'Failed'
      })) || []
    };

    this.results.detailedResults.push(testCase);
    this.updateSummary(test);
  },

  updateSummary(test) {
    this.results.summary.totalTests++;
    if (test.state === 'passed') this.results.summary.passed++;
    else if (test.state === 'failed') this.results.summary.failed++;
    else this.results.summary.skipped++;
    this.results.summary.executionTime = `${test.wallClockDuration || 0}ms`;
  },

  getResults() {
    return this.results;
  }
};

module.exports = CustomReporter;