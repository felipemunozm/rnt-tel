const ibmdb = require('../db')
const log = require('../../log')
const config = require('../../config')

let nombreUTILS = 'UTILSQA'
//let nombreUTILS = 'UTILSPR'

module.exports = {
    findServiciosByRepresentanteLegalAndEmpresaAndTipoServicioList: (rut_empresa, rut_representante, lstTiposServicios) => {
       
       let query='SELECT pNatural.RUT AS "RUT_REPRESENTANTE", pJuridica.RUT AS "RUT_RESPONSABLE",pjuridica.NOMBRE AS NOMBRE_RESPONSABLE, s.IDENT_SERVICIO AS "FOLIO", s.CODIGO_REGION AS COD_REGION,r.NOMBRE as "REGION",  tvs.NOMBRE ||\' \'|| tsa.NOMBRE ||\' \'|| mo.NOMBRE  as TIPO_SERVICIO ' +
       'FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID ' +
       'INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID ' +
       'INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2 ' +
       'INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID ' +
       'INNER JOIN nullid.RNT_REPRESENTATE_LEGAL rl ON rl.id = sr.ID_REPRESENTANTE_SERVICIO  ' +
       'INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = rl.ID_PERSONA AND pNatural.TIPO_PERSONA = 1  ' +
       'LEFT JOIN NULLID.rnt_modalidad mo ON mo.id = ts.id_modalidad ' +
       'LEFT JOIN NULLID.rnt_categoria_transporte ct ON ct.id = ts.id_categoria_transporte ' +
       'LEFT JOIN NULLID.rnt_medio_transporte mt ON mt.id = ts.id_medio_transporte ' +
       'LEFT JOIN NULLID.rnt_tipo_transporte tt ON tt.id = ts.id_tipo_transporte ' +
       'LEFT JOIN NULLID.rnt_tipo_vehiculo_servicio tvs ON tvs.id = ts.id_tipo_vehiculo_servicio ' +
       'LEFT JOIN NULLID.rnt_tipo_servicio_area tsa ON ts.id_tipo_servicio_area = tsa.id ' +
       'INNER JOIN NULLID.' + nombreUTILS + '_REGION r ON r.ID = s.CODIGO_REGION ' +
       'WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND s.ESTADO = 1 AND rl.AUTORIZADO_TRAMITES = 1 AND ts.id in (' + lstTiposServicios.toString() + ')'
       return ibmdb.query(query, [rut_empresa, rut_representante])
        // return ibmdb.query('SELECT pNatural.RUT AS "RUT_REPRESENTANTE", pJuridica.RUT AS "RUT_RESPONSABLE",pjuridica.NOMBRE AS NOMBRE_RESPONSABLE, s.IDENT_SERVICIO AS "FOLIO", s.CODIGO_REGION AS COD_REGION,r.NOMBRE as "REGION",  tvs.NOMBRE ||\' \'|| tsa.NOMBRE ||\' \'|| mo.NOMBRE  as TIPO_SERVICIO ' +
        // 'FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID ' +
        // 'INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID ' +
        // 'INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2 ' +
        // 'INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID ' +
        // 'INNER JOIN nullid.RNT_REPRESENTATE_LEGAL rl ON rl.id = sr.ID_REPRESENTANTE_SERVICIO  ' +
        // 'INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = rl.ID_PERSONA AND pNatural.TIPO_PERSONA = 1  ' +
        // 'LEFT JOIN NULLID.rnt_modalidad mo ON mo.id = ts.id_modalidad ' +
        // 'LEFT JOIN NULLID.rnt_categoria_transporte ct ON ct.id = ts.id_categoria_transporte ' +
        // 'LEFT JOIN NULLID.rnt_medio_transporte mt ON mt.id = ts.id_medio_transporte ' +
        // 'LEFT JOIN NULLID.rnt_tipo_transporte tt ON tt.id = ts.id_tipo_transporte ' +
        // 'LEFT JOIN NULLID.rnt_tipo_vehiculo_servicio tvs ON tvs.id = ts.id_tipo_vehiculo_servicio ' +
        // 'LEFT JOIN NULLID.rnt_tipo_servicio_area tsa ON ts.id_tipo_servicio_area = tsa.id ' +
        // 'INNER JOIN NULLID.' + nombreUTILS + '_REGION r ON r.ID = s.CODIGO_REGION ' +
        // 'WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND s.ESTADO = 1 AND rl.AUTORIZADO_TRAMITES = 1 AND ts.id in (' + lstTiposServicios.toString() + ')', [rut_empresa, rut_representante])
    },
    findRecorridosByFolioRegionAndTipoServicio: (folio,region, lstTipoServicios) => {
        return ibmdb.query('SELECT RECORRIDO.NOMBRE AS NOMBRE_RECORRIDO, PARADERO_ORIGEN.NOMBRE AS ORIGEN, COMUNA.NOMBRE AS COMUNA_ORIGEN, PARADERO_DESTINO.NOMBRE AS DESTINO, COMUNA_DESTINO.NOMBRE AS COMUNA_DESTINO ' +
        'FROM NULLID.RNT_SERVICIO AS SERVICIO ' +
        'INNER JOIN NULLID.RNT_TIPO_SERVICIO AS TIPO_SERV ON TIPO_SERV.ID = SERVICIO.ID_TIPO_SERVICIO ' +
        'LEFT JOIN NULLID.RNT_MODALIDAD AS MODALIDAD ON MODALIDAD.ID = TIPO_SERV.ID_MODALIDAD ' +
        'LEFT JOIN NULLID.RNT_CATEGORIA_TRANSPORTE AS CAT_TRANSPORTE ON CAT_TRANSPORTE.ID = TIPO_SERV.ID_CATEGORIA_TRANSPORTE ' +
        'LEFT JOIN NULLID.RNT_MEDIO_TRANSPORTE AS MEDIO_TRANS ON MEDIO_TRANS.ID = TIPO_SERV.ID_MEDIO_TRANSPORTE ' +
        'LEFT JOIN NULLID.RNT_TIPO_TRANSPORTE AS TIPO_TRANS ON TIPO_TRANS.ID = TIPO_SERV.ID_TIPO_TRANSPORTE ' +
        'LEFT JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO AS TIPO_VEH_SERV ON TIPO_VEH_SERV.ID = TIPO_SERV.ID_TIPO_VEHICULO_SERVICIO ' +
        'LEFT JOIN NULLID.RNT_TIPO_SERVICIO_AREA AS TIPO_SERV_AREA ON TIPO_SERV.ID_TIPO_SERVICIO_AREA = TIPO_SERV_AREA.ID ' +
        'INNER JOIN NULLID.RNT_RECORRIDO AS RECORRIDO ON SERVICIO.ID = RECORRIDO.ID_SERVICIO ' +
        'INNER JOIN NULLID.RNT_TRAZADO AS TRAZADO ON TRAZADO.ID_RECORRIDO = RECORRIDO.ID ' +
        'LEFT JOIN NULLID.RNT_EXTREMO_RECORRIDO AS EXTREMO_RECORRIDO ON EXTREMO_RECORRIDO.ID = RECORRIDO.ID_ORIGEN ' +
        'INNER JOIN NULLID.RNT_PARADERO AS PARADERO_ORIGEN ON PARADERO_ORIGEN.ID = EXTREMO_RECORRIDO.ID_PARADERO ' +
        'LEFT JOIN NULLID.' + nombreUTILS + '_COMUNA AS COMUNA ON COMUNA.ID = PARADERO_ORIGEN.CODIGO_COMUNA ' +
        'LEFT JOIN NULLID.RNT_EXTREMO_RECORRIDO AS EXTREMO_RECORRIDO_1 ON EXTREMO_RECORRIDO_1.ID = RECORRIDO.ID_DESTINO ' +
        'INNER JOIN NULLID.RNT_PARADERO AS PARADERO_DESTINO ON PARADERO_DESTINO.ID = EXTREMO_RECORRIDO_1.ID_PARADERO ' +
        'LEFT JOIN NULLID.' + nombreUTILS + '_COMUNA AS COMUNA_DESTINO ON COMUNA_DESTINO.ID = PARADERO_DESTINO.CODIGO_COMUNA ' +
        'WHERE SERVICIO.IDENT_SERVICIO = ? AND SERVICIO.CODIGO_REGION = ? AND SERVICIO.ESTADO = 1 AND RECORRIDO.ESTADO = 1 AND TIPO_SERV.ID IN (' + lstTipoServicios.toString() +')',[folio,region])
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresaAndTiposServicios: (rut_empresa, rut_representante, rut_solicitante, lstTipoServicios) => {
        return ibmdb.query("SELECT pNatural.RUT AS RUT_REPRESENTANTE, tvs.NOMBRE || ' ' || tsa.NOMBRE || ' ' || mod.NOMBRE AS TIPO_SERVICIO, pJuridica.RUT AS RUT_RESPONSABLE ,pjuridica.NOMBRE AS NOMBRE_RESPONSABLE, MANDATARIOPERSONA.RUT AS RUT_MANDATARIO, s.IDENT_SERVICIO AS FOLIO, r.NOMBRE AS REGION, s.codigo_region as COD_REGION  " +
        "FROM NULLID.RNT_TIPO_SERVICIO ts INNER JOIN NULLID.RNT_SERVICIO s ON s.ID_TIPO_SERVICIO = ts.ID " +
        "INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO rs ON s.ID_RESPONSABLE_SERVICIO = rs.ID " +
        "INNER JOIN NULLID.RNT_PERSONA pJuridica ON pJuridica.id = rs.ID_PERSONA AND PJURIDICA.TIPO_PERSONA = 2  " +
        "INNER JOIN NULLID.RNT_SERVICIO_REPRESENTANTE sr ON sr.ID_SERVICIO = s.ID  " +
        "INNER JOIN nullid.RNT_REPRESENTATE_LEGAL rl ON rl.id = sr.ID_REPRESENTANTE_SERVICIO  " +
        "INNER JOIN NULLID.RNT_PERSONA pNatural ON PNATURAL.id = rl.ID_PERSONA AND pNatural.TIPO_PERSONA = 1  " +
        "INNER JOIN NULLID.RNT_REPRESENTANTE_LEGAL_MANDATARIO rlm ON rlm.ID_REPRESENTANTE_LEGAL = rl.ID " +
        "INNER JOIN NULLID.RNT_MANDATARIO man ON man.id = rlm.ID_MANDATARIO " +
        "INNER JOIN nullid.RNT_PERSONA mandatarioPersona ON MANDATARIOPERSONA.id = man.ID_PERSONA " +
        "LEFT JOIN NULLID.RNT_MODALIDAD mod ON mod.ID = ts.ID_MODALIDAD " +
        "LEFT JOIN NULLID.RNT_CATEGORIA_TRANSPORTE ct ON ct.ID = ts.ID_CATEGORIA_TRANSPORTE " +
        "LEFT JOIN NULLID.RNT_MEDIO_TRANSPORTE mt ON mt.ID = ts.ID_MEDIO_TRANSPORTE " +
        "LEFT JOIN NULLID.RNT_TIPO_TRANSPORTE tt ON tt.ID = ts.ID_TIPO_TRANSPORTE " +
        "LEFT JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO tvs ON tvs.ID = ts.ID_TIPO_VEHICULO_SERVICIO " +
        "LEFT JOIN NULLID.RNT_TIPO_SERVICIO_AREA tsa ON ts.ID_tipo_servicio_area = tsa.ID " +
        "INNER JOIN NULLID." + nombreUTILS + "_REGION r ON r.ID = s.CODIGO_REGION " +
        "WHERE PJURIDICA.RUT = ? AND PNATURAL.RUT = ? AND MANDATARIOPERSONA.RUT = ? AND man.AUTORIZADO_TRAMITES = 1 AND s.ESTADO = 1 AND ts.id in (" + lstTipoServicios.toString() + ")", [rut_empresa, rut_representante, rut_solicitante])
    },
    getServiciosVigentesInscritosPorRutResponsable: (rut_responsable,lstTipoServicios) =>{
        return ibmdb.query("SELECT DISTINCT REGION.ID AS ID_REGION, REGION.NOMBRE AS REGION, T_VEHICULO_SERV.NOMBRE || ' ' || T_SERV_AREA.NOMBRE || ' ' || MODALIDAD.NOMBRE AS TIPO_SERVICIO, SERVICIO.IDENT_SERVICIO AS FOLIO, RESPONSABLE.NOMBRE AS NOMBRE_RESPONSABLE, RESPONSABLE.RUT AS RUT_RESPONSABLE ,T_SERV.ID as ID_TIPO_SERVICIO " +
        "FROM NULLID.RNT_SERVICIO AS SERVICIO " +
		"INNER JOIN NULLID.RNT_TIPO_SERVICIO AS T_SERV ON T_SERV.ID = SERVICIO.ID_TIPO_SERVICIO " +
        "INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO AS RS ON RS.ID = SERVICIO.ID_RESPONSABLE_SERVICIO " +
        "INNER JOIN NULLID.RNT_PERSONA AS RESPONSABLE ON RESPONSABLE.ID = RS.ID_PERSONA " +
		"LEFT JOIN NULLID.RNT_MODALIDAD AS MODALIDAD ON MODALIDAD.ID = T_SERV.ID_MODALIDAD " +
		"LEFT JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO AS T_VEHICULO_SERV ON T_VEHICULO_SERV.ID = T_SERV.ID_TIPO_VEHICULO_SERVICIO " +
		"LEFT JOIN NULLID.RNT_TIPO_SERVICIO_AREA AS T_SERV_AREA ON T_SERV.ID_TIPO_SERVICIO_AREA = T_SERV_AREA.ID " +
        "LEFT JOIN NULLID." + nombreUTILS + "_REGION AS REGION ON REGION.ID = SERVICIO.CODIGO_REGION " +
        "WHERE RESPONSABLE.RUT = ? AND SERVICIO.ESTADO = 1 AND RESPONSABLE.TIPO_PERSONA = 1 AND T_SERV.ID IN (" + lstTipoServicios.toString() + ")",[rut_responsable])
    },
    getServiciosVigentesInscritosPorRutResponsableAndRutMandatario: (rut_responsable, rut_mandatario, lstTipoServicios) =>{
        return ibmdb.query("SELECT DISTINCT REGION.ID AS ID_REGION, REGION.NOMBRE AS REGION, T_VEHICULO_SERV.NOMBRE || ' ' || T_SERV_AREA.NOMBRE || ' ' || MODALIDAD.NOMBRE AS TIPO_SERVICIO, SERVICIO.IDENT_SERVICIO AS FOLIO, RESPONSABLE.NOMBRE AS NOMBRE_RESPONSABLE, RESPONSABLE.RUT AS RUT_RESPONSABLE, MANDATARIO.RUT AS RUT_MANDATARIO, MAND.AUTORIZADO_TRAMITES AS AUTORIZADO " +
        "FROM NULLID.RNT_SERVICIO AS SERVICIO " +
        "INNER JOIN NULLID.RNT_TIPO_SERVICIO AS T_SERV ON T_SERV.ID = SERVICIO.ID_TIPO_SERVICIO " +     
		"INNER JOIN NULLID.RNT_RESPONSABLE_SERVICIO AS RS ON RS.ID = SERVICIO.ID_RESPONSABLE_SERVICIO " +
        "INNER JOIN NULLID.RNT_PERSONA AS RESPONSABLE ON RESPONSABLE.ID = RS.ID_PERSONA " +
        "INNER JOIN NULLID.RNT_SERVICIO_MANDATARIO AS SERV_MAND ON SERV_MAND.ID_SERVICIO = SERVICIO.ID " +
		"LEFT JOIN NULLID.RNT_MANDATARIO AS MAND ON MAND.ID = SERV_MAND.ID_MANDATARIO " +
		"INNER JOIN NULLID.RNT_PERSONA AS MANDATARIO ON MANDATARIO.ID = MAND.ID_PERSONA " +
        "LEFT JOIN NULLID.RNT_MODALIDAD AS MODALIDAD ON MODALIDAD.ID = T_SERV.ID_MODALIDAD " +
        "LEFT JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO AS T_VEHICULO_SERV ON T_VEHICULO_SERV.ID = T_SERV.ID_TIPO_VEHICULO_SERVICIO " +
        "LEFT JOIN NULLID.RNT_TIPO_SERVICIO_AREA AS T_SERV_AREA ON T_SERV.ID_TIPO_SERVICIO_AREA = T_SERV_AREA.ID " +
        "LEFT JOIN NULLID." + nombreUTILS + "_REGION AS REGION ON REGION.ID = SERVICIO.CODIGO_REGION " +
        "WHERE RESPONSABLE.RUT = ? AND MANDATARIO.RUT = ? AND SERVICIO.ESTADO = 1 AND RESPONSABLE.TIPO_PERSONA = 1 AND MAND.AUTORIZADO_TRAMITES = 1 AND T_SERV.ID IN (" + lstTipoServicios.toString() + ")",[rut_responsable, rut_mandatario])
    },
           //psalas
           getAutorizadoPorPersonaParaTramiteInscripcionServicio:  (id_region, rut_solicitante,idtramite) => {
    
            log.debug(id_region)
            log.debug(rut_solicitante)
            //crear logica de respuesta
            //1 Empresa indicada no se encuentra habilitada para realizar tramites en linea
            //2 Usted no se encuentra habilitado para realizar este tramite en la empresa indicada
            //3 Usted no se encuentra habilitado para realizar este tramite en la region indicada
            //4 Usted no se encuentra habilitado para realizar este tramite en linea
            //5 Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitee correspondiente para actualizar su documentacion
    
            //1 Empresa indicada no se encuentra habilitada para realizar tramites en linea
            let query=" select sum(tot) as total from ( " +
                        "select count(*) as tot FROM   tel.TEL_PERSONA per 	 " +
                            "INNER JOIN   tel.TEL_RESPONSABLE resp  ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                            "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID   "  +
                            
                            "WHERE per.RUT = ? " +
                            "union    " +
                            "select count(*) as tot FROM   tel.TEL_PERSONA per  " +
                            "INNER JOIN    tel.TEL_AUTORIZACION aut                   ON aut.ID_PERSONA = per.id and per.TIPO_PERSONA_ID = 1 " +
                            "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   on RESP_AUT.ID_AUTORIZACION = aut.id  " +
                            "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID= resp_aut.ID_RESPONSABLE " +
                            "INNER JOIN   tel.TEL_PERSONA per2 					      ON  per2.id= resp.ID_PERSONA  AND per2.TIPO_PERSONA_ID = 1 " +
                            "WHERE per.RUT = ?  "  +
                        ") "

            let hab_empresa_tram =  ibmdb.query(query , [rut_solicitante,rut_solicitante])
             if  (hab_empresa_tram[0].TOTAL>0)
             {
                  //2 Usted no se encuentra habilitado para realizar este tramite en la empresa indicada
                  let query="select sum(tot) as total from (select count(*) as tot " + 
                  "FROM    tel.TEL_PERSONA per 	" +
                  "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                  "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                  "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION  " +
                  "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                  "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                //  "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE " +
                  "where  per.RUT = ? AND per2.RUT = ?  " +
                  "union    " +
                  "select count(*) as tot FROM   tel.TEL_PERSONA per  " +
                  "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.ID_PERSONA = per.id  and per.TIPO_PERSONA_ID = 1   " +
                  "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   on RESP_AUT.ID_AUTORIZACION = aut.id  " +
                  "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID= resp_aut.ID_RESPONSABLE " +
                  "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                  "INNER JOIN   tel.TEL_PERSONA per2 					    ON per2.id= resp.ID_PERSONA  AND per2.TIPO_PERSONA_ID = 1 " +
                 // "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE " +
                  "WHERE per.RUT =?  )" 

                let hab_persona_tram =  ibmdb.query(query,[rut_solicitante, rut_solicitante,rut_solicitante])
    
                if  (hab_persona_tram[0].TOTAL>0)
                {
                      //3 Usted no se encuentra habilitado para realizar este tramite en la region indicada
                      let query=" select sum(resul) as total from ( select CASE  " + id_region +
                            " WHEN aut.CODIGO_REGION THEN 1 " +
                            " else 0 END as resul "+
                            "FROM    tel.TEL_PERSONA per 	" +
                            "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                            "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                            "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                            "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                           // "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE " +
                            "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                            "where per.RUT = ? AND per2.RUT = ?  " +
                            "union    " +
                            "select CASE  " + id_region + " WHEN aut.CODIGO_REGION THEN 1  else 0 END as resul  " +
                            "FROM   tel.TEL_PERSONA per   " +
                            "INNER JOIN    tel.TEL_AUTORIZACION aut                   ON aut.ID_PERSONA = per.id   AND per.TIPO_PERSONA_ID = 1 and aut.AUTORIZADO =1 " +
                            "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   on RESP_AUT.ID_AUTORIZACION = aut.id    " +
                            "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID= resp_aut.ID_RESPONSABLE   " +
                            "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID    " +
                            "INNER JOIN   tel.TEL_PERSONA per2 					    ON per2.id= resp.ID_PERSONA  AND per2.TIPO_PERSONA_ID = 1 " +
                          //  "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = 22 and tram.ID= autt.ID_TRAMITE   " +
                            "WHERE per.RUT = ?  ) "
                        let hab_persona_region =  ibmdb.query( query,[rut_solicitante, rut_solicitante,rut_solicitante])
    
                          
                        if  (hab_persona_region[0].TOTAL>0)
                            {
                                //4 Usted no se encuentra habilitado para realizar este tramite en linea
                                let query="   select sum(tot) as total from ( select count(1) as tot  " +
                                "FROM    tel.TEL_PERSONA per 	" +
                                "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                                "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION  and aut.AUTORIZADO=1 " +
                                "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                                "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA " +
                                "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO " +
                                "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
                                "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO " +
                                "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD " +
                                "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE " +
                                "where aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  " +
                                "union    " +
                                "select count(1) as tot  " +
                                "FROM   tel.TEL_PERSONA per   " +
                                "INNER JOIN    tel.TEL_AUTORIZACION aut                   ON aut.ID_PERSONA = per.id and aut.AUTORIZADO =1 AND per.TIPO_PERSONA_ID = 1   " +
                                "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   on RESP_AUT.ID_AUTORIZACION = aut.id   " +
                                "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID= resp_aut.ID_RESPONSABLE  " +
                                "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID   " +
                               
                                "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA  " +
                                "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO  " +
                                "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id  " +
                                "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO  " +
                                "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD  " +
                                "INNER JOIN   tel.TEL_PERSONA per2 					    ON per2.id= resp.ID_PERSONA  AND per2.TIPO_PERSONA_ID = 1 " +
                                "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE " +
                                "WHERE per.RUT =? and aut.CODIGO_REGION   = ?)"

                                let hab_persona_tramite =  ibmdb.query( query,[id_region, rut_solicitante, rut_solicitante,rut_solicitante,id_region])
                                if  (hab_persona_tramite[0].TOTAL>0 ) 
                                {
                                    //5 Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitee correspondiente para actualizar su documentacion
                                    let query="select sum(tot) as total from ( select count(1) as tot " +
                                    "FROM    tel.TEL_PERSONA per 	" +
                                    "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                                    "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                    "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION and aut.AUTORIZADO=1 " +
                                    "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                    "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +                    
                                    "INNER JOIN NULLID.RNT_TRAMITE tram                      ON tram.id = "+ idtramite +  "   and tram.ID= autt.ID_TRAMITE " +
                                    "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                    "and   aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  " +
                                    "union    " +
                                    "select count(1) as tot  " +
                                    "FROM   tel.TEL_PERSONA per   " +
                                    "INNER JOIN    tel.TEL_AUTORIZACION aut                   ON aut.ID_PERSONA = per.id and aut.AUTORIZADO =1  AND per.TIPO_PERSONA_ID = 1 " +
                                    "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   on RESP_AUT.ID_AUTORIZACION = aut.id   " +
                                    "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID= resp_aut.ID_RESPONSABLE  " +
                                    "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID   " +
                                    "INNER JOIN   tel.TEL_PERSONA per2 					    ON per2.id= resp.ID_PERSONA  AND per2.TIPO_PERSONA_ID = 1 " +
                                    "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE  " +
                                    "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                    "and  per.RUT =? and aut.CODIGO_REGION   = ? )"
                                    let hab_persona_tramite =  ibmdb.query( query,[id_region, rut_solicitante, rut_solicitante,rut_solicitante,id_region])
                                    if  (hab_persona_tramite[0].TOTAL>0)
                                    {
                                        let queryfin="select  " +
                                        "aut.ID_CATEGORIA ," +
                                        "aut.ID_TIPO_SERVICIO ," +
                                        "cat.NOMBRE AS categoria," +
                                        "tsa.NOMBRE  AS tipo_servicio , " +
                                        "tsv.NOMBRE AS tipovehiculo  ," +
                                        "moda.NOMBRE as modalidad  ," +
                                        "tsa.NOMBRE ||' '|| tsv.NOMBRE ||' '|| moda.NOMBRE  as tiposervicio " +
                                        "FROM    tel.TEL_PERSONA per 	" +
                                        "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                                        "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                        "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION and aut.AUTORIZADO=1 " +
                                        "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                        "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                                        "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA " +
                                        "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO " +
                                        "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
                                        "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO " +
                                        "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD " +
                                        "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  "   and tram.ID= autt.ID_TRAMITE " +
                                        "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                        "and aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  " +
                                        "union    " +
                                        "select  aut.ID_CATEGORIA ," +
                                        "aut.ID_TIPO_SERVICIO ," +
                                        "cat.NOMBRE AS categoria," +
                                        "tsa.NOMBRE  AS tipo_servicio , " +
                                        "tsv.NOMBRE AS tipovehiculo  ," +
                                        "moda.NOMBRE as modalidad  ," +
                                        "tsa.NOMBRE ||' '|| tsv.NOMBRE ||' '|| moda.NOMBRE  as tiposervicio " +
                                        "FROM   tel.TEL_PERSONA per   " +
                                        "INNER JOIN    tel.TEL_AUTORIZACION aut                   ON aut.ID_PERSONA = per.id and aut.AUTORIZADO =1  AND per.TIPO_PERSONA_ID = 1 " +
                                        "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   on RESP_AUT.ID_AUTORIZACION = aut.id   " +
                                        "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID= resp_aut.ID_RESPONSABLE  " +
                                        "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID   " +
                                        "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA " +
                                        "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO " +
                                        "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
                                        "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO " +
                                        "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD " +
                                        "INNER JOIN   tel.TEL_PERSONA per2 					    ON per2.id= resp.ID_PERSONA  AND per2.TIPO_PERSONA_ID = 1 " +
                                        "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE  " +
                                        "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                        "and  per.RUT =? and aut.CODIGO_REGION   = ? "

                                        let tip_serv =  ibmdb.query( queryfin,[id_region, rut_solicitante, rut_solicitante,rut_solicitante,id_region])
                                        if  (tip_serv.length>0)
                                        {
                                            return tip_serv
                                        }
                                      
                                    }
                                    else
                                    {
                                        return  {mensaje:'Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitt correspondiente para actualizar su documentacion' ,estado:'RECHAZADO'}
                                        
                                    }
    
                                }
                                else
                                {
    
                                    return  {mensaje:'Usted no se encuentra Autorizado para realizar este tramite en linea' ,estado:'RECHAZADO'}
                                }
    
    
                            }
                            else
                            {        return  {mensaje:'Usted no se encuentra habilitado para realizar este tramite en la region indicada' ,estado:'RECHAZADO'}
                               
                            }
    
                }
                else
                {  return  {mensaje:'Usted no se encuentra habilitado para realizar este tramite como solicitante' ,estado:'RECHAZADO'}
                   
                }
    
               
             }  
             else
             {
    
                 return  {mensaje:'Solicitante del Servicio indicado no se encuentra habilitada para realizar tramites en linea' ,estado:'RECHAZADO'}
    
             }
    
          
        },
          //psalas persona-mandatario
          getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicio:  (id_region, rut_representante, rut_solicitante,idtramite) => {
    
            log.debug(id_region)
            log.debug(rut_representante)
            log.debug(rut_solicitante)
            //crear logica de respuesta
            //1 Empresa indicada no se encuentra habilitada para realizar tramites en linea
           
            let hab_empresa_tram =  ibmdb.query("select count(*) as total FROM   tel.TEL_PERSONA per 	 " +
                            "INNER JOIN   tel.TEL_RESPONSABLE resp  ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                           "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID   " +
                            "WHERE per.RUT = ?  " , [rut_representante])
             if  (hab_empresa_tram[0].TOTAL>0)
             {
                  //2 Usted no se encuentra habilitado para realizar este tramite en la empresa indicada
                let hab_persona_tram =  ibmdb.query("select count(*) as total " + 
                "FROM    tel.TEL_PERSONA per 	" +
                "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                "where  per.RUT = ? AND per2.RUT = ?  " ,[rut_representante, rut_solicitante])
    
                if  (hab_persona_tram[0].TOTAL>0)
                {
                      //3 Usted no se encuentra habilitado para realizar este tramite en la region indicada
                    
                    let query="select count(1) as RESUL " +
                             "FROM    tel.TEL_PERSONA per 	" +
                             "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                             "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                             "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                             "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                             "where per.RUT = ? AND per2.RUT = ?  and aut.codigo_region =? "
                        let hab_persona_region =  ibmdb.query( query,[rut_representante, rut_solicitante,id_region])
    
                          
                        if  (hab_persona_region[0].RESUL>0)
                            {
                                //4 Usted no se encuentra habilitado para realizar este tramite en linea
                                let query="select tram.id as id_tram " +
                                "FROM    tel.TEL_PERSONA per 	" +
                                "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                                "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION and aut.AUTORIZADO=1 " +
                                "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                                "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA " +
                                "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO " +
                                "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
                                "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO " +
                                "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD " +
                                "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = "+ idtramite +  "  and tram.ID= autt.ID_TRAMITE " +
                                "where aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  "
                                let hab_persona_tramite =  ibmdb.query( query,[id_region, rut_representante, rut_solicitante])
                                if  (hab_persona_tramite.length>0 ) 
                                {
                                    //5 Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitee correspondiente para actualizar su documentacion
                                    let query="select count(1) as total " +
                                    "FROM    tel.TEL_PERSONA per 	" +
                                    "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                                    "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                    "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                                    "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                    "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +                    
                                    "INNER JOIN NULLID.RNT_TRAMITE tram                      ON tram.id = "+ idtramite +  "  and tram.ID= autt.ID_TRAMITE " +
                                    "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                    "and   aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  "
                                    let hab_persona_tramite =  ibmdb.query( query,[id_region, rut_representante, rut_solicitante])
                                    if  (hab_persona_tramite[0].TOTAL>0)
                                    {
                                        return ibmdb.query("select  aut.ID_CATEGORIA ,aut.ID_TIPO_SERVICIO ," +
                                        "cat.NOMBRE AS categoria," +
                                        " tsa.NOMBRE  AS tipo_servicio , " +
                                        "tsv.NOMBRE AS tipovehiculo  ," +
                                        "moda.NOMBRE as modalidad  ," +
                                        "tsa.NOMBRE ||' '|| tsv.NOMBRE ||' '|| moda.NOMBRE  as tiposervicio " +
                                        "FROM    tel.TEL_PERSONA per 	" +
                                        "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 1 " +
                                        "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                        "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                                        "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                        "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                                        "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA " +
                                        "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO " +
                                        "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
                                        "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO " +
                                        "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD " +
                                        "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE " +
                                        "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                        "and aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  " ,[id_region, rut_representante, rut_solicitante])
                                    }
                                    else
                                    {
                                        return  {mensaje:'Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitt correspondiente para actualizar su documentacion' ,estado:'RECHAZADO'}
                                        
                                    }
    
                                }
                                else
                                {
    
                                    return  {mensaje:'Usted no se encuentra habilitado para realizar este tramite en linea' ,estado:'RECHAZADO'}
                                }
    
    
                            }
                            else
                            {        return  {mensaje:'Usted no se encuentra habilitado para realizar este tramite en la region indicada' ,estado:'RECHAZADO'}
                               
                            }
    
                }
                else
                {  return  {mensaje:'Usted no se encuentra Autorizado para realizar este tramite en la empresa indicada' ,estado:'RECHAZADO'}
                   
                }
    
               
             }  
             else
             {
    
                 return  {mensaje:'Empresa indicada no se encuentra habilitada para realizar tramites en linea' ,estado:'RECHAZADO'}
    
             }
    
          
        },
        //psalasl
        getAutorizadoPorEmpresaAndSolicitanteInscripcionServicio:  (id_region, rut_representante, rut_solicitante,idtramite) => {
            log.debug(id_region)
            log.debug(rut_representante)
            log.debug(rut_solicitante)
           //crear logica de respuesta
            //1 Empresa indicada no se encuentra habilitada para realizar tramites en linea
           
            let hab_empresa_tram =  ibmdb.query("select count(*) as total FROM   tel.TEL_PERSONA per 	 " +
                            "INNER JOIN   tel.TEL_RESPONSABLE resp  ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 2 " +
                           "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID   " +
                            "WHERE per.RUT = ?  " , [rut_representante])
             if  (hab_empresa_tram[0].TOTAL>0)
             {
                  //2 Usted no se encuentra habilitado para realizar este tramite en la empresa indicada
                let hab_persona_tram =  ibmdb.query("select count(*) as total " + 
                "FROM    tel.TEL_PERSONA per 	" +
                "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 2 " +
                "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                "where  per.RUT = ? AND per2.RUT = ?  " ,[rut_representante, rut_solicitante])
    
                if  (hab_persona_tram[0].TOTAL>0)
                {
                      //3 Usted no se encuentra habilitado para realizar este tramite en la region indicada
                    
                    let query="select count(1) as RESUL " +
                             "FROM    tel.TEL_PERSONA per 	" +
                             "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 2 " +
                             "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                             "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                             "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                             "where per.RUT = ? AND per2.RUT = ?  and aut.codigo_region =? "
                        let hab_persona_region =  ibmdb.query( query,[rut_representante, rut_solicitante,id_region])
    
                          
                        if  (hab_persona_region[0].RESUL>0)
                            {
                                //4 Usted no se encuentra habilitado para realizar este tramite en linea
                                let query="select tram.id as id_tram " +
                                "FROM    tel.TEL_PERSONA per 	" +
                                "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 2 " +
                                "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION and aut.AUTORIZADO=1 " +
                                "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                                "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA " +
                                "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO " +
                                "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
                                "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO " +
                                "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD " +
                                "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = "+ idtramite +  "  and tram.ID= autt.ID_TRAMITE " +
                                "where aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  "
                                let hab_persona_tramite =  ibmdb.query( query,[id_region, rut_representante, rut_solicitante])
                                if  (hab_persona_tramite.length>0 ) 
                                {
                                    //5 Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitee correspondiente para actualizar su documentacion
                                    let query="select count(1) as total " +
                                    "FROM    tel.TEL_PERSONA per 	" +
                                    "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 2 " +
                                    "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                    "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                                    "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                    "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +                    
                                    "INNER JOIN NULLID.RNT_TRAMITE tram                      ON tram.id = "+ idtramite +  "  and tram.ID= autt.ID_TRAMITE " +
                                    "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                    "and   aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  "
                                    let hab_persona_tramite =  ibmdb.query( query,[id_region, rut_representante, rut_solicitante])
                                    if  (hab_persona_tramite[0].TOTAL>0)
                                    {
                                        return ibmdb.query("select  aut.ID_CATEGORIA ,aut.ID_TIPO_SERVICIO ," +
                                        "cat.NOMBRE AS categoria," +
                                        " tsa.NOMBRE  AS tipo_servicio , " +
                                        "tsv.NOMBRE AS tipovehiculo  ," +
                                        "moda.NOMBRE as modalidad  ," +
                                        "tsa.NOMBRE ||' '|| tsv.NOMBRE ||' '|| moda.NOMBRE  as tiposervicio " +
                                        "FROM    tel.TEL_PERSONA per 	" +
                                        "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 2 " +
                                        "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                                        "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                                        "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                                        "INNER JOIN   tel.TEL_AUTORIZACION_TRAMITE autt           ON autt.ID_AUTORIZACION     = aut.ID  " +
                                        "INNER JOIN   NULLID.RNT_CATEGORIA_TRANSPORTE cat 		  ON cat.ID=aut.ID_CATEGORIA " +
                                        "INNER JOIN   nullid.RNT_TIPO_SERVICIO ts 				  ON ts.id = aut.ID_TIPO_SERVICIO " +
                                        "INNER JOIN   NULLID.RNT_TIPO_SERVICIO_AREA tsa 		  ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
                                        "INNER JOIN   NULLID.rnt_tipo_vehiculo_servicio tsv       on tsv.ID=ts.ID_TIPO_VEHICULO_SERVICIO " +
                                        "INNER JOIN   NULLID.rnt_modalidad moda                   on moda.ID=ts.ID_MODALIDAD " +
                                        "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = "+ idtramite +  " and tram.ID= autt.ID_TRAMITE " +
                                        "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
                                        "and aut.CODIGO_REGION   = ? and per.RUT = ? AND per2.RUT = ?  " ,[id_region, rut_representante, rut_solicitante])
                                    }
                                    else
                                    {
                                        return  {mensaje:'Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitt correspondiente para actualizar su documentacion' ,estado:'RECHAZADO'}
                                        
                                    }
    
                                }
                                else
                                {
    
                                    return  {mensaje:'Usted no se encuentra habilitado para realizar este tramite en linea' ,estado:'RECHAZADO'}
                                }
    
    
                            }
                            else
                            {        return  {mensaje:'Usted no se encuentra habilitado para realizar este tramite en la region indicada' ,estado:'RECHAZADO'}
                               
                            }
    
                }
                else
                {  return  {mensaje:'Usted no se encuentra Autorizado para realizar este tramite en la empresa indicada' ,estado:'RECHAZADO'}
                   
                }
    
               
             }  
             else
             {
    
                 return  {mensaje:'Empresa indicada no se encuentra habilitada para realizar tramites en linea' ,estado:'RECHAZADO'}
    
             }
    
        },
    checkVehiculoByPPU: (ppu) => {
        return ibmdb.query('SELECT v.PPU, v.TIPO_VEHICULO FROM NULLID.RNT_VEHICULO v  WHERE v.PPU = ?', [ppu])
    },
    findInfoVehiculoParaInscripcion: (ppu) => {
        let query =" select  V.PPU,  " +
        "V.tipovehiculo  as TIPO_VEHICULO ,  " +
        "V.ESTADO_PPU as ESTADO ,  " +
        "V.ID_TIPO_CANCELACION AS ID_CANCELACION,  " +
        "V.TIPO_CANCELACION AS TIPO_CANCELACION,   " +
        "V.CATEGORIA AS CATEGORIA,   " +
        "V.REGION as CODIGO_REGION ,  " +
        "V.ID_TIPO_CATEGORIA  ,  V.REEMPLAZADO " +
        "from NULLID.RNT_STAT_VEHICULOS_VIEW V   " +
        "where V.ppu= ?  " 
        return ibmdb.query(query,[ppu])

        // return ibmdb.query('SELECT v.PPU,v.TIPO_VEHICULO,vs.ESTADO,tc.id AS ID_CANCELACION,tc.NOMBRE AS TIPO_CANCELACION, ct.NOMBRE AS CATEGORIA, s.CODIGO_REGION ' +
        // 'FROM NULLID.RNT_VEHICULO v INNER JOIN NULLID.RNT_VEHICULO_SERVICIO vs ON vs.ID = ( ' +
        // '   SELECT vss.id ' +
        // '    FROM nullid.rnt_vehiculo_servicio VSS INNER JOIN nullid.rnt_servicio SS ON ss.id = vss.id_servicio ' +
        // '    INNER JOIN nullid.rnt_tipo_servicio TSS ON ss.id_tipo_servicio = tss.id ' +
        // '    INNER JOIN nullid.rnt_modalidad Ms ON ms.id = tss.id_modalidad AND ms.nombre <> \'ESPECIAL\' ' +
        // '   WHERE vss.id_vehiculo = v.id ORDER BY vss.fecha_estado DESC, vss.id DESC FETCH FIRST 1 ROWS ONLY ) ' +
        // 'INNER JOIN NULLID.RNT_SERVICIO s ON s.ID = vs.ID_SERVICIO ' + 
        // 'INNER JOIN NULLID.RNT_TIPO_SERVICIO ts ON ts.id = s.ID_TIPO_SERVICIO ' +
        // 'INNER JOIN NULLID.RNT_TIPO_VEHICULO_SERVICIO tvs ON tvs.id = ts.ID_TIPO_VEHICULO_SERVICIO ' +
        // 'INNER JOIN NULLID.RNT_TIPO_CANCELACION tc ON vs.ID_TIPO_CANCELACION = tc.ID ' +
        // 'INNER JOIN NULLID.RNT_CATEGORIA_TRANSPORTE ct ON ct.id = ts.ID_CATEGORIA_TRANSPORTE ' +
        // 'WHERE v.PPU = ?',[ppu])
    },
    findAntiguedadMaximaByTipoVehiculo: (tipoVehiculo,folio,region,tipodeingreso) => {
        let tipoVehiculoFiltrado = ""
    let tipodeingresoFiltrado =tipodeingreso;
        switch(tipoVehiculo) {
            case 'MINIBUS': 
                tipoVehiculoFiltrado = "MINIBUS"
                break;
            case 'MICROBUS': 
                tipoVehiculoFiltrado = "MINIBUS"
                break;
            case 'BUS': 
                tipoVehiculoFiltrado = "BUS"
                break;
            case 'CHASIS CABINADO':
                tipoVehiculoFiltrado = "BUS"
                break;
            case 'CHASSIS':
                tipoVehiculoFiltrado = "BUS"
                break;
            case 'OMNIBUS':
                tipoVehiculoFiltrado = "BUS"
                break;
            case 'TAXIBUS':
                tipoVehiculoFiltrado = "BUS"
                break;
            case 'BUS PULLMAN':
                tipoVehiculoFiltrado = "BUS"    
                break;
            case 'AUTOMOVIL':
                    tipoVehiculoFiltrado = "AUTOMOVIL"    
                    break;   
            default: tipoVehiculoFiltrado = ""
                break;
        }


        switch(tipoVehiculo) {
            case 'MINIBUS': 
                idtipoVehiculoFiltrado = "2"
                break;
            case 'MICROBUS': 
                idtipoVehiculoFiltrado = "2"
                break;
            case 'BUS': 
                idtipoVehiculoFiltrado = "2"
                break;
            case 'CHASIS CABINADO':
                idtipoVehiculoFiltrado = "2"
                break;
            case 'CHASSIS':
                idtipoVehiculoFiltrado = "2"
                break;
            case 'OMNIBUS':
                idtipoVehiculoFiltrado = "2"
                break;
            case 'TAXIBUS':
                idtipoVehiculoFiltrado = "2"
                break;
            case 'BUS PULLMAN':
                idtipoVehiculoFiltrado = "2"    
                break;
            case 'AUTOMOVIL':
                idtipoVehiculoFiltrado = "2"    
                    break;   
            default: idtipoVehiculoFiltrado = ""
                break;
        }

        let ModalidaddelServicio = ibmdb.query("select CATEGORIA, TIPOSERVICIO, MODALIDAD,TIPOVEHICULO  from NULLID.RNT_STAT_SERVICIOS_VIEW SV where sv.IDENT_SERVICIO=? and sv.CODIGO_REGION= ? and sv.CATEGORIA<>'PRIVADO' ",[folio,region])
        if (tipoVehiculo=="AUTOMOVIL")
        {
        

                if (ModalidaddelServicio[0].MODALIDAD=="TAXI COLECTIVO" && tipodeingresoFiltrado=="RENUEVA TU TAXI")
                        {
                        //let reglamentacion = "DTO 212/92 - TTE PUBLICO (TAXI COLECTIVO) > RENUEVA TU TAXI"
                           idreglamentacion =19
                        }
                else
                     {
      
                            switch(tipodeingresoFiltrado) 
                            {
                                case 'REEMPLAZO POR CONCURSO DE TAXIS': 
                                   // idreglamentacion = "DTO 212/92 - LEY 20474/20867 - TTE PUBLICO (TAXIS B/T/E) >REEMPLAZO POR CONCURSO DE TAXIS"
                                   idreglamentacion =104
                                    break;
                                case 'RENOVACIÓN DE MATERIAL': 
                                    //idreglamentacion = "DTO 212/92 - TTE PUBLICO (TAXIS B/T/E) > RENOVACIÓN DE MATERIAL"
                                    idreglamentacion =7
                                    break;
                                case 'RENOVACIÓN POR SINIESTRO': 
                                  // idreglamentacion = "DTO 212/92 - TTE PUBLICO (TAXIS B/T/E) > RENOVACIÓN POR SINIESTRO"
                                   idreglamentacion =101
                                    break;
                                default: reglamentacion = ""
                                    break;
                                }
                            }      
                       
                          let query = "  SELECT NITEMDAT.VALUE  " +
                            "  FROM    NULLID.RNT_REGLAMENTACION AS REG  " + 
                            "       LEFT JOIN NULLID.RNT_TIPO_REGLAMENTACION AS TREG ON        TREG.ID = REG.ID_TIPO_REGLAMENTACION  " +
                            "       LEFT JOIN NULLID.RNT_NORMATIVA AS NORM ON      NORM.ID_REGLAMENTACION = REG.ID   " +

                            "       LEFT JOIN NULLID.RNT_NORMATIVA_REGISTRO AS NREG ON      NREG.ID_NORMATIVA = NORM.ID " +
                            "       LEFT JOIN NULLID.RNT_NORMATIVA_ITEM AS NITEM ON       NITEM.ID_NORMATIVA_REGISTRO = NREG.ID   " +
                            "       LEFT JOIN NULLID.RNT_NORMATIVA_ITEM_DATA AS NITEMDAT ON       NITEMDAT.ID_NORMATIVA_ITEM = NITEM.ID  " +
                            " where    NORM.DESCRIPTOR= 'antiguedad_marco_geografico_tipo_vehiculo'      " + 
                            //"  AND NORM.RNT_LABEL = 'Antigüedad de Ingreso por marco geográfico y tipo de vehículo'   " +    
                            "  AND NITEM.RNT_KEY = 'antiguedad_maxima'  " +        
                            //"  AND (REG.NOMBRE='DTO 212/92 - TTE PUBLICO (TAXIS B/T/E) > RENOVACIÓN DE MATERIAL') " + 
                            "  AND (REG.ID= ? ) " + 
                            " AND EXISTS (SELECT NREG2.id FROM  NULLID.RNT_NORMATIVA_REGISTRO NREG2 " +
                            "         LEFT OUTER JOIN  NULLID.RNT_NORMATIVA_ITEM NITEM2 ON NITEM2.ID_NORMATIVA_REGISTRO = NREG2.id" +
                            "         LEFT OUTER JOIN  NULLID.RNT_NORMATIVA_ITEM_DATA NITEMDAT2 ON NITEMDAT2.ID_NORMATIVA_ITEM = NITEM2.id" +
                            "             WHERE NREG2.id=NREG.id AND NITEM2.rnt_key = 'tipos_vehiculo' AND NITEMDAT2.\"VALUE\" =?)   " +    
                            " AND EXISTS (SELECT NREG3.id FROM NULLID.RNT_NORMATIVA_REGISTRO NREG3 " +
                            "          LEFT OUTER JOIN  NULLID.RNT_NORMATIVA_ITEM NITEM3 ON NITEM3.ID_NORMATIVA_REGISTRO = NREG3.id" +
                            "         LEFT OUTER JOIN  NULLID.RNT_NORMATIVA_ITEM_DATA NITEMDAT3 ON NITEMDAT3.ID_NORMATIVA_ITEM = NITEM3.id    " +      
                            "         WHERE NREG3.id=NREG.id AND NITEM3.rnt_key = 'marco_geografico' AND NITEMDAT3.\"VALUE\" = ?)	" 
                          
                           let anioPorTipoDeVeviculo = ibmdb.query(query,[idreglamentacion,idtipoVehiculoFiltrado,region])
                        return anioPorTipoDeVeviculo[0].VALUE
                    
                //  let anioPorTipoDeVeviculo = ibmdb.query("SELECT NULLID.GET_ANTIGUEDAD_BY_TIPO_VEHICULO (?) AS ANTIGUEDAD FROM \"SYSIBM\".DUAL",[tipoVehiculoFiltrado])
        }
               
       if (tipoVehiculo =="BUS" || tipoVehiculo=="MINIBUS")
                {
                    let ssss =""
                }
    },
    
    findLstTipoVehiculoPermitidoByFolioRegion: (folio, region) => {
        try {
            let idTipoServicio = ibmdb.query("SELECT s.ID_TIPO_SERVICIO FROM NULLID.RNT_SERVICIO s WHERE s.IDENT_SERVICIO = ? AND s.CODIGO_REGION = ?", [folio, region])[0].ID_TIPO_SERVICIO
            if (config.rntTipoServicioMap.buses.IdsTiposServicios.find((id) => { return id.toString() === idTipoServicio})) {
                return ['BUS', 'MINIBUS']    
            }
            if (config.rntTipoServicioMap.taxis.IdsTiposServicios.find((id) =>{ return id.toString() === idTipoServicio})) {
                return ['AUTOMOVIL']    
            }
            return []
        } catch (e) {
            log.error("Error obteniendo listado de tipo de vehiculos para Folio: " + folio + " y REGION: " + region)
            return []
        }
    },
    findServiciosByCategoriaTransporte: (nombreCategoria) => {
        try {
            return ibmdb.query("SELECT  tsa.NOMBRE  || ' ' || tvs.NOMBRE || ' ' ||  m.NOMBRE AS CATEGORIA_TRANSPORTE " +
            "FROM NULLID.rnt_tipo_servicio ts " +
            "INNER JOIN NULLID.rnt_categoria_transporte ct on ct.ID = ts.ID_CATEGORIA_TRANSPORTE " +
            "INNER JOIN NULLID.rnt_modalidad m on m.ID = ts.ID_MODALIDAD " +
            "INNER JOIN NULLID.rnt_medio_transporte mt on mt.ID = ts.ID_MEDIO_TRANSPORTE " +
            "INNER JOIN NULLID.rnt_tipo_servicio_area tsa on tsa.ID = ts.ID_TIPO_SERVICIO_AREA " +
            "INNER JOIN NULLID.rnt_tipo_vehiculo_servicio tvs on tvs.ID = ts.ID_TIPO_VEHICULO_SERVICIO " +
            "WHERE CT.NOMBRE = ? " +
            "ORDER BY 1", [nombreCategoria])
        } catch (error) {
            log.debug("Exeption al ejecutar query findServiciosByCategoriaTransporte " + error);
        }
    },
    findReglamentacionByIdTipoServicio: (idtiposervicio) => {
        try {
            return ibmdb.query(" select " +
            "SUBSTR(R.nombre,INSTR(R.nombre, '>' )+1,LENGTH(R.nombre)) as Reglamentacion" +
            
            " from NULLID.RNT_REGLAMENTACION_TIPO_SERVICIO RT " +
            "            inner join NULLID.RNT_REGLAMENTACION R on R.ID=RT.REGLAMENTACION_ID " +
            "            where TIPO_SERVICIO_ID= ? " +
            "            and R.ID_REGLAMENTACION_DE_QUE_DEPENDE is not null", [idtiposervicio])
        } catch (error) {
            log.debug("Exeption al ejecutar query findReglamentacionByIdTipoServicio " + error);
        }
    }
}