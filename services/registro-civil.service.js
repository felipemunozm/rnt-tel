const soap = require('soap');
const log = require('../log')
const urlPpu = 'http://ws.mtt.cl/services/PPUService_API_Tramites?wsdl'
const timeout = 1000



class DatosSRCEI {

    /** @type {string} */
    ppu;

    /** @type {boolean} : para indicar si los datos son producto de una consulta exitosa */
    exitosa;

    /** @type {string} */
    rutPropietario;

    /** @type {boolean} */
    esComunidad;

    /** @type {string[]} */
    rutsComunidad;

    /** @type {number} : antiguedad vehiculo, 0 en caso de ser año siguiente */
    antiguedad;

    /** @type {string} */
    tipoVehiculo;

    /** @type {boolean} */
    esLeasing;

    /** @type {string} : rut asociado al tenedor del vehiculo en caso de leasing */
    rutMerotenedor;

    /** @type {string} */
    status;

    /** @type {any[]} */
    docs
}


const createClient = async() => {
    return new Promise((resolve, reject) => {
        soap.createClient(urlPpu, { timeout }, (error, client) => {
            if (error) {
                log.error('Error al crear cliente', error)
                reject(error)
                return
            }
            log.debug('cliente creado ' + urlPpu)
            resolve(client)
        })
    })
}

module.exports = {
    DatosSRCEI,

    /**
     * @param {string} : placa patente para consulta 
     * @returns {Promise<DatosSRCEI>} : datos asociados a la ppu 
     * */
    obtenerDatos: async(ppu) => {
        log.debug(ppu)

        return new Promise(async(resolve, _reject) => {
            const client = await createClient()
            const resp = new DatosSRCEI()
            log.debug('cliente ok')
            client.getPlacaAsync({ ppu }).then(result => {

                const srcei = result.return;
                resp.exitosa = result != null
                if (resp.exitosa) {
                    log.trace(JSON.stringify(result))

                    resp.ppu = ppu

                    // rut propietario o comunidad
                    resp.esComunidad = srcei.propieActual.propact.itemPropact.length > 1
                    if (resp.esComunidad) {
                        resp.rutsComunidad = srcei.propieActual.propact.itemPropact.map(p => p.rut)
                    } else {
                        resp.rutPropietario = srcei.propieActual.propact.itemPropact[0].rut;
                    }

                    // antiguedad
                    const agnoActual = new Date().getFullYear()
                    const agnoPpu = Number(srcei.aaFabric)
                    resp.antiguedad = agnoPpu > agnoActual ? 0 : agnoActual - agnoPpu

                    // tipo vehiculo 
                    // TODO: revisar WSDL para valores
                    resp.tipoVehiculo = srcei.tipoVehi || ''

                    // leasing y datos merotenedor
                    try {
                        let tenedor = srcei.limita.itemLimita[0].tenedores.itemTenedores[0]
                        resp.esLeasing = tenedor.rut != undefined
                        resp.rutMerotenedor = tenedor.rut
                    } catch (e) {
                        log.debug(`No fue posible determinar leasing: ${e}`)
                        resp.esLeasing = false
                    }

                    // estado
                    // TODO: revisar WSDL para valores
                    resp.status = srcei.status || ''

                }
                resolve(resp)

            }).catch(err => {
                log.error(err)
                resolve(resp.exitosa = false)
            })

        })
    }
}