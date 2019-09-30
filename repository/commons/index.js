const ibmdb = require('../db')
const log = require('../../log')

module.exports = {
    findRepresentanteLegalByEmpresaAndTipoServicioList: (rut_empresa, rut_representante, lstTiposServicios) => {
        return ibmdb.query('SELECT pNatural.RUT AS "RUT_REPRESENTANTE", pJuridica.RUT AS "RUT_RESPONSABLE", s.IDENT_SERVICIO AS "FOLIO", s.CODIGO_REGION AS "REGION" ' +
        'FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID ' +
        'INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2 ' +
        'INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = sr.ID_REPRESENTANTE_SERVICIO AND pNatural.TIPO_PERSONA = 1 ' +
        'WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND s.ACTIVO = 1 AND ts.id in (' + lstTiposServicios.toString() + ')', [rut_empresa, rut_representante])
    }
}