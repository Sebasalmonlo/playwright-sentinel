# playwright-sentinel

Local-first Playwright test intelligence for flakiness scoring, health tracking, trend reporting, and CI threshold enforcement.

Sentinel stores test history in a local SQLite database called `.sentinel.db`. There is no Docker setup and no cloud service required.

## Features

- Playwright reporter that records test results locally
- SQLite persistence through `better-sqlite3`
- Flakiness scoring by test
- Terminal report table
- CI-friendly threshold checks
- TypeScript + ESM + `tsx`

## Install

```bash
npm install
```

## Configure Playwright

Add the Sentinel reporter to `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['./src/core/reporter.ts']
  ]
});
```

## Record Test Runs

Run Playwright normally:

```bash
npm run test:e2e
```

The Sentinel reporter writes results to `.sentinel.db`.

## View Report

```bash
npm run sentinel -- report
```

Limit scoring to the most recent runs per test:

```bash
npm run sentinel -- report --last 10
```

## Enforce A Threshold

Use `watch` when you want the command to fail if any test exceeds a flakiness score.

```bash
npm run sentinel -- watch --threshold 50
```

This exits with code `1` when any test has a score higher than `50`, which makes it suitable for CI.

You can also combine it with `--last`:

```bash
npm run sentinel -- watch --threshold 30 --last 5
```

## Development

Run TypeScript checks:

```bash
npm run typecheck
```

Run unit tests:

```bash
npm run test:unit
```

Run the default test command:

```bash
npm test
```

## Notes

- Use `tsx`, not `ts-node`.
- Do not install `@types/cli-table3`.
- `.sentinel.db` is local runtime data and should not be committed.
