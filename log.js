const fs = require('fs')
const path = require('path')

function recordLog(content, { dir, flag } = {}) {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const hour = time.getHours()

  // 文件路径
  dir = dir || path.resolve(__dirname, `./log/${year}/${month}/${date}/`)
  // 不存在路径则创建
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // 写入日志文件
  fs.writeFileSync(`${dir}/${hour}-error.txt`, content, { flag: flag || 'a' })
}

module.exports = recordLog
