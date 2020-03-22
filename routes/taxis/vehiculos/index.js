const Router = require('koa-router')
const router = new Router()
const taxisLogic = require('../../../logic/taxis')
const log = require('../../../log')
const InputValidarFlota = require('../../../model/InputValidaFlotaTaxis')


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

router.post('/ppus/validaciones', async (ctx) => {
    log.trace(JSON.stringify(ctx.request.body))
    let inputParams = ctx.request.body
    let tempfolio=inputParams.folio=== undefined ? true:(inputParams.folio===""?true:false)
    let tempregion =inputParams.region=== undefined ? true:(inputParams.region===""?true:false)
    let tempCantidadRecorridos=inputParams.CantidadRecorridos=== undefined ? true:(inputParams.CantidadRecorridos===""?true:false)
    let templistappu =false
    
    if(!Array.isArray(inputParams.lstPpuRut) || inputParams.lstPpuRut.length==0)
    {templistappu=true}

    if (!tempfolio && !tempregion && !tempCantidadRecorridos &&!templistappu) {

        let inputValidarFlota = new InputValidarFlota(inputParams.folio, inputParams.region, inputParams.lstPpuRut, inputParams.CantidadRecorridos,"")
        log.trace("inputParameters: " + JSON.stringify(inputValidarFlota))
        ctx.body = await taxisLogic.validarFlota(inputValidarFlota)
        log.debug("Saliendo de Routes")
    }else{
        ctx.body = {mensaje:'Faltan parametros requeridos' ,estado:'RECHAZADO'}
      }
})

router.post('/solicitudes', (ctx) => {
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()