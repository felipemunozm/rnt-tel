const Router = require('koa-router')
const router = new Router()
const logicBuses = require('../../../logic/buses')

router.get('/personas/:RUT', async (ctx) => {
    ctx.body = await logicBuses.getAutorizadosParaInscripcionServiciosBuses(ctx.params.RUT)
})

router.get('/personas/:RUT/empresas/:RUT_EMPRESA', (ctx) => {
    ctx.body = logicBuses.getAutorizadoPorEmpresaParaInscripcionServicioBuses(ctx.params.RUT, ctx.params.RUT_EMPRESA)
})

router.get('/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_REPRESENTANTE/mandatario/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/regiones/:ID_REGION/personas/:RUT_SOLICITANTE', (ctx) => {
    //ctx.body = {test: ctx.url }
    ctx.body =  logicBuses.getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses(ctx.params.REGION,ctx.params.RUT)
    //{test:'asdasdasd' }
})
router.get('/regiones/:ID_REGION/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url }
})
router.get('/tipos_servicios', (ctx) => {
    ctx.body = {test: ctx.url}
})
router.post('/ppus/validaciones', (ctx) => {
    ctx.body = {test: ctx.url}
})
router.post('/solicitudes', (ctx) => {
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()