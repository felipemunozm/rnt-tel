const log = require('../../log')

module.exports = {
    cargarRevisionRechazoVehiculo: (ruleEngine, docs, continua) => {
        ruleEngine.on('failure', (event,almanac, ruleResult) => {
            log.debug("Failure event trigger...")
            log.debug('Failure RuleResult: ' + JSON.stringify(ruleResult))
            // ruleResult.conditions.all.forEach(condition => {
            try {
                //buscar el rechazo por propietario
                let resultadoPropietario = ruleResult.conditions.all[0].any[0].result
                if(!resultadoPropietario) {
                    docs.push({codigo: 'V02', descripcion: 'Factura de Compraventa'},{codigo:'V03', descripcion: 'Solicitud de Primera Incripción o de Transferencia" en el Registro Nacional de Vehículos Motorizados - R.N.V.M.'})
                }
                //buscar rechazo por antiguedad segun norma
                let resultadoAntiguedad = ruleResult.conditions.all[1].result
                if(!resultadoAntiguedad) {
                    continua.estado = false
                }
                //condition de tipovehiculo permitido por norma
                let resultadoTipoVehiculoNorma = ruleResult.conditions.all[2].result
                if(!resultadoTipoVehiculoNorma) {
                    continua.estado = false
                }
                let resultadoRT = ruleResult.conditions.all[3].result
                //buscar condicion de resultadoRT
                if(!resultadoRT) {
                    docs.push({codigo:'V07', descripcion: 'Adjunte copia de "Certificado de Revisión Técnica" o copia de "Certificado de Homologación" y "Certificado de Características Especiales", otorgado por una planta de revisión técnica'})
                }
                //verificar condicion de rechazo por RNT
                let resultadoRNTNoEncontrado = ruleResult.conditions.all[4].any[0].result
                if(!resultadoRNTNoEncontrado) {
                    continua.estado = false
                }
                let resultadoRNTCanceladoTraslado = ruleResult.conditions.all[4].any[1].all[0].result
                let resultadoRNTCanceladoTipoTraslado = ruleResult.conditions.all[4].any[1].all[1].result
                let resultadoRNTCanceladoTrasladoRegion = ruleResult.conditions.all[4].any[1].all[2].result
                if(!resultadoRNTCanceladoTraslado && !resultadoRNTCanceladoTipoTraslado && !resultadoRNTCanceladoTrasladoRegion) {
                    continua.estado = false
                }
                let resultadoRNTCanceladoCategoria = ruleResult.conditions.all[4].any[2].all[0].result
                let resultadoRNTCanceladoTipoCategoria = ruleResult.conditions.all[4].any[2].all[1].result
                let resultadoRNTCanceladoCategoriaAnterior = ruleResult.conditions.all[4].any[2].all[2].result
                if(!resultadoRNTCanceladoCategoria && !resultadoRNTCanceladoTipoCategoria && !resultadoRNTCanceladoCategoriaAnterior) {
                    continua.estado = false
                }
                let resultadoRNTTaxiReemplazoPPU = ruleResult.conditions.all[5].any[0].all[0].result
                let resultadoRNTTaxiTipoCancelacion = ruleResult.conditions.all[5].any[0].all[1].result
                if(!resultadoRNTTaxiReemplazoPPU && !resultadoRNTTaxiTipoCancelacion) {
                    continua.estado = false
                }
            }
            catch (e) {
                log.error("Error evaluando rechazos en evento failure:\n" + JSON.stringify(e))
            }
            // })
        })
        ruleEngine.on("success", (event,almanac, ruleResult) => {
            log.debug("Success event trigger...")
            log.debug("Success ruleResult: " + JSON.stringify(ruleResult))
            // ruleResult.conditions.all.forEach(condition => {
                // log.debug("Condition: " + JSON.stringify(condition))
            //revisar meratenencia para agregar documentos a solicitar
            let resultadoMerotenedor = ruleResult.conditions.all[0].any[1].all[0].result
            let resultadoLeasing = ruleResult.conditions.all[0].any[1].all[1].result
            if(resultadoLeasing && resultadoMerotenedor){
                docs.push({codigo: 'V05', descripcion: 'Adjunte "Acreditación de leasing" y "Documento del propietario" autorizando al Mero tenedor destinar el vehículo a la prestación del servicio'})
            }
            let resultadoRutPerteneceComunidad = ruleResult.conditions.all[0].any[2].all[0].result
            let resultadoComunidad = ruleResult.conditions.all[0].any[2].all[1].result
            if(resultadoRutPerteneceComunidad && resultadoComunidad) {
                docs.push({codigo: 'V06', descripcion: 'Adjunte copia de "Escritura Pública del Mandato de la comunidad" '})
            }
            
            // })
        })
    }
}