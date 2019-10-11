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
                log.debug(JSON.stringify(error))
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
                    log.debug(JSON.stringify(result))
                    resolve(result)
                }
                else {
                    resolve({return: {ppu: ppu, status: false}})
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
                reject(new Error("Error consultando RT"))
            }
            if(!client) {
                log.error("Error creando cliente: " + JSON.stringify(client))
                reject(new Error("Error instanciando cliente para consultar RT"))
            }
            client.consultaRevisionTecnica({ ppu: ppu },(error2, result) => {
                if(error2) {
                    log.error('Error: '  + JSON.stringify(error2))
                    reject(new Error("Error consultando metodo getPlaca"))
                }
                if(result != null) {
                    log.debug("Retornando: " + JSON.stringify(result))
                    resolve(result)
                }
                else {
                    resolve({return: {ppu: ppu, status: false}})
                }
            })
        })
    })
}
module.exports = {
    getPPURT: getPPURT,
    getPPUSRCeI: getPPUSRCeI
}
var ServiciosGateway = (function () {
    function ServiciosGateway() {
        this.urlPpu = '../wsdl/ppu.wsdl';
        this.urlRT = '../wsdl/revisionTecnica.wsdl';
        this.urlFirmador = '../wsdl/RecibeDocumentoFirma_Api_Tramites.wsdl';
        this.async = obtenerVehiculo(ppu, string);
        this.async = obtenerRevisionTecnica(ppu, string);
        this.const = serviciosGateway = new ServiciosGateway();
    }
    ServiciosGateway.prototype.Promise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            soap.createClient(_this.urlPpu, function (error1, client) {
                if (error1) {
                    reject(new Error(error1));
                    return;
                }
                if (!client) {
                    reject('No fue posible la conexión con el servicio externo.');
                    return;
                }
                client.getPlaca({ ppu: ppu }, function (error2, result) {
                    if (error2) {
                        reject(new Error(error2));
                        return;
                    }
                    if (result != null) {
                        resolve(result);
                    }
                    else {
                        var response = {};
                        response.return = {
                            patente: ppu
                        };
                        resolve(response);
                    }
                });
            });
        });
    };
    ServiciosGateway.prototype.Promise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            soap.createClient(_this.urlRT, function (error1, client) {
                if (error1) {
                    reject(new Error(error1));
                    return;
                }
                if (!client) {
                    reject('No fue posible la conexión con el servicio externo.');
                    return;
                }
                client.consultaRevisionTecnica({ ppu: ppu }, function (error2, result) {
                    if (error2) {
                        var response = {};
                        response.return = {
                            patente: ppu
                        };
                        resolve(response);
                    }
                    resolve(result);
                });
            });
        });
    };
    return ServiciosGateway;
})();
