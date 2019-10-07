const Router = require('koa-router')
const router = new Router()
const taxisLogic = require('../../../logic/taxis')

router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = taxisLogic.findServiciosByRepresentanteLegalAndEmpresa(ctx.params.RUT_EMPRESA, ctx.params.RUT_SOLICITANTE)
})

router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_REPRESENTANTE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = taxisLogic.findServiciosByMandatarioAndRepresentanteAndEmpresa(ctx.params.RUT_EMPRESA, ctx.params.RUT_REPRESENTANTE, ctx.params.RUT_SOLICITANTE)
})

router.get('/personas/:RUT_RESPONSABLE', (ctx) => {
    ctx.body = taxisLogic.getServiciosVigentesInscritosPorRutResponsable(ctx.params.RUT_RESPONSABLE)
})

router.get('/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = taxisLogic.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario(ctx.params.RUT_RESPONSABLE, ctx.params.RUT_SOLICITANTE)
})

router.post('/ppus/validaciones', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.post('/solicitudes', (ctx) => {
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()