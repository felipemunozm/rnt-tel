const log = require('../log')

module.exports = {
    getArrayPropietarioComunidad: (itemPropact) => {
        // let response = []
        // itemPropact.forEach(item => {
        //     response.push(item.rut)
        // });        
    },
    determinarLeasing: (limita) => {
        try {
            let tenedor = limita.itemLimita[0].tenedores.itemTenedores[0]
            return tenedor.rut != undefined
        } catch (e) {
            log.debug("fallo calculo de leasing, retornando false")
            return false
        }
    },
    getRutMerotenedor: (limita) => {
        try {
            return limita.itemLimita[0].tenedores.itemTenedores[0].rut
        } catch (e) {
            log.debug("error obteniendo rut merotenedor, retornando false")
        }
    }
}