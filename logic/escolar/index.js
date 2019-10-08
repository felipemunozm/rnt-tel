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
        return  escolarRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar(id_region,rut_representante,rut_solicitante,idtramite)
                                
    },
    //psalas persona - solicitante
    getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar:   (id_region,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.escolares.IdsTramites[0]
        return  escolarRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar(id_region,rut_solicitante,idtramite)
    }
}