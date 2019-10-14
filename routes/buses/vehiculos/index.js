const Router = require('koa-router')
const router = new Router()
const log = require('../../../log')
const busesLogic = require('../../../logic/buses')
const RuleEngine = require('json-rules-engine').Engine

router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_SOLICITANTE', async (ctx) => {
    log.debug("RUT_EMPRESA: " + ctx.params.RUT_EMPRESA)
    log.debug("RUT_SOLICITANTE:" + ctx.params.RUT_SOLICITANTE)
    ctx.body = await busesLogic.findServiciosByRepresentanteLegalAndEmpresa(ctx.params.RUT_EMPRESA, ctx.params.RUT_SOLICITANTE)
})
router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_REPRESENTANTE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    log.debug("RUT_EMPRESA: " + ctx.params.RUT_EMPRESA)
    log.debug("RUT_REPRESENTANTE: " + ctx.params.RUT_REPRESENTANTE)
    log.debug("RUT_SOLICITANTE:" + ctx.params.RUT_SOLICITANTE)
    ctx.body = busesLogic.findServiciosByMandatarioAndRepresentanteAndEmpresa(ctx.params.RUT_EMPRESA, ctx.params.RUT_REPRESENTANTE, ctx.params.RUT_SOLICITANTE)
})
router.get('/personas/:RUT_RESPONSABLE', (ctx) => {
    log.debug("RUT_RESPONSABLE: " + ctx.params.RUT_RESPONSABLE)
    ctx.body = busesLogic.getServiciosVigentesInscritosPorRutResponsable(ctx.params.RUT_RESPONSABLE)
})
router.get('/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    log.debug("RUT_RESPONSABLE: " + ctx.params.RUT_RESPONSABLE + " RUT_SOLICITANTE: " + ctx.params.RUT_SOLICITANTE)
    ctx.body = busesLogic.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario(ctx.params.RUT_RESPONSABLE, ctx.params.RUT_SOLICITANTE)
})

router.post('/ppus/validaciones', async (ctx) => {
    log.debug(JSON.stringify(ctx.request.body))
    let ruleEngine = new RuleEngine()
    let docs = []
    let validacionInscripcionBuses = {
        conditions: {
            all: [
                {
                    fact: 'registrocivil',
                    path: '.rutPropietario',
                    operator: 'equal',
                    value: {
                        fact: 'solicitud',
                        path: '.rutPropietario'
                    }
                }, {
                    fact: 'registrocivil',
                    path: '.antiguedad',
                    operator: 'lessThanInclusive',
                    value: {
                        fact: 'rnt',
                        path: '.antiguedadMaxima'
                    }
                }, {
                    fact: 'rnt',
                    path: '.lstTipoVehiculoPermitidos',
                    operator: 'contains',
                    value: {
                        fact: 'registrocivil',
                        path: '.tipoVehiculo'
                    }
                }, {
                    fact: 'sgprt',
                    path: '.resultadoRT',
                    operator: 'equal',
                    value: 'Aprobada'
                }
            ]
        },
        event: {
            type: 'aceptado',
            params : {
                mensaje: 'Vehiculo Aceptado'
            }
        }
    }
    ruleEngine.addRule(validacionInscripcionBuses)
    let datosVehiculo = {
        registrocivil: {
            rutPropietario: '12-9',
            antiguedad: 12,
            tipoVehiculo: 'BUS'
        },
        sgprt: {
            resultadoRT: 'RECHAZADA',
            fechaVencimientoRT: '10/12/2020'
        },
        rnt: {
            estado: 'Cancelado',
            tipoCancelacion: 'Cancelado por Traslado',
            regionTraslado: '01',
            antiguedadMaxima: 10,
            lstTipoVehiculoPermitidos: ['BUS','MINIBUS']
        },
        solicitud: {
            rutPropietario: '1-9',
            ppu: 'BBCC12'
        }
    }
    ctx.body = {validacion: false}
    let continua = true
    ruleEngine.on('failure', (event,almanac, ruleResult) => {
        log.debug("Failure event trigger...")
        log.debug('RuleResult: ' + JSON.stringify(ruleResult))
        ruleResult.conditions.all.forEach(condition => {
            if(condition.result == false 
                && condition.operator == 'equal'
                && condition.fact == 'registrocivil'
                && condition.path == '.rutPropietario') {
                log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                docs.push('V02','V03')
            }
            if(condition.result == false 
                && condition.operator == 'lessThanInclusive'
                && condition.fact == 'registrocivil'
                && condition.path == '.antiguedad') {
                log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                continua = false
            }
            if(condition.result == false 
                && condition.operator == 'contains'
                && condition.fact == 'rnt'
                && condition.path == '.lstTipoVehiculoPermitidos') {
                log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                continua = false
            }
            if(condition.result == false 
                && condition.operator == 'equal'
                && condition.fact == 'sgprt'
                && condition.path == '.resultadoRT') {
                log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                docs.push('V07')
            }
        })
    })
    await ruleEngine
        .run(datosVehiculo)
        .then( results => {
            results.events.map(event => {
                log.debug(JSON.stringify(event))
                log.debug("Aprobadas reglas de negocio: " + event.params.mensaje)
                continua = true
            })
        })
    log.debug(JSON.stringify(docs))
    if(continua) {
        ctx.body = {validacion: true, docs: docs}
    }
    // ctx.body = {test: ctx.url}
})
router.get('/solicitudes', (ctx) => {
    log.debug(JSON.stringify(ctx.params))
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()