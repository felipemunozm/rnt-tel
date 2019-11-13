const ibmdb = require("../db")
const commons = require('../commons')
const log = require('../../log')
const config = require('../../config')
module.exports = {
    getTest: () => {
        return ibmdb.query("SELECT PPU FROM NULLID.RNT_VEHICULO FETCH FIRST 10 ROWS ONLY", [])
    },
    getAutorizadosParaInscripcionServiciosBuses: (rut) => {
        return ibmdb.query("SELECT DISTINCT(per.RUT), per.NOMBRE, cat.NOMBRE as CATEGORIA, tsa.NOMBRE as TIPO_SERVICIO " +
        "FROM TEL.TEL_AUTORIZACION aut inner JOIN TEL.TEL_AUTORIZACION_TRAMITE aut_tram ON aut.ID = aut_tram.ID_AUTORIZACION " +
        "left JOIN tel.TEL_PERSONA per ON aut.ID_PERSONA = per.ID AND per.TIPO_PERSONA_ID = 1 " +
        "INNER JOIN NULLID.RNT_CATEGORIA_TRANSPORTE cat ON cat.id = aut.ID_CATEGORIA " +
        "INNER JOIN nullid.RNT_TIPO_SERVICIO ts ON ts.id = aut.ID_TIPO_SERVICIO " +
        "INNER JOIN NULLID.RNT_TIPO_SERVICIO_AREA tsa ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
        "INNER JOIN NULLID.RNT_TRAMITE tram ON tram.id = 1 where per.RUT = ?",[rut])
    },
    getAutorizadoPorEmpresaParaInscripcionServicioBuses: (rut, rut_empresa) => {
        return ibmdb.query("SELECT distinct(per2.RUT) AS RUT_PERSONA, per2.NOMBRE AS NOMBRE_PERSONA, per.RUT AS RUT_EMPRESA, per.NOMBRE AS NOMBRE_EMPRESA, tram.NOMBRE AS NOMBRE_TRAMITE " +
        "FROM tel.TEL_RESPONSABLE resp INNER JOIN tel.TEL_RESPONSABLE_AUTORIZACION resp_aut ON resp_aut.ID_RESPONSABLE = resp.ID " +
        "INNER JOIN tel.TEL_PERSONA per ON per.ID = resp.ID_PERSONA AND per.TIPO_PERSONA_ID = 2 " +
        "INNER JOIN tel.TEL_AUTORIZACION aut ON aut.id = RESP_AUT.ID_AUTORIZACION " +
        "INNER JOIN tel.TEL_PERSONA per2 ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
        "INNER JOIN NULLID.RNT_CATEGORIA_TRANSPORTE cat ON cat.id = aut.ID_CATEGORIA " +
        "INNER JOIN nullid.RNT_TIPO_SERVICIO ts ON ts.id = aut.ID_TIPO_SERVICIO " +
        "INNER JOIN NULLID.RNT_TIPO_SERVICIO_AREA tsa ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
        "INNER JOIN NULLID.RNT_TRAMITE tram ON tram.id = 1 " +
        "WHERE per2.RUT = ? AND per.RUT = ?", [rut, rut_empresa])
    },
    findRepresentanteLegalByEmpresa: (rut_empresa, rut_representante_legal) => {
        return commons.findRepresentanteLegalByEmpresaAndTipoServicioList(rut_empresa, rut_representante_legal, config.rntTipoServicioMap.buses.IdsTiposServicios)
    },
         //psalas
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioBuses:  (id_region,rut_representante,rut_solicitante,idtramite) => {
       return commons.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicio (id_region, rut_representante,rut_solicitante,idtramite) 
    },
         //psalas
    getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses:  (id_region, rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorPersonaParaTramiteInscripcionServicio (id_region, rut_solicitante,idtramite) 
            
    },
       //psalas persona-mandatario
       getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioBuses:  (id_region, RUT_RESPONSABLE,rut_solicitante,idtramite) => {
        return commons.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicio (id_region,RUT_RESPONSABLE, rut_solicitante,idtramite) 
            
    },
  
    //por rmason
    getServiciosVigentesInscritosPorRutResponsable: (rut_responsable) => {
        return commons.getServiciosVigentesInscritosPorRutResponsable(rut_responsable, config.rntTipoServicioMap.buses.IdsTiposServicios)
    },
    //por rmason
    getServiciosVigentesInscritosPorRutResponsableAndRutMandatario: (rut_responsable, rut_mandatario) => {
        return commons.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario(rut_responsable, rut_mandatario, config.rntTipoServicioMap.buses.IdsTiposServicios)
    },
    findServiciosByRepresentanteLegalAndEmpresa: (rut_empresa, rut_representante_legal) => {
        return commons.findServiciosByRepresentanteLegalAndEmpresaAndTipoServicioList(rut_empresa, rut_representante_legal, config.rntTipoServicioMap.buses.IdsTiposServicios)
    },
    findRecorridosByFolioRegion: (folio, region) => {
        return commons.findRecorridosByFolioRegionAndTipoServicio(folio,region,config.rntTipoServicioMap.buses.IdsTiposServicios)
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresa: (rut_empresa, rut_representante, rut_solicitante) => {
        return commons.findServiciosByMandatarioAndRepresentanteAndEmpresaAndTiposServicios(rut_empresa, rut_representante, rut_solicitante, config.rntTipoServicioMap.buses.IdsTiposServicios)
    },
    findInscripcionRNTData: (folio, region, ppu, tipoVehiculoSrcei) => {
        let vehiculoExiste = commons.checkVehiculoByPPU(ppu).length > 0 ? true : false
        let response
        if(vehiculoExiste) {
            //diseñar response con tipos de cancelacion
            //buscar info de vehiculo:
            let infoRNT = commons.findInfoVehiculoParaInscripcion(ppu)
            response = {
                estado: infoRNT.ESTADO,
                tipoCancelacion: infoRNT.TIPO_CANCELACION,
                regionOrigen: infoRNT.CODIGO_REGION,
                antiguedadMaxima: undefined,//no se puede obtener por la PPU, s edebe agregar posterior
                lstTipoVehiculoPermitidos: [],
                categoria: infoRNT.CATEGORIA
            }
            
        }
        else {
            //diseñar response con vehiculo no encontrado
            response = {
                estado: '0',
                tipoCancelacion: undefined,
                regionOrigen: undefined,
                antiguedadMaxima: undefined,
                lstTipoVehiculoPermitidos: [],
                categoria: undefined
            }
        }
        //buscar antiguedad maxima para la norma del folio region tv
        response.antiguedadMaxima = commons.findAntiguedadMaximaByTipoVehiculo(tipoVehiculoSrcei)
        response.lstTipoVehiculoPermitidos = commons.findLstTipoVehiculoPermitidoByFolioRegion(folio, region)
        return response
    }
}
