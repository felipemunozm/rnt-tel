const log = require('../log')

module.exports = {
    getArrayPropietarioComunidad: (itemPropact) => {
        let response = []
        itemPropact.forEach(item => {
            response.push(item.rut)
        });
    },
    determinarLeasing: (limita) => {
        try {
            let tenedor = limita.itemLimita[0].tenedores.itemTenedores[0]
            if(tenedor.rut != undefined) {
                return true
            }
        }
        catch(e) {
            log.error("fallo calculo de leasing")
            return false            
        }
    },
    getRutMerotenedor: (limita) => {
        try {
            return limita.itemLimita[0].tenedores.itemTenedores[0].rut
        } catch(e) {
            log.error("error obteniendo rut merotenedor")
        }
    }
}