#!/usr/bin/env node

const chalk = require('chalk'),
      brkn  = require('./brkn').brkn,
      pkg   = require('./package.json');

const argv = require('yargs')
  .command(
    'url',
    false
  )
  .option('a', {
    alias: 'attr',
    default: ['href', 'src'],
    describe: 'The attributes to search for (space separated if more than one)',
    type: 'array'
  })
  .option('v', {
    alias: 'verbose',
    describe: 'Run in verbose mode',
    type: 'boolean'
  })
  .usage('Usage: $ brkn <url> --attr [html attributes (default: href src)] [--verbose]')
  .example('$ brkn https://github.com')
  .example('$ brkn https://nodejs.org --attr src')
  .example('$ brkn https://npmjs.com --attr href src --verbose')
  .help('help', 'Show this screen')
  .epilog('MIT (c) ' + pkg.author.name + ' <' + pkg.author.email + '>')
  .version(pkg.version)
  .argv;

brkn(argv._[0], argv.attr, argv.verbose)
.then(brokenUrls => {
  if (brokenUrls.length > 0) {
    console.log('\nThe following URLs seem to be broken or could not accept GET requests:');
    brokenUrls.forEach((brokenUrl, index) => {
      console.log((index + 1) + ':', brokenUrl);
    });
    console.log('\n');
  } else {
    console.log('\nThere are no broken URLs.\n');
  }
})
.catch(error => {
  console.log(chalk.bgRed(error.status), chalk.red(error.message), '\n');
});
