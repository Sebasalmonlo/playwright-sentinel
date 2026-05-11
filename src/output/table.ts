import chalk from 'chalk';
import Table from 'cli-table3';
import path from 'node:path';
import type { TestScore } from '../core/scorer.js';

interface ScoreTableOptions {
  last?: number;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
}

function scoreColor(score: number): string {
  const label = `${score}/100`;

  if (score === 0)  return chalk.green(label);
  if (score <= 20)  return chalk.yellow(label);
  if (score <= 50)  return chalk.red(label);
  return chalk.bgRed.white(label);
}

function statusLabel(status: string): string {
  if (status === 'passed')  return chalk.green('passed');
  if (status === 'skipped') return chalk.yellow('skipped');
  return chalk.red('failed');
}

function relativeFilePath(filePath: string): string {
  return path.relative(process.cwd(), filePath) || filePath;
}

function formatLastRun(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return 'unknown';

  const month = date.toLocaleString(undefined, { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });

  return `${month} ${day} ${time}`;
}

export function printScoreTable(scores: TestScore[], options: ScoreTableOptions = {}): void {
  if (scores.length === 0) {
    console.log(chalk.yellow('\nNo test runs found. Run your tests first.\n'));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold('Test'),
      chalk.bold('File'),
      chalk.bold('Score'),
      chalk.bold('Runs'),
      chalk.bold('Failures'),
      chalk.bold('Last'),
      chalk.bold('Last Run')
    ],
    colWidths: [34, 28, 10, 8, 10, 10, 16],
    style: { head: [], border: [] }
  });

  for (const s of scores) {
    table.push([
      truncate(s.test_title, 31),
      chalk.gray(truncate(relativeFilePath(s.file_path), 25)),
      scoreColor(s.flakiness_score),
      s.total_runs.toString(),
      s.failures.toString(),
      statusLabel(s.last_status),
      chalk.gray(formatLastRun(s.last_run))
    ]);
  }

  const scope = options.last
    ? `last ${options.last} runs per test`
    : 'all tracked runs';

  console.log('\n' + chalk.bold.cyan('  🔍 Sentinel — Flakiness Report') + chalk.gray(`  (${scope})`) + '\n');
  console.log(table.toString());
  console.log(
    chalk.gray(`\n  ${scores.length} tests tracked`) +
    chalk.gray('  •  ') +
    chalk.red(`${scores.filter(s => s.flakiness_score > 0).length} flaky`) +
    chalk.gray('  •  ') +
    chalk.green(`${scores.filter(s => s.flakiness_score === 0).length} stable`) +
    '\n'
  );
}
