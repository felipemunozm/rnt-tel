const privadoRepository = require('../../repository/privados')
const rntTramitesMap= require('../../config')
module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica taxis exiosa", code: "OK"}
    },
    //psalas empresa -solicitante
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioPrivado:   (id_region,rut_representante,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.privados.IdsTramites[0]
        return  privadoRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioPrivado(id_region,rut_representante,rut_solicitante,idtramite)
                                
    },
    //psalas persona - solicitante
    getAutorizadoPorPersonaParaTramiteInscripcionServicioPrivado:   (id_region,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.privados.IdsTramites[0]
        return  privadoRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioPrivado(id_region,rut_solicitante,idtramite)
    }
}