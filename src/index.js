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
    await client.putStream(dist + file, stream, {})
    console.log(`upload ${file}`)
  }
}

module.exports = {
  deploy
}
