const Router = require('koa-router')
const router = new Router()
const log = require('../../../log')
const  logicTaxis = require('../../../logic/taxis')
const InputValidarFlota = require('../../../model/InputValidaFlota')


//psalas empresa
router.get('/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_SOLICITANTE',async (ctx) => {
    log.debug("ID_REGION: " + ctx.params.ID_REGION)
    log.debug("RUT_EMPRESA: " + ctx.params.RUT_EMPRESA)
    log.debug("RUT_SOLICITANTE: " + ctx.params.RUT_SOLICITANTE)
    ctx.body = await logicTaxis.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis(ctx.params.ID_REGION,ctx.params.RUT_EMPRESA,ctx.params.RUT_SOLICITANTE)
})

//psalas persona
router.get('/regiones/:ID_REGION/personas/:RUT_SOLICITANTE', async (ctx) => {

    log.debug("ID_REGION: " + ctx.params.ID_REGION)
    log.debug("RUT_SOLICITANTE: " + ctx.params.RUT_SOLICITANTE)
    ctx.body = await logicTaxis.getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis(ctx.params.ID_REGION,ctx.params.RUT_SOLICITANTE)
  
})

//psalas persona mandatario
router.get('/regiones/:ID_REGION/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', async (ctx) => {
    log.debug("ID_REGION: " + ctx.params.ID_REGION)
    log.debug("RUT_RESPONSABLE: " + ctx.params.RUT_SOLICITANTE)
    log.debug("RUT_SOLICITANTE: " + ctx.params.RUT_SOLICITANTE)
    ctx.body = await logicTaxis.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioTaxis(ctx.params.ID_REGION,ctx.params.RUT_RESPONSABLE,ctx.params.RUT_SOLICITANTE)
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
    //ctx.body = {test: ctx.url}
    log.debug("Saliendo de Routes")
})

router.post('/solicitudes', (ctx) => {
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()