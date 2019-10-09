const colectivosRepository = require("../../repository/colectivos")
const log = require('../../log')

module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica colectivos exiosa", code: "OK"}
    },
    getAutorizacionPorEmpresaAndPersonaTramiteInscripcionTaxiColectivo: (id_region,rut_empresa,rut_solicitante, idtramite)=>{
       
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = colectivosRepository.getAutorizacionPorEmpresaAndPersonaTramiteInscripcionTaxiColectivo(id_region,rut_empresa,rut_solicitante,idtramite)
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
    getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo: (id_region,rut_solicitante, idtramite)=>{
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = colectivosRepository.getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo(id_region,rut_solicitante,idtramite)
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
        
    }
}