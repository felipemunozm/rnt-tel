const taxisRepository = require('../../repository/taxis')
const rntTramitesMap= require('../../config')
const RuleEngine = require('json-rules-engine').Engine
const ruleEngineCommons = require('../commons/RuleEngine')
module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica taxis exiosa", code: "OK"}
    },
    getServiciosVigentesInscritosPorRutResponsable: (rut_responsable) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = taxisRepository.getServiciosVigentesInscritosPorRutResponsable(rut_responsable)
        if(servicios.length == 0 ) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach( (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.ID_REGION) 
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    tipo_servicio: servicioDB.TIPO_SERVICIO
                }) 
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    },
    getServiciosVigentesInscritosPorRutResponsableAndRutMandatario: (rut_responsable, rut_mandatario) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = taxisRepository.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario(rut_responsable, rut_mandatario)
        if(servicios.length == 0 ) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach( (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.ID_REGION)
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
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
        let servicios = taxisRepository.findServiciosByRepresentanteLegalAndEmpresa(rut_empresa, rut_representante_legal)
        if(servicios.length == 0 ) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach( (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.COD_REGION) 
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
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
                    tipo_servicio: servicioDB.TIPO_SERVICIO
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
            servicios: []
        }
        let servicios = taxisRepository.findServiciosByMandatarioAndRepresentanteAndEmpresa(rut_empresa, rut_representante, rut_solicitante)
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
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.COD_REGION)
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
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
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    } ,
    //psalas empresa -solicitante
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis:   (id_region,rut_representante,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.taxis.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios =   taxisRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis(id_region,rut_representante,rut_solicitante,idtramite)
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
    getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis:   (id_region,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.taxis.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios =   taxisRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis(id_region,rut_solicitante,idtramite)
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
    validarFlota: async (inputValidarFlota) => {
        let datosVehiculo = {
            registrocivil: {
                rutPropietario: '12-9',
                antiguedad: 5,
                tipoVehiculo: 'BUS',
                leasing: false,
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
        let validacionInscripcionTaxis = {
            conditions: {

            },
            event: {
                type: 'aceptado',
                params: {
                    mensajes: 'Vehiculo Aceptado'
                }
            }
        }
        let ruleEngine = new RuleEngine()
        ruleEngine.addRule(rntTramitesMap.rntRules.inscripcionVehiculo.validacionInscripcionBuses)
        let continua = {estado:true}
        let docs = []
        let docsOpcionales = []
        ruleEngineCommons.cargarRevisionRechazoVehiculo(RuleEngine,docs,continua)
        let lstFlotaValidada = []
        let lstFlotaRechazada = []
        for(let i = 0; i < inputValidarFlota.lstPpuRut.lenght; i++) {
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
            docs.push({codigo: 'V04',descripcion: 'Adjunte copia de "Título que habilita al vehículo a prestar servicios" (Formulario N°3)'},{codigo: 'V09',descripcion: 'Adjunte copia de "Permiso de Circulación" del vehiculo'})
            docsOpcionales.push({codigo: 'V08', descripcion: 'Adjunte copia de "Otorgamiento de Subsidio" o "Adjudicacion de Condiciones de Operación"'})
            //se revisa si procede la PPU para añadirla a lista de flota validada
            if(continua.estado == true) {
                lstFlotaValidada.push({ppu: datosVehiculo.solicitud.ppu,validacion: true, documentosAdjuntar: docs, documentosOpcionales: docsOpcionales})
                
            } else {
                lstFlotaRechazada.push({ppu: datosVehiculo.solicitud.ppu,validacion: false, mensaje: "PPU Rechazada"})
            }
            continua.estado = true
            docs = []
            docsOpcionales = []
        }
        let monto = (inputValidarFlota.cantidadRecorridos * lstFlotaValidada.length ) * 400
        let response = {listaFlotaValidada: lstFlotaValidada, listaFlotaRechazada: lstFlotaRechazada, monto: monto}
        return response
    }
}