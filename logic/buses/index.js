const busesRepository = require("../../repository/buses")
module.exports = {
    getTest: () => {
        queryOut = busesRepository.getTest();
        console.log("queryOut= " + queryOut)
        return {mensaje: "ejecucion de logica buses exiosa", code: "OK", ppus: queryOut }
    },
    getAutorizadosParaInscripcionServiciosBuses: async (rut) => {
        return busesRepository.getAutorizadosParaInscripcionServiciosBuses(rut)
    },
    getAutorizadoPorEmpresaParaInscripcionServicioBuses: async (rut,rut_empresa) => {
        return busesRepository.getAutorizadoPorEmpresaParaInscripcionServicioBuses(rut,rut_empresa)
    },
    findRepresentanteLegalByEmpresa: async (rut_empresa, rut_representante_legal) => {
        return busesRepository.findRepresentanteLegalByEmpresa(rut_empresa, rut_representante_legal)
    },
    getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses:   (id_region,rut_solicitante) => {
        return  busesRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses(id_region,rut_solicitante)
    },
    getAutorizadoPorMandatarioParaTramiteInscripcionServicioBuses:  (rut,rut_empresa) => {
        return busesRepository.getAutorizadoPorMandatarioParaTramiteInscripcionServicioBuses(rut,rut_empresa)
    },
    getServiciosVigentesInscritosPorRutResponsable:  (rut) => {
        let response = {
            servicios: []
        }
        let servicios = busesRepository.getServiciosVigentesInscritosPorRutResponsable(rut)
        servicios.forEach( async (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = await busesRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.ID_REGION) 
            response.servicios.push({
                folio:servicioDB.FOLIO,
                region: servicioDB.REGION,
                rut_responsable: servicioDB.RUT_RESPONSABLE,
                rut_representante: servicioDB.RUT_REPRESENTANTE,
                recorridos: recorridos
            })
        })
        return response
    },
    findServiciosByRepresentanteLegalAndEmpresa: async (rut_empresa, rut_representante_legal) => {
        let response = {
            servicios: []
        }
        let servicios = busesRepository.findServiciosByRepresentanteLegalAndEmpresa(rut_empresa, rut_representante_legal)
        servicios.forEach( async (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = await busesRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.COD_REGION) 
            response.servicios.push({
                folio:servicioDB.FOLIO,
                region: servicioDB.REGION,
                rut_responsable: servicioDB.RUT_RESPONSABLE,
                rut_representante: servicioDB.RUT_REPRESENTANTE,
                recorridos: recorridos
            })
        })
        return response
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresa: (rut_empresa, rut_representante, rut_solicitante) => {
        let response = {
            servicios: []
        }
        let servicios = busesRepository.findServiciosByMandatarioAndRepresentanteAndEmpresa(rut_empresa, rut_representante, rut_solicitante)
        servicios.forEach((servicioDB) => {
            //Extraer Recorridos
            let recorridos = busesRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.COD_REGION)
            response.servicios.push({
                folio:servicioDB.FOLIO,
                region: servicioDB.REGION,
                rut_responsable: servicioDB.RUT_RESPONSABLE,
                rut_representante: servicioDB.RUT_REPRESENTANTE,
                rut_mandatario: servicioDB.RUT_MANDATARIO,
                recorridos: recorridos
            })
        })
        return response
    }
   
}