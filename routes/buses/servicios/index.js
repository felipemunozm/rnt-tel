const Router = require('koa-router')
const router = new Router()
const logicBuses = require('../../../logic/buses')

router.get('/personas/:RUT', (ctx) => {
    ctx.body = logicBuses.getAutorizadosParaInscripcionServiciosBuses(ctx.params.RUT)
})

router.get('/personas/:RUT/empresas/:RUT_EMPRESA', (ctx) => {
    ctx.body = logicBuses.getAutorizadoPorEmpresaParaInscripcionServicioBuses(ctx.params.RUT, ctx.params.RUT_EMPRESA)
})

module.exports = router.routes()