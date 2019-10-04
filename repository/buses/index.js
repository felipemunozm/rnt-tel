const ibmdb = require("../db")
const commons = require('../commons')
const log = require('../../log')
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
        return commons.findRepresentanteLegalByEmpresaAndTipoServicioList(rut_empresa, rut_representante_legal, [2,3,5,7,9,11,12,13,14,15,16,17,18,26])
    },
    getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses:  (id_region, rut_solicitante) => {
        log.debug(id_region)
        log.debug(rut_solicitante)
        
        return  ibmdb.query("select   per.RUT, per.NOMBRE,aut.CODIGO_REGION ,tram.NOMBRE AS NOMBRE_TRAMITE FROM tel.TEL_PERSONA per INNER JOIN  tel.TEL_RESPONSABLE resp  ON resp.ID_PERSONA = per.ID   " +
        "and  per.TIPO_PERSONA_ID = 1  " +
        "INNER JOIN tel.TEL_RESPONSABLE_AUTORIZACION resp_aut  ON resp_aut.ID_RESPONSABLE = resp.ID   " +
        "INNER JOIN tel.TEL_AUTORIZACION aut  ON aut.id  = RESP_AUT.ID_AUTORIZACION   and aut.TIPO_AUTORIZACION =1 " +
        "INNER JOIN tel.TEL_AUTORIZACION_TRAMITE autt          ON autt.ID_AUTORIZACION     = aut.ID   " +
        "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = 1   " +
        "and tram.ID= autt.ID_TRAMITE  "  +
        "WHERE     aut.CODIGO_REGION   = ?  and   per.RUT = ?", [id_region, rut_solicitante])
    },
    getAutorizadoPorMandatarioParaTramiteInscripcionServicioBuses:  (id_region, rut_solicitante) => {
        log.debug(id_region)
        log.debug(rut_solicitante)
        
        return  ibmdb.query("select   per.RUT, per.NOMBRE,aut.CODIGO_REGION FROM tel.TEL_PERSONA per INNER JOIN  tel.TEL_RESPONSABLE resp  ON resp.ID_PERSONA = per.ID   " +
        "and  per.TIPO_PERSONA_ID = 1  " +
        "INNER JOIN tel.TEL_RESPONSABLE_AUTORIZACION resp_aut  ON resp_aut.ID_RESPONSABLE = resp.ID   " +
        "INNER JOIN tel.TEL_AUTORIZACION aut  ON aut.id  = RESP_AUT.ID_AUTORIZACION   and aut.TIPO_AUTORIZACION =1 " +
        "INNER JOIN tel.TEL_AUTORIZACION_TRAMITE autt          ON autt.ID_AUTORIZACION     = aut.ID   " +
        "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = 1   " +
        "and tram.ID= autt.ID_TRAMITE  "  +
        "WHERE     aut.CODIGO_REGION   = ?  and   per.RUT = ?", [id_region, rut_solicitante])
    },
    //por fpavez
    getautorizacionPorRegionAndRutRepresentanteAndRutSolicitanteBuses: (region, rut_representante, rut_solicitante) => {
        return ibmdb.query("SELECT distinct(per2.RUT) AS RUT_PERSONA, per2.NOMBRE AS NOMBRE_PERSONA, per.RUT AS RUT_EMPRESA, per.NOMBRE AS NOMBRE_EMPRESA, tram.NOMBRE AS NOMBRE_TRAMITE " +
        "FROM tel.TEL_RESPONSABLE resp INNER JOIN tel.TEL_RESPONSABLE_AUTORIZACION resp_aut ON resp_aut.ID_RESPONSABLE = resp.ID " +
        "INNER JOIN tel.TEL_PERSONA per ON per.ID = resp.ID_PERSONA AND per.TIPO_PERSONA_ID = 2 " +
        "INNER JOIN tel.TEL_AUTORIZACION aut ON aut.id = RESP_AUT.ID_AUTORIZACION " +
        "INNER JOIN tel.TEL_PERSONA per2 ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
        "INNER JOIN NULLID.RNT_CATEGORIA_TRANSPORTE cat ON cat.id = aut.ID_CATEGORIA " +
        "INNER JOIN nullid.RNT_TIPO_SERVICIO ts ON ts.id = aut.ID_TIPO_SERVICIO " +
        "INNER JOIN NULLID.RNT_TIPO_SERVICIO_AREA tsa ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
        "INNER JOIN NULLID.RNT_TRAMITE tram ON tram.id = 1 " +
        "WHERE per.RUT = ? AND per2.RUT = ?",[region, rut_representante, rut_solicitante])
    },
    //por rmason
    getServiciosVigentesInscritosPorRutResponsable: (rut_responsable) => {
        return commons.getServiciosVigentesInscritosPorRutResponsable(rut_responsable, [2,3,5,7,9,11,12,13,14,15,16,17,18,26])
    },
    findServiciosByRepresentanteLegalAndEmpresa: (rut_empresa, rut_representante_legal) => {
        return commons.findServiciosByRepresentanteLegalAndEmpresaAndTipoServicioList(rut_empresa, rut_representante_legal, [2,3,5,7,9,11,12,13,14,15,16,17,18,26])
    },
    findRecorridosByFolioRegion: (folio, region) => {
        return commons.findRecorridosByFolioRegionAndTipoServicio(folio,region,[2,3,5,7,9,11,12,13,14,15,16,17,18,26])
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresa: (rut_empresa, rut_representante, rut_solicitante) => {
        return commons.findServiciosByMandatarioAndRepresentanteAndEmpresaAndTiposServicios(rut_empresa, rut_representante, rut_solicitante, [2,3,5,7,9,11,12,13,14,15,16,17,18,26])
    }
}
