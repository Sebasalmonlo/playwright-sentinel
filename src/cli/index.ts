import { Command, InvalidArgumentError } from 'commander';
import { reportCommand } from './commands/report.js';

function parsePositiveInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new InvalidArgumentError('must be a positive integer');
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

program.parse(process.argv);
