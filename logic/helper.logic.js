const configs = require('../config').rntTramitesMap

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
    }
}