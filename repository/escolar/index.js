const ibmdb = require("../db")
const commons = require('../commons')
const log = require('../../log')



module.exports = {
     //psalas
    getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar:  (id_region, rut_solicitante,rut_representante,idtramite) => {
        return commons.getAutorizadoPorPersonaParaTramiteInscripcionServicio (id_region, rut_solicitante,rut_representante,idtramite) 
    },
     //psalas
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar:  (id_region, rut_representante, rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicio (id_region, rut_representante,rut_solicitante,idtramite) 
    }
}