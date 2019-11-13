const escolarRepository = require("../../repository/escolar")
const log = require('../../log')
const rntTramitesMap= require('../../config')

module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica escolar exiosa", code: "OK"}
    },
     //psalas empresa -solicitante
     getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar:   (id_region,rut_representante,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.escolares.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = escolarRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar(id_region,rut_representante,rut_solicitante,idtramite)
        if(!Array.isArray(servicios) ) {
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
    getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar:   (id_region,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.escolares.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios =  escolarRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar(id_region,rut_solicitante,idtramite)
        if(!Array.isArray(servicios) ) {
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
    //psalas persona - mandatario
   getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioEscolar:   (id_region,RUT_RESPONSABLE,rut_solicitante) => {
    let idtramite =rntTramitesMap.rntTramitesMap.escolares.IdsTramites[0]
    let response = {
        estado: '',
        mensaje: '',
        servicios: []
    }
    let servicios = escolarRepository.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioEscolar(id_region,RUT_RESPONSABLE,rut_solicitante,idtramite)
    if(!Array.isArray(servicios) ) {
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
    
}
}