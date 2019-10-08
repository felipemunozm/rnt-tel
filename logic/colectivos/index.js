const colectivosRepository = require("../../repository/colectivos")
const log = require('../../log')

module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica colectivos exiosa", code: "OK"}
    },
    getAutorizacionPorEmpresaAndPersonaTramiteInscripcionTaxiColectivo: (id_region,rut_empresa,rut_solicitante, idtramite)=>{
        return colectivosRepository.getAutorizacionPorEmpresaAndPersonaTramiteInscripcionTaxiColectivo(id_region,rut_empresa,rut_solicitante,idtramite)
    },
    getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo: (id_region,rut_solicitante, rut_representante, idtramite)=>{
        return colectivosRepository.getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo(id_region,rut_solicitante,rut_representante,idtramite)
    }
}