#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import chauncey from '..';

const argv = minimist(process.argv.slice(2));

if (argv.h || argv.help) {
  console.log(
    fs.readFileSync(path.join(__dirname, 'usage.txt'), { encoding: 'utf8' })
  );
  process.exit(1);
}

const url = argv._[0];
if (!url) errorExit('url not specified');

chauncey({
  url: argv._[0],
  done: (error, result) => {
    if (error) errorExit(error);
    process.stdout.write(result);
    process.exit(0);
  }
});

function errorExit(error) {
  if (error.stack) console.error(error.stack);
  else console.error(String(error));
  process.exit(1);
}
