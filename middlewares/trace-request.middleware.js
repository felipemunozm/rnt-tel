const log = require('../log')

const logKeys = (label, obj) => {
    if (obj) {
        const keys = Object.keys(obj)
        if (keys.length > 0) {
            log.debug(`${label} ::`)
            keys.forEach(k => log.debug(`'${k}' :: ${obj[k]}`))
        }
    } else {
        log.debug(`${label} :: ${obj}`);
    }

}

const traceRequest = async(ctx, next) => {
    log.debug(`===> ${ctx.originalUrl}`)
    if (ctx.request.params) {
        logKeys('params', ctx.request.params)
    }
    if (ctx.request.query) {
        logKeys('query', ctx.request.query)
    }
    if (ctx.request.body) {
        logKeys('body', ctx.request.body)
    }
    log.debug(`<=== ${ctx.host}${ctx.originalUrl}`)
    await next()
}

module.exports = traceRequest