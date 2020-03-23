const { rntTipoServicioMap: configs, costoDocumentos } = require('../config')

module.exports = {

    /**
     * @param {string} tipoVehiculo
     */
    idTramitePorTipoVehiculo(tipoVehiculo) {
        switch (tipoVehiculo) {
            case 'BUSES':
                return configs.buses.IdsTramites[0]
            case 'ESCOLARES':
                return configs.escolares.IdsTramites[0]
            case 'COLECTIVOS':
                return configs.colectivos.IdsTramites[0]
            case 'PRIVADOS':
                return configs.privados.IdsTramites[0]
            case 'TAXIS':
                return configs.taxis.IdsTramites[0]
            default:
                throw new Error(`Tipo vehículo '${tipoVehiculo}' no reconocido.`)
        }
    },

    /**
     * Costo total el trámite en base a cantidad de recorridos y tamaño de la flota.
     * Por ahora corresponde a una fórmula sencilla de cálculo
     * donde el primer documento tiene un valor de $790 y los posteriores de $530 
     * @param {number} recorridos 
     * @param {number} tamanoFlota 
     * @returns {number}
     */
    costoTramite(recorridos, tamanoFlota) {
        const cantidad = (recorridos || 0) * (tamanoFlota || 0)
        let costo = costoDocumentos.primero
        if (cantidad > 1) {
            costo += costoDocumentos.siguientes * (cantidad - 1)
        }
        return costo
    }
}