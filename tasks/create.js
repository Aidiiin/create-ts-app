'use strict';
const {writeFile} = require('fs').promises;
const readline = require('readline').promises;
const path = require('path');
const cp = require('child_process');
const templates = require('./templates');

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

console.log();
console.log();

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});







async function main() {
  const name = await read.question(`What is your project's name? `);
  const description = await read.question(`What is the description of your project? `);
  const author = await read.question(`Who is the Author? `);
  const git = await read.question(`What is the Git url? `);

  await writeFile('.eslintignore', templates.eslintIgnore, 'utf8');
  await writeFile('.eslintrc.cjs', templates.eslint, 'utf8');
  await writeFile('.gitignore', templates.gitIgnore, 'utf8');
  await writeFile('jest.config.js', templates.jest, 'utf8');
  await writeFile('tsconfig.json', templates.tsConfig, 'utf8');
  
  const packageJson = templates.package
  .replaceAll('#{name}', name)
  .replaceAll('#{description}', description)
  .replaceAll('#{author}', author)
  .replaceAll('#{gitUrl}', git);

  await writeFile('package.json', packageJson, 'utf8');
  read.close();
}

main().then(() => console.log('Finished!')).catch(handleError);
