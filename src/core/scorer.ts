import { getAllRuns } from './storage';

export interface TestScore {
  test_title: string;
  file_path: string;
  total_runs: number;
  failures: number;
  flakiness_score: number;
  last_status: string;
  last_run: string;
}

export function calculateScores(): TestScore[] {
  const runs = getAllRuns();

  const grouped: Record<string, typeof runs> = {};
  for (const run of runs) {
    if (!grouped[run.test_title]) grouped[run.test_title] = [];
    grouped[run.test_title].push(run);
  }

  const scores: TestScore[] = [];

  for (const [title, testRuns] of Object.entries(grouped)) {
    const sorted = testRuns.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = sorted.length;
    const recent = sorted.slice(0, 5);

    let failures = 0;
    for (const run of sorted) {
      if (run.status === 'failed') failures++;
    }

    let weightedFailures = 0;
    for (const run of recent) {
      if (run.status === 'failed') weightedFailures += 1.5;
    }
    const olderRuns = sorted.slice(5);
    for (const run of olderRuns) {
      if (run.status === 'failed') weightedFailures += 1;
    }

    const rawScore = (weightedFailures / Math.max(total, 1)) * 100;
    const flakiness_score = Math.min(Math.round(rawScore), 100);

    scores.push({
      test_title: title,
      file_path: sorted[0].file_path,
      total_runs: total,
      failures,
      flakiness_score,
      last_status: sorted[0].status,
      last_run: sorted[0].timestamp
    });
  }

  return scores.sort((a, b) => b.flakiness_score - a.flakiness_score);
}