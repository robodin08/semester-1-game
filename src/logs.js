import chalk from 'chalk';
import inquirer from 'inquirer';

const log = console.log;

export function start() {
  log(chalk.red('Welcome ') + chalk.green('to ') + chalk.yellow('Memory!'));
  log('Made by Dinand');
}

export function stop() {
  log(chalk.red('Thanks ') + chalk.green('for ') + chalk.yellow('Playing!'));
  log('\nYour total scores');
}

export function logScore(guesses, guessedSets) {
  log(`Guesses: ${chalk.red(guesses)} Guesses: ${chalk.green(guessedSets)}`);
}

export async function askCard(rows, cols) {
  try {
    let { card } = await inquirer.prompt([
      { type: 'input', name: 'card', message: 'Enter a card (e.g. A2):' },
    ]);

    card = card.trim().toUpperCase();

    const match = card.match(/^([A-Z])(\d+)$/);
    if (!match) return askCard(rows, cols);

    const colLetter = match[1];
    const rowNumber = parseInt(match[2], 10);

    const colIndex = colLetter.charCodeAt(0) - 65;

    if (colIndex < 0 || colIndex >= cols) return askCard(rows, cols);
    if (rowNumber < 1 || rowNumber > rows) return askCard(rows, cols);

    return (rowNumber - 1) * cols + colIndex;
  } catch (error) {
    return;
  }
}

export function logLevel(level, rows, cols) {
  const letters = Array.from({ length: cols }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  log('   ' + letters.map((l) => chalk.yellow(l) + '  ').join(' | '));
  log('  ' + '-'.repeat(cols * 6 - 2));

  for (let row = 0; row < rows; row++) {
    const rowLabel = chalk.yellow((row + 1).toString().padEnd(2));
    const rowData = level
      .slice(row * cols, (row + 1) * cols)
      .map((cell) => cell.toString().padEnd(3))
      .join(' | ');
    log(`${rowLabel} ${rowData}`);
  }
}
