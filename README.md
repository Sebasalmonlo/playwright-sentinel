# playwright-sentinel

Playwright Sentinel helps teams find, track, and control flaky Playwright tests before they waste engineering time or weaken trust in CI.

If your product has automated browser tests, some tests may fail randomly even when the app is working. Those failures slow releases down because developers and QA engineers have to stop and ask:

- Is the product actually broken?
- Did the test fail because it is unreliable?
- Which tests are repeatedly causing noise?
- Should this build be blocked or allowed to continue?

Sentinel answers those questions locally from your Playwright test history.

## The Problem

End-to-end tests are valuable, but flaky tests create expensive uncertainty.

A flaky test is a test that sometimes passes and sometimes fails without a real product change. Over time, teams start ignoring failures, rerunning CI until it passes, or spending hours investigating false alarms.

That creates three practical problems:

- QA loses time investigating failures that are not real bugs.
- Developers lose trust in the test suite.
- CI becomes noisy, so release decisions get slower and riskier.

## What Sentinel Does

Sentinel is a local-first CLI tool for Playwright test intelligence.

It records Playwright test results into a local SQLite database, calculates a flakiness score for each test, prints a health report in the terminal, and can fail a command when a test is above your allowed flakiness threshold.

In plain terms:

- It watches your Playwright results.
- It remembers test history locally.
- It tells you which tests look unreliable.
- It gives each test a score from `0/100` to `100/100`.
- It can fail CI if the score is too high.

## Who It Is For

Sentinel is useful for:

- QA engineers maintaining Playwright suites
- developers debugging repeated test failures
- small teams that need better test visibility without buying a cloud QA platform
- open-source projects that want local test health reporting
- CI pipelines that need a simple flakiness gate

## Example Use Case

Imagine your checkout test fails twice this week, but the product is not actually broken.

Without Sentinel, the team may rerun CI, ignore the failure, or spend time manually checking old runs.

With Sentinel, you can run:

```bash
npm run sentinel -- report
```

and see that the checkout test has a high flakiness score. Then you can decide to fix that test, quarantine it, or block CI only when the score passes a threshold.

For CI enforcement:

```bash
npm run sentinel -- watch --threshold 50
```

If any test scores higher than `50/100`, the command exits with failure code `1`.

## How It Works

1. Playwright runs your tests.
2. Sentinel's Playwright reporter saves each result to `.sentinel.db`.
3. Sentinel calculates flakiness scores from the saved history.
4. You run `report` to inspect test health.
5. You run `watch --threshold` when you want CI to fail on unhealthy tests.

All data stays on your machine by default.

## Features

- Playwright reporter that records test results locally
- SQLite persistence through `better-sqlite3`
- Flakiness scoring by test
- Terminal report table
- `--last` option for recent-run analysis
- CI-friendly threshold checks
- TypeScript + ESM + `tsx`
- No Docker
- No required cloud service

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

## View A Flakiness Report

```bash
npm run sentinel -- report
```

Limit scoring to the most recent runs per test:

```bash
npm run sentinel -- report --last 10
```

## Enforce A CI Threshold

Use `watch` when you want the command to fail if any test exceeds a flakiness score.

```bash
npm run sentinel -- watch --threshold 50
```

This exits with code `1` when any test has a score higher than `50`, which makes it suitable for CI.

You can also combine it with `--last`:

```bash
npm run sentinel -- watch --threshold 30 --last 5
```

## Current Scope

Sentinel is currently a local CLI tool. It does not replace Playwright, and it does not run tests by itself. It adds memory, scoring, reporting, and enforcement on top of Playwright results.

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
