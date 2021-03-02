module.exports = (ctx, next) => {
  ctx.body = {
    state: 1,
    message: '404 Not Find',
  }
}
