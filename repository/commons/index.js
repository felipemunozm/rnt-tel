const ibmdb = require('../db')
const log = require('../../log')

module.exports = {
    findServiciosByRepresentanteLegalAndEmpresaAndTipoServicioList: (rut_empresa, rut_representante, lstTiposServicios) => {
        return ibmdb.query('SELECT pNatural.RUT AS "RUT_REPRESENTANTE", pJuridica.RUT AS "RUT_RESPONSABLE", s.IDENT_SERVICIO AS "FOLIO", s.CODIGO_REGION AS "REGION" ' +
        'FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID ' +
        'INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2 ' +
        'INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = sr.ID_REPRESENTANTE_SERVICIO AND pNatural.TIPO_PERSONA = 1 ' +
        'WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND s.ACTIVO = 1 AND ts.id in (' + lstTiposServicios.toString() + ')', [rut_empresa, rut_representante])
    },
    findRecorridosByFolioRegionAndTipoServicio: (folio,region, lstTipoServicios) => {
        return ibmdb.query('SELECT rec.NOMBRE AS "NOMBRE_RECORRIDO" ' + 
        'FROM NULLID.RNT_SERVICIO s INNER JOIN NULLID.RNT_RECORRIDO rec ON s.id = rec.ID_SERVICIO ' +
        'INNER JOIN NULLID.RNT_TIPO_SERVICIO ts ON s.ID_TIPO_SERVICIO = ts.ID ' +
        'WHERE s.IDENT_SERVICIO = ? AND s.CODIGO_REGION = ? AND s.ACTIVO = 1 AND rec.ESTADO = 1 AND ts.id IN (' + lstTipoServicios.toString() +')',[folio,region])
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresaAndTiposServicios: (rut_empresa, rut_representante, rut_solicitante, lstTipoServicios) => {
        return ibmdb.query('SELECT pNatural.RUT AS "RUT_REPRESENTANTE", pJuridica.RUT AS "RUT_RESPONSABLE", MANDATARIOPERSONA.RUT AS "RUT_MANDATARIO", s.IDENT_SERVICIO AS "FOLIO", s.CODIGO_REGION AS "REGION" ' +
        'FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID ' +
        'INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2 ' +
        'INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = sr.ID_REPRESENTANTE_SERVICIO AND pNatural.TIPO_PERSONA = 1 ' +
        'INNER JOIN NULLID.RNT_REPRESENTATE_LEGAL rl ON rl.id = sr.ID_REPRESENTANTE_SERVICIO ' +
        'INNER JOIN NULLID.RNT_REPRESENTANTE_LEGAL_MANDATARIO rlm ON rlm.ID_REPRESENTANTE_LEGAL = rl.ID ' +
        'INNER JOIN NULLID.RNT_MANDATARIO man ON man.id = rlm.ID_MANDATARIO ' + 
        'INNER JOIN nullid.RNT_PERSONA mandatarioPersona ON MANDATARIOPERSONA.id = man.ID_PERSONA ' +
        'WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND MANDATARIOPERSONA.RUT = ? AND s.ACTIVO = 1 AND ts.id in (' + lstTipoServicios.toString() + ')', [rut_empresa, rut_representante, rut_solicitante])
    }
}