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
   
       //psalas
       getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses:  (id_region, rut_solicitante,rut_solicitante2) => {
    
        log.debug(id_region)
        log.debug(rut_solicitante)
        //crear logica de respuesta
        //1 Empresa indicada no se encuentra habilitada para realizar tramites en linea
        
        //2 Usted no se encuentra habilitado para realizar este tramite en la empresa indicada
        //3 Usted no se encuentra habilitado para realizar este tramite en la region indicada
        //4 Usted no se encuentra habilitado para realizar este tramite en linea
        //5 Ha expirado su vigencia de habilitacion para realizar entre tramite. Dirijase a la Seremitee correspondiente para actualizar su documentacion

        return ibmdb.query("select  aut.ID_CATEGORIA ,aut.ID_TIPO_SERVICIO ," +
        "cat.NOMBRE AS categoria," +
        " tsa.NOMBRE  AS tiposervicio , " +
        "tsv.NOMBRE AS tipovehiculo  ," +
        "moda.NOMBRE as modalidad  ," +
        " tsa.NOMBRE ||' '|| tsv.NOMBRE ||' '|| moda.NOMBRE  as tiposervicio " +
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
        "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = 1  and tram.ID= autt.ID_TRAMITE " +
        "WHERE  current date between aut.FECHA_VIGENCIA_DESDE and aut.FECHA_VIGENCIA_HASTA " +
        "and aut.CODIGO_REGION   = ? and per2.RUT = ? AND per.RUT = ? " ,[id_region, rut_solicitante,rut_solicitante2])
    },
    //psalas
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioBuses:  (id_region, rut_representante, rut_solicitante) => {
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
                  let query="select CASE  " + id_region +
                        " WHEN aut.CODIGO_REGION THEN 1 " +
                        " else 0 END as resul "+
                        "FROM    tel.TEL_PERSONA per 	" +
                        "INNER JOIN   tel.TEL_RESPONSABLE resp                    ON resp.ID_PERSONA         = per.ID  and  per.TIPO_PERSONA_ID     = 2 " +
                        "INNER JOIN   tel.TEL_RESPONSABLE_AUTORIZACION resp_aut   ON resp_aut.ID_RESPONSABLE = resp.ID  " +
                        "INNER JOIN   tel.TEL_AUTORIZACION aut                    ON aut.id                  = RESP_AUT.ID_AUTORIZACION " +
                        "INNER JOIN   tel.TEL_PERSONA per2 					      ON aut.ID_PERSONA = per2.id AND per2.TIPO_PERSONA_ID = 1 " +
                        "where per.RUT = ? AND per2.RUT = ?  "
                    let hab_persona_region =  ibmdb.query( query,[rut_representante, rut_solicitante])

                      
                    if  (hab_persona_region[0].RESUL==1)
                        {
                            //4 Usted no se encuentra habilitado para realizar este tramite en linea
                            let query="select tram.id as id_tram " +
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
                            "INNER JOIN NULLID.RNT_TRAMITE tram                    ON tram.id = 1  and tram.ID= autt.ID_TRAMITE " +
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
                                "INNER JOIN NULLID.RNT_TRAMITE tram                      ON tram.id = 1  and tram.ID= autt.ID_TRAMITE " +
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
                                    "INNER JOIN NULLID.RNT_TRAMITE tram                       ON tram.id = 1  and tram.ID= autt.ID_TRAMITE " +
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
            {  return  {mensaje:'Usted no se encuentra habilitado para realizar este tramite en la empresa indicada' ,estado:'RECHAZADO'}
               
            }

           
         }  
         else
         {

             return  {mensaje:'Empresa indicada no se encuentra habilitada para realizar tramites en linea' ,estado:'RECHAZADO'}

         }

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
