#!/usr/bin/env node
const fs = require('fs')
const cac = require('cac')
const { deploy } = require('../src')

const cli = cac('static-deploy')

cli.command('deploy').option('--src [source]', 'source directory', {
  default: 'dist'
}).option('--dist [dist]', 'dist directory', {
  default: ''
}).action((options) => {
  const src = typeof options['src'] === 'string' ? options['src'] : ''
  const dist = typeof options['dist'] === 'string' ? options['dist'] : ''
  if (fs.existsSync('.aliossrc')) {
    const configContent = fs.readFileSync('.aliossrc')
    const config = JSON.parse(configContent)
    deploy(src, dist, config)
  } else {
    const accessKeyId = process.env.OSS_ACCESS_KEY_ID
    const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET
    const region = process.env.OSS_REGION
    const bucket = process.env.OSS_BUCKET
    if (!accessKeyId) {
      console.error('OSS_ACCESS_KEY_ID is required')
      process.exit(1)
    }
    if (!accessKeySecret) {
      console.error('OSS_ACCESS_KEY_SECRET is required')
      process.exit(1)
    }
    if (!region) {
      console.error('OSS_REGION is required')
      process.exit(1)
    }
    if (!bucket) {
      console.error('OSS_BUCKET is required')
      process.exit(1)
    }
    const config = {
      accessKeyId,
      accessKeySecret,
      region,
      bucket
    }
    deploy(src, dist, config)
  }
})

cli.help()

cli.parse()
