const ibmdb = require("ibm_db")
const log = require('../../log')

module.exports.query = (sql, params) => {
    // try {
    log.trace(`DB2Query: ${sql}`)
    log.trace(`DB2Params: ${params}`)
    let options = { connectTimeout: 20, systemNaming: true }
    let db2con = ibmdb.openSync(process.env.RNTDN, options)
    let stmt = db2con.prepareSync(sql)
    let result = stmt.executeSync(params)
    log.trace(`DB2Result: ${result}`)
    let rows = result.fetchAllSync()
    log.trace(`DB2Rows: ${rows}`)
        // let rows = db2con.querySync(sql, [])
    db2con.closeSync()
    return rows
        // } catch (e) {
        //     log.error("db2errorConection: " + e.message)
        //     return {error: "Error consultando BD: " + e.message}
        // }
}