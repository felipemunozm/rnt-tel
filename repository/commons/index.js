const ibmdb = require('../db')
const log = require('../../log')

module.exports = {
    findServiciosByRepresentanteLegalAndEmpresaAndTipoServicioList: (rut_empresa, rut_representante, lstTiposServicios) => {
        return ibmdb.query('SELECT pNatural.RUT AS "RUT_REPRESENTANTE", pJuridica.RUT AS "RUT_RESPONSABLE",pjuridica.NOMBRE AS NOMBRE_RESPONSABLE, s.IDENT_SERVICIO AS "FOLIO", s.CODIGO_REGION AS COD_REGION,r.NOMBRE as "REGION",  tvs.NOMBRE ||\' \'|| tsa.NOMBRE ||\' \'|| mo.NOMBRE  as tiposervicio ' +
        'FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID ' +
        'INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2 ' +
        'INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = sr.ID_REPRESENTANTE_SERVICIO AND pNatural.TIPO_PERSONA = 1 ' +
        'LEFT JOIN NULLID.rnt_modalidad mo ON mo.id = ts.id_modalidad ' +
        'LEFT JOIN NULLID.rnt_categoria_transporte ct ON ct.id = ts.id_categoria_transporte ' +
        'LEFT JOIN NULLID.rnt_medio_transporte mt ON mt.id = ts.id_medio_transporte ' +
        'LEFT JOIN NULLID.rnt_tipo_transporte tt ON tt.id = ts.id_tipo_transporte ' +
        'LEFT JOIN NULLID.rnt_tipo_vehiculo_servicio tvs ON tvs.id = ts.id_tipo_vehiculo_servicio ' +
        'LEFT JOIN NULLID.rnt_tipo_servicio_area tsa ON ts.id_tipo_servicio_area = tsa.id ' +
        'INNER JOIN NULLID.UTILSQA_REGION r ON r.ID = s.CODIGO_REGION ' +
        'WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND s.ACTIVO = 1 AND ts.id in (' + lstTiposServicios.toString() + ')', [rut_empresa, rut_representante])
    },
    findRecorridosByFolioRegionAndTipoServicio: (folio,region, lstTipoServicios) => {
        return ibmdb.query('SELECT r.NOMBRE AS NOMBRE_RECORRIDO, p.nombre AS ORIGEN, c.NOMBRE AS COMUNA_ORIGEN, p2.NOMBRE AS DESTINO, c2.NOMBRE AS COMUNA_DESTINO ' +
        'FROM NULLID.rnt_servicio s INNER JOIN NULLID.rnt_tipo_servicio ts ON ts.id = s.id_tipo_servicio ' +
        'LEFT JOIN NULLID.rnt_modalidad mo ON mo.id = ts.id_modalidad ' +
        'LEFT JOIN NULLID.rnt_categoria_transporte ct ON ct.id = ts.id_categoria_transporte ' +
        'LEFT JOIN NULLID.rnt_medio_transporte mt ON mt.id = ts.id_medio_transporte ' +
        'LEFT JOIN NULLID.rnt_tipo_transporte tt ON tt.id = ts.id_tipo_transporte ' +
        'LEFT JOIN NULLID.rnt_tipo_vehiculo_servicio tvs ON tvs.id = ts.id_tipo_vehiculo_servicio ' +
        'LEFT JOIN NULLID.rnt_tipo_servicio_area tsa ON ts.id_tipo_servicio_area = tsa.id ' +
        'INNER JOIN NULLID.rnt_recorrido r ON s.id = r.id_servicio ' +
        'INNER JOIN NULLID.rnt_trazado t ON t.id_recorrido = r.id ' +
        'LEFT JOIN NULLID.rnt_extremo_recorrido er ON er.id = r.id_origen ' +
        'INNER JOIN NULLID.rnt_paradero p ON p.id = er.id_paradero ' +
        'LEFT JOIN NULLID.UTILSQA_COMUNA c ON c.id = p.codigo_comuna ' +
        'LEFT JOIN NULLID.rnt_extremo_recorrido er2 ON er2.id = r.id_destino ' +
        'INNER JOIN NULLID.rnt_paradero p2 ON p2.id = er2.id_paradero ' +
        'LEFT JOIN NULLID.UTILSQA_COMUNA c2 ON c2.id = p2.codigo_comuna ' +
        'WHERE s.IDENT_SERVICIO = ? AND s.CODIGO_REGION = ? AND s.ACTIVO = 1 AND r.ESTADO = 1 AND ts.id IN (' + lstTipoServicios.toString() +')',[folio,region])
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresaAndTiposServicios: (rut_empresa, rut_representante, rut_solicitante, lstTipoServicios) => {
        return ibmdb.query('SELECT pNatural.RUT AS "RUT_REPRESENTANTE", pJuridica.RUT AS "RUT_RESPONSABLE",pjuridica.NOMBRE AS NOMBRE_RESPONSABLE, MANDATARIOPERSONA.RUT AS "RUT_MANDATARIO", s.IDENT_SERVICIO AS "FOLIO", r.NOMBRE AS "REGION", s.codigo_region as COD_REGION  ' +
        'FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID ' +
        'INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID ' +
        'INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2  ' +
        'INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID  ' +
        'INNER JOIN nullid.RNT_REPRESENTATE_LEGAL rl ON rl.id = sr.ID_REPRESENTANTE_SERVICIO  ' +
        'INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = rl.ID_PERSONA AND pNatural.TIPO_PERSONA = 1  ' +
        'INNER JOIN NULLID.RNT_REPRESENTANTE_LEGAL_MANDATARIO rlm ON rlm.ID_REPRESENTANTE_LEGAL = rl.ID ' +
        'INNER JOIN NULLID.RNT_MANDATARIO man ON man.id = rlm.ID_MANDATARIO ' +
        'INNER JOIN nullid.RNT_PERSONA mandatarioPersona ON MANDATARIOPERSONA.id = man.ID_PERSONA ' +
        'LEFT JOIN NULLID.RNT_MODALIDAD mod ON mod.ID = ts.ID_MODALIDAD ' +
        'LEFT JOIN NULLID.RNT_CATEGORIA_TRANSPORTE ct ON ct.ID = ts.ID_CATEGORIA_TRANSPORTE ' +
        'LEFT JOIN NULLID.RNT_MEDIO_TRANSPORTE mt ON mt.ID = ts.ID_MEDIO_TRANSPORTE ' +
        'LEFT JOIN NULLID.RNT_TIPO_TRANSPORTE tt ON tt.ID = ts.ID_TIPO_TRANSPORTE ' +
        'LEFT JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO tvs ON tvs.ID = ts.ID_TIPO_VEHICULO_SERVICIO ' +
        'LEFT JOIN NULLID.RNT_TIPO_SERVICIO_AREA tsa ON ts.ID_tipo_servicio_area = tsa.ID ' +
        'INNER JOIN NULLID.UTILSQA_REGION r ON r.ID = s.CODIGO_REGION ' +
        'WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND MANDATARIOPERSONA.RUT = ? AND s.ACTIVO = 1 AND ts.id in (' + lstTipoServicios.toString() + ')', [rut_empresa, rut_representante, rut_solicitante])
    },
    getServiciosVigentesInscritosPorRutResponsable: (rut_responsable,lstTipoServicios) =>{
        return ibmdb.query("SELECT REGION.ID ID_REGION, REGION.NOMBRE REGION, T_VEHICULO_SERV.NOMBRE || ' ' || MODALIDAD.NOMBRE || ' ' || T_SERV_AREA.NOMBRE, VISTA.IDENT_SERVICIO FOLIO, RESPONSABLE.NOMBRE " +
        "FROM NULLID.RNT_SERVICIO AS VISTA " +
		"INNER JOIN NULLID.RNT_TIPO_SERVICIO AS T_SERV ON T_SERV.ID = VISTA.ID_TIPO_SERVICIO " +
		"INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE SR ON VISTA.ID = SR.ID_SERVICIO " +
		"INNER JOIN NULLID.RNT_REPRESENTATE_LEGAL AS RL ON SR.ID_REPRESENTANTE_SERVICIO = RL.ID " +
        "INNER JOIN NULLID.RNT_PERSONA AS RESPONSABLE ON RESPONSABLE.ID = RL.ID_PERSONA " +
        "INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO AS RS ON RS.ID_PERSONA = RESPONSABLE.ID " +
		"LEFT JOIN NULLID.RNT_MODALIDAD AS MODALIDAD ON MODALIDAD.ID = T_SERV.ID_MODALIDAD " +
		"LEFT JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO AS T_VEHICULO_SERV ON T_VEHICULO_SERV.ID = T_SERV.ID_TIPO_VEHICULO_SERVICIO " +
		"LEFT JOIN NULLID.RNT_TIPO_SERVICIO_AREA AS T_SERV_AREA ON T_SERV.ID_TIPO_SERVICIO_AREA = T_SERV_AREA.ID " +
        "LEFT JOIN NULLID.UTILSQA_REGION AS REGION ON REGION.ID = VISTA.CODIGO_REGION " +
        "WHERE RESPONSABLE.RUT = ? AND VISTA.ACTIVO = 1 AND RESPONSABLE.TIPO_PERSONA = 1 AND T_SERV.ID IN (" + lstTipoServicios.toString() + ")",[rut_responsable])
    },
    getServiciosVigentesInscritosPorRutResponsableAndRutMandatario: (rut_responsable, rut_mandatario, lstTipoServicios) =>{
        return ibmdb.query("SELECT REGION.ID ID_REGION, REGION.NOMBRE REGION, T_VEHICULO_SERV.NOMBRE || ' ' || MODALIDAD.NOMBRE || ' ' || T_SERV_AREA.NOMBRE, VISTA.IDENT_SERVICIO FOLIO, PERSONA.NOMBRE " +
        "FROM NULLID.RNT_SERVICIO AS VISTA " +
		"INNER JOIN NULLID.RNT_TIPO_SERVICIO AS T_SERV ON T_SERV.ID = VISTA.ID_TIPO_SERVICIO " +
		"INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE SR ON VISTA.ID = SR.ID_SERVICIO " +
		"INNER JOIN NULLID.RNT_REPRESENTATE_LEGAL AS RL ON SR.ID_REPRESENTANTE_SERVICIO = RL.ID " +
		"INNER JOIN NULLID.RNT_PERSONA AS PERSONA ON PERSONA.ID = RL.ID_PERSONA " +
		"LEFT JOIN NULLID.RNT_MODALIDAD AS MODALIDAD ON MODALIDAD.ID = T_SERV.ID_MODALIDAD " +
		"LEFT JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO AS T_VEHICULO_SERV ON T_VEHICULO_SERV.ID = T_SERV.ID_TIPO_VEHICULO_SERVICIO " +
		"LEFT JOIN NULLID.RNT_TIPO_CONTRATO AS TIPO_CONTRATO ON TIPO_CONTRATO.ID = VISTA.ID_TIPO_CONTRATO " +
		"LEFT JOIN NULLID.RNT_TIPO_REPRESENTANTE TR ON TR.ID = RL.ID_TIPO_REPRESENTANTE_LEGAL " +
		"LEFT JOIN NULLID.RNT_TIPO_SERVICIO_AREA AS T_SERV_AREA ON T_SERV.ID_TIPO_SERVICIO_AREA = T_SERV_AREA.ID " +
        "LEFT JOIN NULLID.UTILSQA_REGION AS REGION ON REGION.ID = VISTA.CODIGO_REGION " +
        "WHERE PERSONA.RUT = ? AND VISTA.ACTIVO = 1 AND T_SERV.ID IN (" + lstTipoServicios.toString() + ")",[rut_responsable, rut_mandatario])
    }
}