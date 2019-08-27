const ibmdb = require("../db")
module.exports = {
    getTest: () => {
        return ibmdb.query("SELECT PPU FROM NULLID.RNT_VEHICULO FETCH FIRST 10 ROWS ONLY", [])
    },
    getAutorizadosParaInscripcionServicios: (rut) => {
        return ibmdb.query("SELECT DISTINCT(per.RUT), per.NOMBRE, cat.NOMBRE as CATEGORIA, tsa.NOMBRE as TIPO_SERVICIO " +
        "FROM TEL.TEL_AUTORIZACION aut inner JOIN TEL.TEL_AUTORIZACION_TRAMITE aut_tram ON aut.ID = aut_tram.ID_AUTORIZACION " +
        "left JOIN tel.TEL_PERSONA per ON aut.ID_PERSONA = per.ID AND per.TIPO_PERSONA_ID = 1 " +
        "INNER JOIN NULLID.RNT_CATEGORIA_TRANSPORTE cat ON cat.id = aut.ID_CATEGORIA " +
        "INNER JOIN nullid.RNT_TIPO_SERVICIO ts ON ts.id = aut.ID_TIPO_SERVICIO " +
        "INNER JOIN NULLID.RNT_TIPO_SERVICIO_AREA tsa ON ts.ID_TIPO_SERVICIO_AREA = tsa.id " +
        "INNER JOIN NULLID.RNT_TRAMITE tram ON tram.id = 1 where per.RUT = ?",[rut])
    }
}
