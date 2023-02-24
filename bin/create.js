#! /usr/bin/env node
'use strict';
import fs from 'fs/promises';
import readline from 'readline/promises';
import * as templates from './templates.js';
import chalk from 'chalk';

const cleanup = () => {
  console.log('Cleaning up.');
  // Reset changes made to package.json files.
};

const handleExit = () => {
  cleanup();
  console.log('Exiting without error.');
  process.exit();
};

const handleError = e => {
  console.error('ERROR! An error was encountered while executing');
  console.error(e);
  cleanup();
  console.log('Exiting with error.');
  process.exit(1);
};

process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


async function main() {
  console.log();
  const name = await read.question(chalk.blue("What is your project's name? "));
  const description = await read.question(chalk.blue(`What is the description of your project? `));
  const author = await read.question(chalk.blue(`Who is the Author? `));
  const git = await read.question(chalk.blue(`What is the Git url? `));

  await fs.mkdir(name);

  await fs.writeFile(`${name}/.eslintignore`, templates.eslintIgnore, 'utf8');
  await fs.writeFile(`${name}/.eslintrc.cjs`, templates.eslint, 'utf8');
  await fs.writeFile(`${name}/.gitignore`, templates.gitIgnore, 'utf8');
  await fs.writeFile(`${name}/jest.config.js`, templates.jest, 'utf8');
  await fs.writeFile(`${name}/tsconfig.json`, templates.tsConfig, 'utf8');
  
  await fs.mkdir(`${name}/tests`);
  await fs.writeFile(`${name}/tests/sample.spec.ts`, templates.jestSample, 'utf8');


  const packageJson = templates.packageJson
    .replaceAll('#{name}', name)
    .replaceAll('#{description}', description)
    .replaceAll('#{author}', author)
    .replaceAll('#{gitUrl}', git);

  await fs.writeFile(`${name}/package.json`, packageJson, 'utf8');
  read.close();
}

main().then(() => console.log(chalk.yellow('Finished!'))).catch(handleError);
