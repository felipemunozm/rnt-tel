const traceRequest = require('../middlewares/trace-request.middleware')
const joiErrorsHandler = require('../middlewares/joi-errors-handler.middleware')

module.exports = {
    commonMiddleware: [traceRequest, joiErrorsHandler],
    traceRequest,
    joiErrorsHandler
}