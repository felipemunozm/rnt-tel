const ibmdb = require("../db")
const commons = require('../commons')
const log = require('../../log')

module.exports = {
 
     //psalas
    getAutorizadoPorPersonaParaTramiteInscripcionServicioPrivado:  (id_region, rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorPersonaParaTramiteInscripcionServicio (id_region, rut_solicitante,idtramite) 
    },
     //psalas
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioPrivado:  (id_region, rut_representante, rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicio (id_region, rut_representante,rut_solicitante,idtramite) 
    }
  
   
}