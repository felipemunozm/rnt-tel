const taxisRepository = require('../../repository/taxis')
const rntTramitesMap= require('../../config')
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
            response.servicios.push({
                folio:servicioDB.FOLIO,
                region: servicioDB.REGION,
                rut_responsable: servicioDB.RUT_RESPONSABLE,
                rut_representante: servicioDB.RUT_REPRESENTANTE,
                recorridos: recorridos
            })
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
            response.servicios.push({
                folio:servicioDB.FOLIO,
                region: servicioDB.REGION,
                rut_responsable: servicioDB.RUT_RESPONSABLE,
                rut_representante: servicioDB.RUT_REPRESENTANTE,
                recorridos: recorridos
            })
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
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    } ,
    //psalas empresa -solicitante
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis:   (id_region,rut_representante,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.taxis.IdsTramites[0]
        return  taxisRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis(id_region,rut_representante,rut_solicitante,idtramite)
                                
    },
    //psalas persona - solicitante
    getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis:   (id_region,rut_solicitante,rut_solicitante2) => {
        let idtramite =rntTramitesMap.rntTramitesMap.taxis.IdsTramites[0]
        return  taxisRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis(id_region,rut_solicitante,idtramite)
    },
}