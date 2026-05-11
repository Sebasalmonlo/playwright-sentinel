import { Command, InvalidArgumentError } from 'commander';
import { reportCommand } from './commands/report.js';
import { watchCommand } from './commands/watch.js';

function parsePositiveInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new InvalidArgumentError('must be a positive integer');
  }

  return parsed;
}

function parseThreshold(value: string): number {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
    throw new InvalidArgumentError('must be an integer between 0 and 100');
  }

  return parsed;
}

const program = new Command();

program
  .name('sentinel')
  .description('Playwright test intelligence — flakiness scoring and reporting')
  .version('1.0.0');

program
  .command('report')
  .description('Show flakiness scores for all tracked tests')
  .option('--last <n>', 'Only analyse last N runs per test', parsePositiveInteger)
  .action((options) => reportCommand(options));

program
  .command('watch')
  .description('Check suite health and fail when flakiness exceeds a threshold')
  .requiredOption('--threshold <n>', 'Maximum allowed flakiness score before failing', parseThreshold)
  .option('--last <n>', 'Only analyse last N runs per test', parsePositiveInteger)
  .action((options) => watchCommand(options));

program.parse(process.argv);
