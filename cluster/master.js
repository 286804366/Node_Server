

const os = require('os')
const cpus = os.cpus()

const fs = require('fs')
const path = require('path')
const recordLog = require('./log.js')

const cluster = require('cluster')

// 进程池
const workers = {}
// 最大创建子进程数
const MAX_CHILD_WORKER_COUNT = 1 || Math.ceil(cpus.length)
// 创建子进程记录周期
const CREATE_WORKER_PERIOD = 1000 * 60
// 单位周期内最多创建的子进程数，超过则退出主进程
const CREATE_WORKER_PER_MAX_COUNT = 30
// 进程处理TCP顺序队列
const handleTCPQueue = []
// 进程处理WebSocket顺序队列
const handleWebSocketQueue = []


let beginTime = 0
let historyCount = 0


/* 连接分发 */
// 分发连接
function dispatchConnection(socket, address, type) {
  let handleWorker = ''
  // 当前处理连接队列
  let handleQueue = type === 'TCP' ? handleTCPQueue : handleWebSocketQueue
  // 已有连接
  for (const handleWorker of handleQueue) {
    if (handleWorker[type] === address) {
      workers[handleWorker.id].worker.send(
        { id: handleWorker.id, type },
        socket
      )
      return console.log(
        `[主进程]：新的 ${type} 连接 ${address} 已存在<子进程${handleWorker.id}>中处理 `
      )
    }
  }

  // 存在处理进程
  if (handleQueue.length) {
    handleWorker = handleQueue.shift()
    handleWorker[type] = address
    // 不存在处理当前连接的进程，分发给现有最久未处理的进程
    handleQueue.push(handleWorker)
  } else {
    // 还未有进程处理连接,添加所有进程
    handleQueue.push(
      ...Object.values(workers).map((worker) => ({
        id: worker.id,
        [type]: '',
      }))
    )
    handleWorker = handleQueue[handleQueue.length - 1]
    handleWorker[type] = address
  }
  workers[handleWorker.id].worker.send({ id: handleWorker.id, type }, socket)
  console.log(
    `[主进程]：新的 ${type} 连接 ${address} 分发给<子进程${handleWorker.id}>处理 `
  )
}

// 返回处理队列中进程位置
function getHandleWorkerPos(id, type) {
  const handleQueue = type === 'TCP' ? handleTCPQueue : handleWebSocketQueue
  return handleQueue.findIndex((worker) => worker.id == id)
}

// 创建子进程
function createWorker() {
  // 记录已创建过的子进程数
  if (historyCount < CREATE_WORKER_PER_MAX_COUNT) {
    // 未开始计时
    if (beginTime === 0) {
      beginTime = Date.now()
    }
    historyCount++
  } else {
    // 已记录10次创建,如果间隔在单位周期内，则退出主进程
    if (Date.now() - beginTime < CREATE_WORKER_PERIOD) {
      console.log(`[主进程]：过于频繁创建子进程，自动退出主进程!`)

      // 记录日志
      recordLog(
        `【主进程】${new Date()}\n过于频繁创建子进程，自动退出主进程\n\n`
      )
      process.exit(1)
    } else {
      // 重新计数
      beginTime = 0
      historyCount = 0
    }
  }

  // 创建子进程并进行心跳监控
  const worker = cluster.fork()
  const curWorker = {
    worker: worker,
    id: worker.id,
    pid: worker.process.pid,
    missed: 0,
    timerId: 0,
  }
  // 记录子进程
  workers[curWorker.id] = curWorker
  // 添加进连接处理队列
  handleTCPQueue.unshift({ id: curWorker.id, TCP: '' })
  handleWebSocketQueue.unshift({ id: curWorker.id, WebSocket: '' })

  // 监视子进程上线
  worker.on('online', function (worker) {
    // 初始化子进程tcp服务器
    curWorker.worker.send({ id: curWorker.id })
    // 心跳
    curWorker.timerId = setInterval(function () {
      // 三次没回应，杀之
      if (curWorker.missed === 3) {
        clearInterval(curWorker.timerId)
        console.log(
          `[主进程]：子进程(${curWorker.id}) pid=${curWorker.pid} 阻塞被【清除】！`
        )
        recordLog(`【主进程】${new Date()}\n子进程阻塞，被自动清除\n\n`)
        process.kill(curWorker.pid)
        return
      }
      // 开始心跳
      curWorker.missed++
      // log('ping')

      curWorker.worker.send({ state: `ping#${curWorker.pid}` })
    }, 1000)
    console.log(`[主进程]：子进程(${curWorker.id}) 已【启动】！`)
  })

  // 监视子进程回应心跳
  worker.on('message', function (msg) {
    // 子进程处理连接关闭通知主进程删除对应客户端连接
    if (msg.id && workers[msg.id] && msg.type) {
      const id = getHandleWorkerPos(curWorker.id, msg.type)
      const handleQueue =
        msg.type === 'TCP' ? handleTCPQueue : handleWebSocketQueue
      console.log(
        `[主进程]：子进程(${handleQueue[id].id}) 已关闭${
          handleQueue[id][msg.type]
        }连接！`
      )
      handleQueue[id][msg.type] = ''
    }

    // 确认心跳回应
    if (msg.state === `pong#${curWorker.pid}`) {
      curWorker.missed = --curWorker.missed < 0 ? 0 : curWorker.missed
    }

    // 确认是否重启子进程服务，立即重启
    if (msg.act === `restart`) {
      createWorker()
    }
  })

  // 挂了就没必要再进行心跳了
  worker.on('exit', function () {
    clearInterval(curWorker.timerId)
    delete workers[curWorker.id]
  })
  return workers[curWorker.id]
}




/* 主进程事件 */
// 未知错误 记录日志并退出进程
process.on('uncaughtException', (err, origin) => {
  console.log(`[主进程]：发生【错误】!`)

  // 记录日志
  recordLog(
    `【主进程】${new Date()}\n捕获的异常: ${err}\n异常的来源: ${origin}\n\n`
  )
  process.exit(1)
})

// 退出主进程
process.on('exit', (code) => {
  console.log(`[主进程]：【退出】退出码 ${code}！`)

  // 清除所有子进程
  const allChildWorker = Object.values(workers)
  for (const childWorker of allChildWorker) {
    childWorker.worker.kill()
  }
  console.log(`[主进程]：共清除 ${allChildWorker.length} 个子进程！`)
})

// 主进程fork事件
cluster.on('fork', (worker) => {
  console.log(`[主进程]：开始【创建】子进程(${worker.id})...`)
})

// 子进程退出
cluster.on('exit', (worker, code, signal) => {
  console.log(
    `[主进程]：子进程(${worker.id}) 已被信号 ${signal}杀死，退出码 ${code}，【退出】!`
  )
  handleTCPQueue.splice(getHandleWorkerPos(worker.id, 'TCP'), 1)
  handleWebSocketQueue.splice(getHandleWorkerPos(worker.id, 'WebSocket'), 1)
  delete workers[worker.id]
  // 根据当前子进程数是否超限来进行创建
  if (Object.values(workers).length < MAX_CHILD_WORKER_COUNT) {
    // 恢复子进程
    setTimeout(() => {
      createWorker(tcpSocket)
    }, 2000)
  }
})

