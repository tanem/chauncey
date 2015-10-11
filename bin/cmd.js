#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var chauncey = require('..');

var argv = minimist(process.argv.slice(2));

if (argv.h || argv.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), { encoding: 'utf8' }));
  process.exit(1);
}

var url = argv._[0];
if (!url) errorExit('url not specified');

chauncey({
  url: argv._[0],
  done: function (error, result) {
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
