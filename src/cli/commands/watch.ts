import chalk from 'chalk';
import { calculateScores } from '../../core/scorer.js';
import { printScoreTable } from '../../output/table.js';

interface WatchCommandOptions {
  threshold: number;
  last?: number;
}

export function watchCommand(options: WatchCommandOptions): void {
  const scores = calculateScores(options.last);
  printScoreTable(scores, { last: options.last });

  if (scores.length === 0) {
    console.log(chalk.yellow('  No test history found. Run Playwright with Sentinel before enforcing thresholds.\n'));
    process.exitCode = 1;
    return;
  }

  const failingScores = scores.filter((score) => score.flakiness_score > options.threshold);

  if (failingScores.length === 0) {
    console.log(chalk.green(`  Sentinel check passed. No test exceeded threshold ${options.threshold}.\n`));
    return;
  }

  console.log(chalk.red(`  Sentinel check failed. ${failingScores.length} test(s) exceeded threshold ${options.threshold}.\n`));
  process.exitCode = 1;
}
