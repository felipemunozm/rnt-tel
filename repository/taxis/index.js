const ibmdb = require("../db")
const commons = require('../commons')
const log = require('../../log')
const config = require('../../config')

module.exports = {
    findRepresentanteLegalByEmpresa: (rut_empresa, rut_representante_legal) => {
        return commons.findRepresentanteLegalByEmpresaAndTipoServicioList(rut_empresa, rut_representante_legal, config.rntTipoServicioMap.taxis.IdsTiposServicios)
    },
    findServiciosByRepresentanteLegalAndEmpresa: (rut_empresa, rut_representante_legal) => {
        return commons.findServiciosByRepresentanteLegalAndEmpresaAndTipoServicioList(rut_empresa, rut_representante_legal, config.rntTipoServicioMap.taxis.IdsTiposServicios)
    },
    findRecorridosByFolioRegion: (folio, region) => {
        return commons.findRecorridosByFolioRegionAndTipoServicio(folio,region,config.rntTipoServicioMap.taxis.IdsTiposServicios)
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresa: (rut_empresa, rut_representante, rut_solicitante) => {
        return commons.findServiciosByMandatarioAndRepresentanteAndEmpresaAndTiposServicios(rut_empresa, rut_representante, rut_solicitante, config.rntTipoServicioMap.taxis.IdsTiposServicios)
    },
     //psalas
    getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis:  (id_region, rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorPersonaParaTramiteInscripcionServicio (id_region, rut_solicitante,idtramite) 
    },
     //psalas
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis:  (id_region, rut_representante, rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicio (id_region, rut_representante,rut_solicitante,idtramite) 
    },
      //psalas persona-mandatario
      getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioTaxis:  (id_region, rut_representante,rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicio (id_region,rut_representante, rut_solicitante,idtramite) 
            
    },
  
    getServiciosVigentesInscritosPorRutResponsable: (rut_responsable) => {
        return commons.getServiciosVigentesInscritosPorRutResponsable(rut_responsable, config.rntTipoServicioMap.taxis.IdsTiposServicios)
    },
    getServiciosVigentesInscritosPorRutResponsableAndRutMandatario: (rut_responsable, rut_mandatario) => {
        return commons.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario(rut_responsable, rut_mandatario, config.rntTipoServicioMap.taxis.IdsTiposServicios)
    },
    findInscripcionRNTData: async (folio, region, ppu, tipoVehiculoSrcei) => {
        let response = {
            estado: '',
            tipoCancelacion: '',
            regionOrigen: '',
            antiguedadMaxima: '',
            lstTipoVehiculoPermitidos: [],
            categoria: ''
        }

        let vehiculoExiste = await commons.checkVehiculoByPPU(ppu).length > 0 ? true : false
        let antiguedadMaxima = await commons.findAntiguedadMaximaByTipoVehiculo(tipoVehiculoSrcei).ANTIGUEDAD
        if(vehiculoExiste) {
            //diseñar response con tipos de cancelacion
            //buscar info de vehiculo:
            let infoRNT = await commons.findInfoVehiculoParaInscripcion(ppu)
            response = {
                estado: infoRNT[0].ESTADO,
                tipoCancelacion: infoRNT[0].TIPO_CANCELACION,
                regionOrigen: infoRNT[0].CODIGO_REGION,
                antiguedadMaxima: antiguedadMaxima,
                lstTipoVehiculoPermitidos: commons.findLstTipoVehiculoPermitidoByFolioRegion(folio, region),
                categoria: infoRNT[0].CATEGORIA
            }
            
        } else {
            //diseñar response con vehiculo no encontrado
            response = {
                estado: '0',
                tipoCancelacion: 'vehiculo no encontrado',
                regionOrigen: undefined,
                antiguedadMaxima: 0,
                lstTipoVehiculoPermitidos: []
            }
        }

        return response
    }
}