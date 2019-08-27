const ibmdb = require("../db")
module.exports.getTest = () => {
    return ibmdb.query("SELECT PPU FROM NULLID.RNT_VEHICULO FETCH FIRST 10 ROWS ONLY", [])
}
