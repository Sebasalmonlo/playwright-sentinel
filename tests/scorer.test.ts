import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateScoresFromRuns } from '../src/core/scorer.js';
import type { TestRun } from '../src/types/index.js';

function run(overrides: Partial<TestRun>): TestRun {
  return {
    test_title: 'checkout works',
    file_path: '/repo/tests/checkout.spec.ts',
    status: 'passed',
    duration: 100,
    timestamp: '2026-05-11T10:00:00.000Z',
    ...overrides
  };
}

describe('calculateScoresFromRuns', () => {
  it('returns no scores when there are no runs', () => {
    assert.deepEqual(calculateScoresFromRuns([]), []);
  });

  it('scores stable tests at zero', () => {
    const scores = calculateScoresFromRuns([
      run({ timestamp: '2026-05-11T10:00:00.000Z' }),
      run({ timestamp: '2026-05-11T09:00:00.000Z' })
    ]);

    assert.equal(scores[0].flakiness_score, 0);
    assert.equal(scores[0].failures, 0);
    assert.equal(scores[0].total_runs, 2);
    assert.equal(scores[0].last_status, 'passed');
  });

  it('weights recent failures more heavily', () => {
    const scores = calculateScoresFromRuns([
      run({ status: 'failed', timestamp: '2026-05-11T10:00:00.000Z' }),
      run({ timestamp: '2026-05-11T09:00:00.000Z' }),
      run({ timestamp: '2026-05-11T08:00:00.000Z' })
    ]);

    assert.equal(scores[0].failures, 1);
    assert.equal(scores[0].flakiness_score, 50);
    assert.equal(scores[0].last_status, 'failed');
  });

  it('limits scoring to the most recent runs when lastN is provided', () => {
    const scores = calculateScoresFromRuns([
      run({ status: 'passed', timestamp: '2026-05-11T10:00:00.000Z' }),
      run({ status: 'failed', timestamp: '2026-05-11T09:00:00.000Z' }),
      run({ status: 'failed', timestamp: '2026-05-11T08:00:00.000Z' })
    ], 2);

    assert.equal(scores[0].total_runs, 2);
    assert.equal(scores[0].failures, 1);
    assert.equal(scores[0].flakiness_score, 75);
    assert.equal(scores[0].last_status, 'passed');
  });

  it('sorts highest flakiness scores first', () => {
    const scores = calculateScoresFromRuns([
      run({
        test_title: 'stable test',
        status: 'passed',
        timestamp: '2026-05-11T10:00:00.000Z'
      }),
      run({
        test_title: 'flaky test',
        status: 'failed',
        timestamp: '2026-05-11T10:00:00.000Z'
      })
    ]);

    assert.equal(scores[0].test_title, 'flaky test');
    assert.equal(scores[1].test_title, 'stable test');
  });
});
