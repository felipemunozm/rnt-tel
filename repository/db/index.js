const ibmdb = require("ibm_db")
const conf = require('../../config')
//const log = require('../../log')
let cn = conf.db2ConectionString

module.exports.query = (sql, params) => {
    try {
        // log.trace("DB2Query: " + sql)
        // log.trace("DB2Params:" + JSON.stringify(params))
        let options = {connectTimeout: 20, systemNaming: true}
        let db2con = ibmdb.openSync(cn, options)
        let stmt = db2con.prepareSync(sql)
        stmt.bind(params)
        let result = stmt.executeSync(params)
        // log.trace("DB2Result: " + JSON.stringify(result))
        let rows = result.fetchAllSync()
        // log.trace("DB2Rows: " + JSON.stringify(rows))
        // let rows = db2con.querySync(sql, [])
        db2con.closeSync()
        return rows
    } catch (e) {
        // log.error("db2errorConection: " + e.message)
        return {error: "Error consultando BD: " + e.message}
    }
}