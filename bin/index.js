#!/usr/bin/env node
const fs = require('fs')
const cac = require('cac')
const { deploy } = require('../src')

const cli = cac('static-deploy')

cli.command('deploy').option('--src <source>', 'source directory', {
  default: 'dist'
}).option('--dist [dist]', 'dist directory', {
  default: ''
}).action((options) => {
  const src = options['src']
  const dist = options['dist']
  const configContent = fs.readFileSync('.aliossrc')
  const config = JSON.parse(configContent)
  deploy(src, dist, config)
})

cli.help()

cli.parse()
