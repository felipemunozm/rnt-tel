const taxisRepository = require('../../repository/taxis')

module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica taxis exiosa", code: "OK"}
    },
    findServiciosByRepresentanteLegalAndEmpresa: (rut_empresa, rut_representante_legal) => {
        let response = {
            servicios: []
        }
        let servicios = taxisRepository.findServiciosByRepresentanteLegalAndEmpresa(rut_empresa, rut_representante_legal)
        servicios.forEach( async (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = await taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.COD_REGION) 
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
        let servicios = taxisRepository.findServiciosByMandatarioAndRepresentanteAndEmpresa(rut_empresa, rut_representante, rut_solicitante)
        servicios.forEach((servicioDB) => {
            //Extraer Recorridos
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.COD_REGION)
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