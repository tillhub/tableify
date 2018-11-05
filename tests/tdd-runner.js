const path = require('path')
const test = require('tape')
const pump = require('pump')
const glob = require('glob')
const chalk = require('chalk')
const tapSpec = require('tap-spec')

process.env.NODE_ENV = 'test'

pump(test.createStream(), tapSpec(), process.stdout, err => {
  if (err) return console.log(chalk.red(err))
})

/**
 * Do TDD through
 *   npm run tdd [optional file patterns]
 *
 * that calls in turn
 *
 *    DEBUG=api:* nodemon --exec nodemon test/tdd-runner.js
 *
 * If we do not provide a list of patterns, fallback to .spec.js files in /test
 *
 * Example:
 *    Runa a single file (instead of all the files) from your test directory
 *
 *      npm run tdd test/[**]/page.spec.js (needed to escape asterisks in JSDoc comment)
 */
if (!process.argv.slice(2).length) {
  matchAndExecute('tests/*.test.js')
} else {
  process.argv.slice(2).forEach(pattern => {
    matchAndExecute(pattern)
  })
}

function matchAndExecute(pattern) {
  glob.sync(pattern, { cwd: process.cwd() }).forEach(file => {
    require(path.resolve(file))
  })
}
