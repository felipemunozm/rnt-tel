const busesRepository = require("../../repository/buses")
const log = require('../../log')
const rntTramitesMap= require('../../config')
const RuleEngine = require('json-rules-engine').Engine
const config = require('../../config')
const ruleEngineCommons = require('../commons/RuleEngine')
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
        if(servicios.estado == 'RECHAZADO' || servicios.estado=='undefined' ) {
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
        if(servicios.estado == 'RECHAZADO' || servicios.estado=='undefined' ) {
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
        //implementar como extraer data para llenar objeto para evaluar condiciones
        let datosVehiculo = {
            registrocivil: {
                rutPropietario: '12-9',
                antiguedad: 5,
                tipoVehiculo: 'BUS',
                leasing: true,
                rutMerotenedor: '1-9',
                comunidad: false
            },
            sgprt: {
                resultadoRT: 'Aprobada',
                fechaVencimientoRT: '10/12/2020'
            },
            rnt: {
                estado: 'Cancelado', //No Encontrado
                tipoCancelacion: 'Cancelado por Traslado',
                regionOrigen: '01',
                antiguedadMaxima: 10,
                lstTipoVehiculoPermitidos: ['BUS','MINIBUS'],
                categoria: 'Publico'
            },
            solicitud: {
                rutPropietario: '1-9',
                regionInscripcion: '01',
                ppu: 'BBCC12'
            }
        }
        let validacionInscripcionBuses = config.rntRules.inscripcionVehiculo.validacionInscripcionBuses
        let ruleEngine = new RuleEngine()
        ruleEngine.addRule(validacionInscripcionBuses)
        let continua = true;
        let docs = []
        //verificar si no valido todo OK, hay casos en los que debe continuar y otros en los que no
        ruleEngineCommons.cargarRevisionRechazoVehiculo(ruleEngine)
        let lstFlotaValidada = []
        let lstFlotaRechazada = []
        for(let i = 0; i< inputValidarFlota.lstPpuRut.length; i++) {
            await ruleEngine //variar el objeto datosVehiculo, para cada PPU
            .run(datosVehiculo)
            .then( results => {
                results.events.map(event => {
                    log.debug(JSON.stringify(event))
                    log.debug("Aprobadas reglas de negocio: " + event.params.mensaje)
                    continua = true
                })
            })
             //documentos obligatorios para todos los casos: V04,V09
            docs.push('V04','V09')
            //se revisa si procede la PPU para añadirla a lista de flota validada
            if(continua == true) {
                lstFlotaValidada.push({ppu: datosVehiculo.solicitud.ppu,validacion: true, documentosAdjuntar: docs})
                
            } else {
                lstFlotaRechazada.push({ppu: datosVehiculo.solicitud.ppu,validacion: false, mensaje: "PPU Rechazada"})
            }
            continua = true
            docs = []
        }
        let monto = (inputValidarFlota.cantidadRecorridos * lstFlotaValidada.length ) * 400
        let response = {listaFlotaValidada: lstFlotaValidada, listaFlotaRechazada: lstFlotaRechazada, monto: monto}
        log.debug(JSON.stringify(docs))
        return response
    }
   
}