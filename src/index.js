const fs = require('fs')
const path = require('path')
const glob = require('glob')
const OSS = require('ali-oss')

const deploy = async (src, dist, config) => {
  const client = new OSS(config)
  const prefix = path.resolve(src)
  const files = glob.sync('**/*', {
    cwd: prefix
  })

  console.log(`bucket: ${config.bucket}`)
  console.log(`dist: ${dist || '/'}`)

  for (const file of files) {
    const stream = fs.createReadStream(path.resolve(prefix, file))
    const target = path.join(dist, file)
    const options = {}
    const MONTH_AGE = 60*60*24*30

    // 上传的文件缓存策略
    if (file.endsWith('.html')) {
      options['Cache-Control'] = 'max-age=1'
    } else if (file.endsWith('service-worker.js')) {
      // do nothing
    } else if (file.endsWith('.js')) {
      options['Cache-Control'] = `max-age=${MONTH_AGE}`
    } else if (file.endsWith('.css')) {
      options['Cache-Control'] = `max-age=${MONTH_AGE}`
    }

    await client.putStream(target, stream, options)

    let msg = `upload ${file}`
    if (options['Cache-Control']) {
      msg += `, cache-control: ${options['Cache-Control']}`
    }

    console.log(msg)
  }

  console.log('✨ deploy done')
}

module.exports = {
  deploy
}
