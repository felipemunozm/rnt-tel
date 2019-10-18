const busesRepository = require("../../repository/buses")
const log = require('../../log')
const rntTramitesMap= require('../../config')
const RuleEngine = require('json-rules-engine').Engine
// const Rule = require('json-rules-engine').Rule
const config = require('../../config')
const ruleEngineEvents = require('./ruleEngineEvents')
const services = require('../../utils/serviciosGateway')
const srceiUtils = require('../../utils/SRCeIUtils')
module.exports = {
    getTest: () => {
        queryOut = busesRepository.getTest();
        console.log("queryOut= " + queryOut)
        return {mensaje: "ejecucion de logica buses exiosa", code: "OK", ppus: queryOut }
    },
    getAutorizadosParaInscripcionServiciosBuses: (rut) => {
        return busesRepository.getAutorizadosParaInscripcionServiciosBuses(rut)
    },
    getAutorizadoPorEmpresaParaInscripcionServicioBuses: (rut,rut_empresa) => {
        return busesRepository.getAutorizadoPorEmpresaParaInscripcionServicioBuses(rut,rut_empresa)
    },
    findRepresentanteLegalByEmpresa: (rut_empresa, rut_representante_legal) => {
        return busesRepository.findRepresentanteLegalByEmpresa(rut_empresa, rut_representante_legal)
    },
    //psalas empresa -solicitante
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioBuses:   (id_region,rut_representante,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.buses.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = busesRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioBuses(id_region,rut_representante,rut_solicitante,idtramite)
        if(servicios.estado == 'RECHAZADO' || servicios.estado==undefined ) {
            response.estado = servicios.estado
            response.mensaje = servicios.mensaje
            delete response.servicios
            return response
        }else
        { 
            response.estado = 'APROBADO'
            response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
            servicios.forEach((servicioDB) => {
                response.servicios.push({
                    ID_TIPO_SERVICIO:servicioDB.ID_TIPO_SERVICIO,
                    tiposervicio: servicioDB.TIPOSERVICIO
                })
              });
              if(response.servicios.length == 0) {
                delete response.servicios
            }
            return response

        }
    },
    //psalas persona - solicitante
    getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses:   (id_region,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.buses.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = busesRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses(id_region,rut_solicitante,idtramite)
        if(servicios.estado == 'RECHAZADO' || servicios.estado==undefined ) {
            response.estado = servicios.estado
            response.mensaje = servicios.mensaje
            delete response.servicios
            return response
        }else
        { 
            response.estado = 'APROBADO'
            response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
            servicios.forEach((servicioDB) => {
                response.servicios.push({
                    ID_TIPO_SERVICIO:servicioDB.ID_TIPO_SERVICIO,
                    tiposervicio: servicioDB.TIPOSERVICIO
                })
              });
              if(response.servicios.length == 0) {
                delete response.servicios
            }
            return response

        }
        
    },
    getServiciosVigentesInscritosPorRutResponsableAndRutMandatario:  (rut_responsable, rut_mandatario) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = busesRepository.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario(rut_responsable, rut_mandatario)
        if(servicios.length == 0 ) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach((servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = busesRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.ID_REGION) 
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    },
    getServiciosVigentesInscritosPorRutResponsable:  (rut) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = busesRepository.getServiciosVigentesInscritosPorRutResponsable(rut)
        if(servicios.length == 0 ) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach((servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = busesRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.ID_REGION) 
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    },
    findServiciosByRepresentanteLegalAndEmpresa: (rut_empresa, rut_representante_legal) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = busesRepository.findServiciosByRepresentanteLegalAndEmpresa(rut_empresa, rut_representante_legal)
        if(servicios.length == 0 ) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        log.debug('Servicios: ' + JSON.stringify(servicios))
        servicios.forEach( (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = busesRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.COD_REGION) 
            log.debug('recorridos: ' + JSON.stringify(recorridos))
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    tipo_servicio: servicioDB.TIPOSERVICIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    tipo_servicio: servicioDB.TIPOSERVICIO
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresa: (rut_empresa, rut_representante, rut_solicitante) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = busesRepository.findServiciosByMandatarioAndRepresentanteAndEmpresa(rut_empresa, rut_representante, rut_solicitante)
        if(servicios.length == 0 ) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach((servicioDB) => {
            //Extraer Recorridos
            let recorridos = busesRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.COD_REGION)
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    }, 
    //@param: InputValidarFlota class
    validarFlota: async (inputValidarFlota ) => {
        
        // let validacionInscripcionBuses = config.rntRules.inscripcionVehiculo.validacionInscripcionBuses
        let validaPropietarioRule = config.validacionRules.inscripcionVehiculo.validaPropietarioRule
        let validaAntiguedadRule = config.validacionRules.inscripcionVehiculo.validaAntiguedadRule
        let validaRTRule = config.validacionRules.inscripcionVehiculo.validaRTRule
        let validaInscripcionBusesRule = config.validacionRules.inscripcionVehiculo.buses.validaInscripcionRNTRule
        let validaTVNormaRule = config.validacionRules.inscripcionVehiculo.validaTipoVehiculoNormaRule
        let ruleEngine = new RuleEngine()
        // ruleEngine.addRule(validacionInscripcionBuses)
        // log.trace("RULE: " + JSON.stringify(validaRTRule))
        ruleEngine.addRule(validaPropietarioRule)
        ruleEngine.addRule(validaAntiguedadRule)
        ruleEngine.addRule(validaRTRule)
        ruleEngine.addRule(validaInscripcionBusesRule)
        ruleEngine.addRule(validaTVNormaRule)
        //continua no es bool solo para ser pasado por referencia a la funcion que realiza los eventos
        let continua = {estado:true, lstRechazos: []}
        let docs = []
        let docsOpcionales = []
        //verificar si no valido todo OK, hay casos en los que debe continuar y otros en los que no
        ruleEngineEvents.revisionRechazosBuses(ruleEngine, docs, continua)
        ruleEngineEvents.revisionValidadosBuses(ruleEngine, docs, continua)
        // ruleEngineCommons.cargarRevisionRechazoVehiculo(ruleEngine, docs, continua)
        let lstFlotaValidada = []
        let lstFlotaRechazada = []
        for(let i = 0; i< inputValidarFlota.lstPpuRut.length; i++) {
            //implementar como extraer data para llenar objeto para evaluar condiciones
            try {
                let srceiResponse = await services.getPPUSRCeI(inputValidarFlota.lstPpuRut[i].ppu)
                log.trace('sreciResponse: ' + JSON.stringify(srceiResponse))
                let sgprtResponse = await services.getPPURT(inputValidarFlota.lstPpuRut[i].ppu)
                log.trace('sgprtResponse: ' + JSON.stringify(sgprtResponse))
                //para datos RNT, se necesitan las consultas por PPU, para determinar si existe o no y los estados del vehiculo, la region de origen del PPU y la categoria de transporte ne caso de existir.
                let dataRNT = busesRepository.findInscripcionRNTData(inputValidarFlota.folio, inputValidarFlota.region, ppu, srceiResponse.srceiResponse.return.tipoVehi)
                log.trace('DataRNT para PPU ' + inputValidarFlota.lstPpuRut[i].ppu + ": " + JSON.stringify(dataRNT))
                //otra consulta para determinar la Antiguedad Maxima permitida por tipo de vehiculo en el folio donde se desea inscribir
                log.trace('FechaPRT: ' + sgprtResponse.return.revisionTecnica.fechaVencimiento)
                let datosVehiculo = {
                    registrocivil: {
                        rutPropietario: srceiResponse.return.propieActual.propact.itemPropact.length > 1 ? srceiUtils.getArrayPropietarioComunidad(srceiResponse.return.propieActual.propact.itemPropact) : srceiResponse.return.propieActual.propact.itemPropact[0].rut ,
                        antiguedad: (srceiResponse.return.aaFabric > new Date().getFullYear) ? 0 : (Number((new Date()).getFullYear()) - Number(srceiResponse.return.aaFabric)),
                        tipoVehiculo: srceiResponse.return.tipoVehi,
                        leasing: srceiUtils.determinarLeasing(srceiResponse.return.limita),
                        rutMerotenedor: srceiUtils.getRutMerotenedor(srceiResponse.return.limita),
                        comunidad: srceiResponse.return.propieActual.propact.itemPropact.length > 1 ? true : false
                    },
                    sgprt: {
                        resultadoRT: (sgprtResponse.return.revisionTecnica.resultado == 'A' && sgprtResponse.return.revisionesGases.revisionGas[sgprtResponse.return.revisionesGases.revisionGas.length - 1].resultado == 'A') ? 'Aprobada' : 'Rechazada',
                        fechaVencimientoRT: sgprtResponse.return.revisionTecnica.fechaVencimiento
                    },
                    rnt: {
                        estado: dataRNT.estado, //No Encontrado = 0, Cancelado Definitivo = 3, VIGENTE = 1, Cancelado Temporal = 2 
                        tipoCancelacion: dataRNT.tipoCancelacion,
                        regionOrigen: dataRNT.regionOrigen,
                        antiguedadMaxima: dataRNT.antiguedadMaxima,
                        lstTipoVehiculoPermitidos: dataRNT.lstTipoVehiculoPermitidos,
                        categoria: dataRNT.categoria
                    },
                    solicitud: {
                        rutPropietario: inputValidarFlota.lstPpuRut[i].rut,
                        regionInscripcion: inputValidarFlota.region,
                        ppu: inputValidarFlota.lstPpuRut[i].ppu,
                        ppureemplaza: inputValidarFlota.ppureemplaza
                    }
                }
                log.trace("datosVehiculo: " + JSON.stringify(datosVehiculo))
                let datosVehiculo2 = {
                    registrocivil: {
                        rutPropietario: '12-9',
                        antiguedad: 5,
                        tipoVehiculo: 'AUTOMOVIL',
                        leasing: false,
                        rutMerotenedor: '1-9',
                        comunidad: false
                    },
                    sgprt: {
                        resultadoRT: 'Rechazada',
                        fechaVencimientoRT: '10/12/2020'
                    },
                    rnt: {
                        estado: 'Cancelado', //No Encontrado, Cancelado Definitivo
                        tipoCancelacion: 'Cancelado por Traslado',
                        regionOrigen: '04',
                        antiguedadMaxima: 10,
                        lstTipoVehiculoPermitidos: ['BUS','MINIBUS'],
                        estadoPPUReemplazo: 'Cancelado Definitivo',// solo taxis....
                        categoria: 'Publico'
                    },
                    solicitud: {
                        rutPropietario: '1-9',
                        regionInscripcion: '01',
                        ppu: 'BBCC12',
                        ppureemplaza: 'AABB12'
                    }
                }
                await ruleEngine //variar el objeto datosVehiculo, para cada PPU
                .run(datosVehiculo)
                .then( results => {
                    results.events.map(event => {
                        log.trace(JSON.stringify(event))
                        log.debug("Aprobadas reglas de negocio: " + event.params.mensaje)
                        // continua.estado = true
                    })
                })
                //documentos obligatorios para todos los casos: V04,V09
                docs.push({codigo: 'V04',descripcion: 'Adjunte copia de "Título que habilita al vehículo a prestar servicios" (Formulario N°3)'},{codigo: 'V09',descripcion: 'Adjunte copia de "Permiso de Circulación" del vehiculo'})
                docsOpcionales.push({codigo: 'V08', descripcion: 'Adjunte copia de "Otorgamiento de Subsidio" o "Adjudicacion de Condiciones de Operación"'})
                //se revisa si procede la PPU para añadirla a lista de flota validada
                if(continua.estado == true) {
                    lstFlotaValidada.push({ppu: datosVehiculo.solicitud.ppu,validacion: true, documentosAdjuntar: docs, documentosOpcionales: docsOpcionales})
                    
                } else {
                    lstFlotaRechazada.push({ppu: datosVehiculo.solicitud.ppu,validacion: false, mensaje: "PPU Rechazada",listaRechazos: continua.lstRechazos})
                }
                continua = {estado: true, lstRechazos: []}
                docs = []
                docsOpcionales = []
            } catch (e) {
                log.error("Error en logica de negocio: " + e)
            }
                
        }
        let monto = (inputValidarFlota.cantidadRecorridos * lstFlotaValidada.length ) * 400
        let response = {listaFlotaValidada: lstFlotaValidada, listaFlotaRechazada: lstFlotaRechazada, monto: monto}
        return response
    }
   
}