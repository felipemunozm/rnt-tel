const log = require('../log')

const joiErrorsHandler = async(ctx, next) => {
    if (ctx.invalid) {
        log.trace('Joi error response handler')
        let status = 400;
        if (ctx.invalid.body) {
            status = ctx.invalid.body.status
        } else if (ctx.invalid.params) {
            status = ctx.invalid.params.status
        } else if (ctx.invalid.query) {
            status = ctx.invalid.query.status
        }
        ctx.status = status
        ctx.body = ctx.invalid
    } else {
        await next()
    }
}

module.exports = joiErrorsHandler