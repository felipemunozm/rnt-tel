const Router = require('koa-router')
const router = new Router()
const log = require('../../../log')
const busesLogic = require('../../../logic/buses')

router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_SOLICITANTE', async (ctx) => {
    log.debug("RUT_EMPRESA: " + ctx.params.RUT_EMPRESA)
    log.debug("RUT_SOLICITANTE:" + ctx.params.RUT_SOLICITANTE)
    ctx.body = {representantes: (await busesLogic.findRepresentanteLegalByEmpresa(ctx.params.RUT_EMPRESA, ctx.params.RUT_SOLICITANTE))}
})
router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_REPRESENTANTE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})
router.get('/personas/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})
router.get('/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.post('/ppus/validaciones', (ctx) => {
    log.debug(JSON.stringify(ctx.request.body))
    ctx.body = {test: ctx.url}
})
router.get('/solicitudes', (ctx) => {
    log.debug(JSON.stringify(ctx.params))
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()