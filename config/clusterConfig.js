const os = require('os')
const cpus = os.cpus()

const clusterConfig = {
  // 最大创建子进程数
  MAX_CHILD_WORKER_COUNT:1 || Math.ceil(cpus.length),
  // 创建子进程记录周期
  CREATE_WORKER_PERIOD:1000 * 60,
  // 单位周期内最多创建的子进程数，超过则退出主进程
  CREATE_WORKER_PER_MAX_COUNT:30,
  // 最大丢包次数,监视进程
  MAX_MISS_COUNT:3,
  // 子进程心跳检测间隔
  PING_PONG_INTERVAL:1000,
  // 恢复子进程延时
  RECOVERY_DELAY:2*1000,
}


module.exports = clusterConfig