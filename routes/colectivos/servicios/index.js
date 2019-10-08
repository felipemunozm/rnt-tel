const Router = require('koa-router')
const router = new Router()
const log = require('../../../log')
const logicColectivos = require('../../../logic/colectivos')
const rntTramitesMap =require('../../../config')

router.get('/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_SOLICITANTE', (ctx) => {
    let idtramite =rntTramitesMap.rntTramitesMap.colectivos.IdsTramites[0]    
    ctx.body = logicColectivos.getAutorizacionPorEmpresaAndPersonaTramiteInscripcionTaxiColectivo(ctx.params.ID_REGION,ctx.params.RUT_EMPRESA,ctx.params.RUT_SOLICITANTE,idtramite)
})

/*router.get('/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_REPRESENTANTE/mandatario/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})*/

router.get('/regiones/:ID_REGION/personas/:RUT_SOLICITANTE', (ctx) => {
    let idtramite =rntTramitesMap.rntTramitesMap.colectivos.IdsTramites[0]
    let rut_representante=ctx.params.RUT_SOLICITANTE
    ctx.body = logicColectivos.getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo(ctx.params.ID_REGION,ctx.params.RUT_SOLICITANTE,rut_representante,idtramite)
})

/*router.get('/regiones/:ID_REGION/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})*/

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