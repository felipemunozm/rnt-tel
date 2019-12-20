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
    ctx.body = logicColectivos.getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo(ctx.params.ID_REGION,ctx.params.RUT_SOLICITANTE,idtramite)
})
//psalas persona mandatario
   router.get('/regiones/:ID_REGION/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', async (ctx) => {
   ctx.body = await logicColectivos.getAutorizacionPorPersonaMandatarioInscripcionServicioTaxiColectivo(ctx.params.ID_REGION,ctx.params.RUT_RESPONSABLE,ctx.params.RUT_SOLICITANTE)
})


router.get('/tipos_servicios', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.post('/ppus/validaciones', async (ctx) => {
    log.trace(JSON.stringify(ctx.request.body))
    let inputParams = ctx.request.body
    let inputValidarServicios = new InputValidarFlota(inputParams.rut_solicitante, inputParams.rut_responsable, inputParams.folio, inputParams.region, inputParams.lstPpuRut, inputParams.CantidadRecorridos)
    log.trace("inputParameters: " + JSON.stringify(inputValidarServicios))
    ctx.body = await logicTaxis.InputValidarServiciosFlota(inputValidarServicios)
    log.debug("Saliendo de Routes")
})

router.post('/solicitudes', (ctx) => {
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()