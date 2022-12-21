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
  for (const file of files) {
    const stream = fs.createReadStream(path.resolve(prefix, file))
    const target = path.join(dist, file)
    await client.putStream(target, stream, {})
    console.log(`upload ${file} to ${target}`)
  }
}

module.exports = {
  deploy
}
