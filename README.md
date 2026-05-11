# playwright-sentinel
Test suite intelligence for Playwright — flakiness scoring, health tracking, and trend reporting.

## Local usage

```bash
npm install
npm run sentinel -- report
```

Limit scoring to the most recent runs per test:

```bash
npm run sentinel -- report --last 10
```

Playwright runs write local results to `.sentinel.db` through the configured Sentinel reporter.
