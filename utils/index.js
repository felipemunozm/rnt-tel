var soap = require('soap');
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
exports.ServiciosGateway = ServiciosGateway;