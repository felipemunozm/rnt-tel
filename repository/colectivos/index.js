const ibmdb = require("../db")
const commons = require('../commons')
const log = require('../../log')
module.exports = {

    getAutorizacionPorEmpresaAndPersonaTramiteInscripcionTaxiColectivo: (id_region, rut_empresa, rut_solicitante, idtramite) => {
        return commons.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicio(id_region, rut_empresa, rut_solicitante, idtramite)
    },
    getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo: (id_region, rut_solicitante, idtramite) => {
        return commons.getAutorizadoPorPersonaParaTramiteInscripcionServicio(id_region, rut_solicitante, idtramite )

    },
     //psalas persona-mandatario
     getAutorizacionPorPersonaMandatarioInscripcionServicioTaxiColectivo:  (id_region, rut_representante,rut_solicitante,idtramite) => {
            return commons.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicio (id_region,rut_representante, rut_solicitante,idtramite) 
                
        }


}