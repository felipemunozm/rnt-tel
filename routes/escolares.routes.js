const Router = require('koa-joi-router')
const Joi = Router.Joi
const log = require('../log')
const logicEscolares = require('../logic/escolar')
const JoiSchemas = require('../model/models.joi')
const commonMiddleware = require('./routes.commons').commonMiddleware

const router = Router()
// router.prefix('/escolares/servicios') no funciona cuando se usa app.route(router.routes)

//psalas empresa
router.get('/escolares/servicios/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_SOLICITANTE', {
    meta: {
        swagger: {
            summary: 'Validar Empresa Autorizada',
            description: '',
            tags: ['escolares']
        }
    },
    validate: {
        params: {
            ID_REGION: JoiSchemas.CodigoRegionJoi.required(),
            RUT_EMPRESA: JoiSchemas.RutJoi.required(),
            RUT_SOLICITANTE: JoiSchemas.RutJoi.required()
        },
        output: {
            200: {
                body: JoiSchemas.RespServiciosAutorizadosJoi.keys({ 
                     estado :Joi.required()
                })
            }
        }
    },
    handler: [
        commonMiddleware,
        async(ctx) => {
            ctx.body = logicEscolares.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar(ctx.params.ID_REGION, ctx.params.RUT_EMPRESA, ctx.params.RUT_SOLICITANTE)
        }
    ]
})

//psalas persona 
router.get('/escolares/servicios/regiones/:ID_REGION/personas/:RUT_SOLICITANTE', {
    meta: {
        swagger: {
            summary: 'Validar Persona Autorizada',
            description: '',
            tags: ['escolares']
        }
    },
    validate: {
        params: {
            ID_REGION: JoiSchemas.CodigoRegionJoi.required(),
            RUT_SOLICITANTE: JoiSchemas.RutJoi.required()
        },
        output: {
            200: {
                body: Joi.array().items(JoiSchemas.RespServiciosAutorizadosJoi)
            }
        }
    },
    handler: [
        commonMiddleware,
        async(ctx) => {
            log.debug("ID_REGION: " + ctx.params.ID_REGION)
            log.debug("RUT_SOLICITANTE: " + ctx.params.RUT_SOLICITANTE)
            ctx.body = logicEscolares.getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar(ctx.params.ID_REGION, ctx.params.RUT_SOLICITANTE)

        }
    ]
})

//psalas persona mandatario
router.get('/escolares/servicios/regiones/:ID_REGION/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', {
    meta: {
        swagger: {
            summary: 'Validar Mandatario Autorizado',
            description: '',
            tags: ['escolares']
        }
    },
    validate: {
        params: {
            ID_REGION: JoiSchemas.CodigoRegionJoi.required(),
            RUT_RESPONSABLE: JoiSchemas.RutJoi.required(),
            RUT_SOLICITANTE: JoiSchemas.RutJoi.required()
        },
        output: {
            200: {
                body: Joi.array().items(JoiSchemas.RespServiciosAutorizadosJoi)
            }
        }
    },
    handler: [
        commonMiddleware,
        async(ctx) => {
            ctx.body = await logicEscolares.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioEscolar(ctx.params.ID_REGION, ctx.params.RUT_RESPONSABLE, ctx.params.RUT_SOLICITANTE)
        }
    ]

})

router.get('/escolares/servicios/tipos_servicios', {
    meta: {
        swagger: {
            summary: 'Solicitudes',
            description: '',
            tags: ['escolares']
        }
    },
    validate: {

    },
    handler: [
        commonMiddleware,
        (ctx) => {
            ctx.body = { test: ctx.url }
        }
    ]
})

router.post('/escolares/servicios/ppus/validaciones', {
    meta: {
        swagger: {
            summary: 'Validar flota',
            description: '',
            tags: ['escolares']
        }
    },
    validate: {

    },
    handler: [
        commonMiddleware,
        async(ctx) => {
            let inputParams = ctx.request.body
            let inputValidarServicios = new InputValidarFlota(inputParams.rut_solicitante, inputParams.rut_responsable, inputParams.folio, inputParams.region, inputParams.lstPpuRut, inputParams.CantidadRecorridos)
            ctx.body = await logicEscolares.InputValidarServiciosFlota(inputValidarServicios)
        }
    ]
})

router.post('/escolares/servicios/solicitudes', {
    meta: {
        swagger: {
            summary: 'solicitudes',
            description: '',
            tags: ['escolares']
        }
    },
    validate: {

    },
    handler: [
        commonMiddleware,
        (ctx) => {
            ctx.body = { test: ctx.url }
        }
    ]
})


module.exports = router