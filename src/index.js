const fs = require('fs')
const path = require('path')
const glob = require('glob')
const OSS = require('ali-oss')
const { version } = require('../package.json')

const deploy = async (src, dist, config) => {
  const client = new OSS(config)
  const prefix = path.resolve(src)
  const files = glob.sync('**/*', {
    cwd: prefix,
    nodir: true,
  })

  dist = dist || ''

  console.log(`version: ${version}`)
  console.log(`bucket: ${config.bucket}`)
  console.log(`dist: ${dist || '/'}`)

  for (const file of files) {
    const stream = fs.createReadStream(path.resolve(prefix, file))
    const target = path.join(dist, file)
    const headers = {}
    const MONTH_AGE = 60*60*24*30

    // 上传的文件缓存策略
    if (file.endsWith('.html')) {
      headers['Cache-Control'] = 'public,max-age=0,must-revalidate'
    } else if (file.endsWith('service-worker.js')) {
      // do nothing
    } else if (file.endsWith('app.js') || file.endsWith('app.css') || file.endsWith('index.js') || file.endsWith('index.css')) {
      headers['Cache-Control'] = 'public,max-age=0,must-revalidate'
    } else if (file.endsWith('.js')) {
      headers['Cache-Control'] = `public,max-age=${MONTH_AGE},immutable`
    } else if (file.endsWith('.css')) {
      headers['Cache-Control'] = `public,max-age=${MONTH_AGE},immutable`
    }

    await client.putStream(target, stream, {
      headers
    })

    let msg = `upload ${file}`
    if (headers['Cache-Control']) {
      msg += `, cache-control: ${headers['Cache-Control']}`
    }

    console.log(msg)
  }

  console.log('✨ deploy done')
}

module.exports = {
  deploy
}
