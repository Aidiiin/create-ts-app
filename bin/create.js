#! /usr/bin/env node
'use strict';
import fs from 'fs/promises';
import {execSync} from 'child_process';
import readline from 'readline/promises';
import * as templates from './templates.js';
import chalk from 'chalk';

const projectType = process.argv[2];

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
  const name = await read.question(chalk.yellow("What is your project's name? "));
  const description = await read.question(chalk.yellow(`What is the description of your project? `));
  const author = await read.question(chalk.yellow(`Who is the Author? `));
  const git = await read.question(chalk.yellow(`What is the Git url? `));

  await fs.mkdir(name);
  await fs.mkdir(`${name}/src`);
  await fs.writeFile(`${name}/.eslintignore`, templates.eslintIgnore, 'utf8');
  await fs.writeFile(`${name}/.eslintrc.cjs`, templates.eslint, 'utf8');
  await fs.writeFile(`${name}/.gitignore`, templates.gitIgnore, 'utf8');
  await fs.writeFile(`${name}/jest.config.js`, templates.jest, 'utf8');
  await fs.writeFile(`${name}/tsconfig.json`, templates.tsConfig, 'utf8');
  
  await fs.mkdir(`${name}/test`);
  await fs.writeFile(`${name}/test/sample.spec.ts`, templates.jestSample, 'utf8');


  const packageJson = templates.packageJson
    .replaceAll('#{name}', name)
    .replaceAll('#{description}', description)
    .replaceAll('#{author}', author)
    .replaceAll('#{gitUrl}', git);
    
  await fs.writeFile(`${name}/package.json`, packageJson, 'utf8');

  if (projectType === 'express') {
    // execute a command to install express
    console.log();
    console.log(chalk.blue('Installing express.js ...'))
    console.log(execSync(`npm i express --save`, {cwd: name}).toString());
    console.log(execSync(`npm i @types/node @types/express --save-dev`, {cwd: name}).toString());
    
    await fs.writeFile(`${name}/src/server.ts`, templates.express, 'utf8');
  }
  read.close();
}

main().then(() => console.log(chalk.yellow('Finished!'))).catch(handleError);
