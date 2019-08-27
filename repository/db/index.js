const ibmdb = require("ibm_db")
// let conectionString = "DATABASE=RNT5;HOSTNAME=alamo.mtt.cl;UID=db2admin;PWD=**db2admin;PORT=50000;PROTOCOL=TCPIP"
let cn = "DATABASE=RNT5;HOSTNAME=alamo.mtt.cl;UID=db2admin;PWD=**db2admin;PORT=50000;PROTOCOL=TCPIP"

module.exports.query = (sql) => {
    try {
        let options = {connectTimeout: 20, systemNaming: true}
        let db2con = ibmdb.openSync(cn, options)
        let rows = db2con.querySync(sql, [])
        db2con.closeSync()
        return rows
    } catch (e) {
        console.log("db2errorConection: " + e.message)
    }
}