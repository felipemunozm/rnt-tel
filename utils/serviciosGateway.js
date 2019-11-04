const soap = require('soap');
const log = require('../log')
const urlPpu = 'http://ws.mtt.cl/services/PPUService_API_Tramites?wsdl'
const urlRT = 'http://ws.mtt.cl/services/ConsultaRevisionTecnica_API_Tramites?wsdl'

let getPPUSRCeI = (ppu) => {
    log.debug("Entrando a consultar PPU")
    return new Promise((resolve,reject)=> {
        soap.createClient(urlPpu, (error,client) => {
            log.debug('Creando Cliente')
            if(error) {
                log.trace(JSON.stringify(error))
                reject(new Error("Error consultando PPU"))
                return
            }
            if(!client) {
                reject(new Error("Error instanciando cliente para consultar PPU"))
                return
            }
            client.getPlaca({ppu:ppu}, (error2,result) => {
  
                if(error2) {
                    reject(new Error("Error consultando metodo getPlaca"))
                    return
                }
                if(result != null) {
                    log.trace(JSON.stringify(result))
                    resolve(result)
                }
                else {
                    resolve( {
                        return: {
                            ppu: ppu, 
                            status: false,
                            propieActual: {
                                propact: {
                                    itemPropact: [
                                        {
                                            rut: '0-0'
                                        }
                                    ]
                                }
                            },
                            aaFabric: 0,
                            tipoVehi: '',
                            limita: {
                                itemLimita: [
                                    {
                                        empty: true
                                    }
                                ]
                            }
                        }
                    })
                }
            })
        })
    })
}
let getPPURT = (ppu) => {
    return new Promise((resolve,reject) => {
        log.debug("Consultando RT para ppu: " + ppu)
        soap.createClient(urlRT, (error, client) => {
            if(error) {
                log.error("Error creando cliente: " + JSON.stringify(error))
                // reject(new Error("Error consultando RT"))
                resolve( {
                    return: {
                        ppu: ppu, 
                        status: false,
                        revisionTecnica: {
                            resultado: 'R',
                            fechaVencimiento: undefined
                        },
                        revisionGases: {
                            revisionGas: [
                                {
                                    resultado: 'R'
                                }
                            ]
                        }
                    }
                })
            }
            if(!client) {
                log.error("Error creando cliente: " + JSON.stringify(client))
                reject(new Error("Error instanciando cliente para consultar RT"))
            }
            client.consultaRevisionTecnica({ ppu: ppu },(error2, result) => {
                if(error2) {
                    log.error('Error: '  + JSON.stringify(error2))
                    // reject(new Error("Error consultando metodo getPlaca"))
                    resolve( {
                        return: {
                            ppu: ppu, 
                            status: false,
                            revisionTecnica: {
                                resultado: 'R',
                                fechaVencimiento: undefined
                            },
                            revisionGases: {
                                revisionGas: [
                                    {
                                        resultado: 'R'
                                    }
                                ]
                            }
                        }
                    })
                }
                if(result != null) {
                    log.trace("Retornando: " + JSON.stringify(result))
                    resolve(result)
                }
                else {
                    resolve( {
                        return: {
                            ppu: ppu, 
                            status: false,
                            revisionTecnica: {
                                resultado: 'R',
                                fechaVencimiento: undefined
                            },
                            revisionGases: {
                                revisionGas: [
                                    {
                                        resultado: 'R'
                                    }
                                ]
                            }
                        }
                    })
                }
            })
        })
    })
}
module.exports = {
    getPPURT: getPPURT,
    getPPUSRCeI: getPPUSRCeI
}

