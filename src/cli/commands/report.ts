import { calculateScores } from '../../core/scorer.js';
import { printScoreTable } from '../../output/table.js';

export function reportCommand(options: { last?: number }): void {
  const scores = calculateScores(options.last);
  printScoreTable(scores, { last: options.last });
}
