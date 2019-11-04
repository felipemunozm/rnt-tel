const log = require('../../log')


module.exports = {
    revisionRechazosBuses: (ruleEngine, docs,docsOpcionales , continua) => {
        ruleEngine.on("failure", (event, almanac, ruleResult) => {
            log.debug("Rechazo Buses, Revisando...")
            log.trace("\tEvent: " + JSON.stringify(event))
            log.trace("\tAlmanac: " + JSON.stringify(almanac))
            log.trace("\tRuleResult: " + JSON.stringify(ruleResult))
            try {
                switch(event.type) {
                    case 'propietario':
                        log.debug("\tRechazo BUS Propietario")
                        docs.push({codigo: 'V02', descripcion: 'Factura de Compraventa'},{codigo:'V03', descripcion: 'Solicitud de Primera Incripción o de Transferencia" en el Registro Nacional de Vehículos Motorizados - R.N.V.M.'})
                        break
                    case 'antiguedad':
                        log.debug("\tRechazo BUS Antiguedad")
                        continua.estado = false
                        continua.lstRechazos.push('Rechazo por Antiguedad')
                        break
                    case 'rt':
                        log.debug("\tRechazo BUS RT")
                        let resultadoRT = ruleResult.conditions.all[0].result
                        let vigenciaRT = ruleResult.conditions.all[1].result
                        docs.push({codigo:'V07', descripcion: 'Adjunte copia de "Certificado de Revisión Técnica" o copia de "Certificado de Homologación" y "Certificado de Características Especiales", otorgado por una planta de revisión técnica'})
                        break
                    case 'TVNORMA':
                        log.debug("\tRechazo BUS TV NORMA")
                        continua.estado = false
                        continua.lstRechazos.push('Rechazo por Tipo Vehiculo en Norma')
                        break
                    case 'BUSOK':
                        log.debug("\tRechazo BUS RNT")
                        //verificar condicion de rechazo por RNT
                        let resultadoRNTNoEncontrado = ruleResult.conditions.any[0].result
                        if(!resultadoRNTNoEncontrado) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por existir en RNT previamente')
                        }
                        let resultadoRNTCanceladoTraslado = ruleResult.conditions.any[1].all[0].result
                        let resultadoRNTCanceladoTipoTraslado = ruleResult.conditions.any[1].all[1].result
                        let resultadoRNTCanceladoTrasladoRegion = ruleResult.conditions.any[1].all[2].result
                        if(!resultadoRNTCanceladoTraslado && !resultadoRNTCanceladoTipoTraslado && !resultadoRNTCanceladoTrasladoRegion) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por Tipo de Cancelacion Traslado')
                        }
                        let resultadoRNTCanceladoCategoria = ruleResult.conditions.any[2].all[0].result
                        let resultadoRNTCanceladoTipoCategoria = ruleResult.conditions.any[2].all[1].result
                        let resultadoRNTCanceladoCategoriaAnterior = ruleResult.conditions.any[2].all[2].result
                        if(!resultadoRNTCanceladoCategoria && !resultadoRNTCanceladoTipoCategoria && !resultadoRNTCanceladoCategoriaAnterior) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por Tipo de Cancelacion Cambio Categoria')
                        }
                        break
                    default:
                        log.debug("\tRechazo no detectado, evento: " + event.type)
                   

                }
            } catch (e) {
                log.error("\tError buscando rechazo: " + e)
                continua.estado = false                
            }
        })
    },
    revisionValidadosBuses: (ruleEngine, docs, docsOpcionales, continua) => {
        ruleEngine.on("success", (event, almanac, ruleResult) => {
            log.debug("Validacion Buses, Revisando...")
            log.trace("\tEvent: " + JSON.stringify(event))
            log.trace("\tAlmanac: " + JSON.stringify(almanac))
            log.trace("\tRuleResult: " + JSON.stringify(ruleResult))
            switch(event.type) {
                case 'propietario':
                    log.debug("\tPropietario Validado")
                    log.debug("\tRevisando Leasing")
                    //revisar meratenencia para agregar documentos a solicitar
                    let resultadoMerotenedor = ruleResult.conditions.any[1].all[0].result
                    let resultadoLeasing = ruleResult.conditions.any[1].all[1].result
                    if(resultadoLeasing && resultadoMerotenedor){
                        docs.push({codigo: 'V05', descripcion: 'Adjunte "Acreditación de leasing" y "Documento del propietario" autorizando al Mero tenedor destinar el vehículo a la prestación del servicio'})
                    }
                    log.debug("\tRevisando Comunidad")
                    let resultadoRutPerteneceComunidad = ruleResult.conditions.any[2].all[0].result
                    let resultadoComunidad = ruleResult.conditions.any[2].all[1].result
                    if(resultadoRutPerteneceComunidad && resultadoComunidad) {
                        docs.push({codigo: 'V06', descripcion: 'Adjunte copia de "Escritura Pública del Mandato de la comunidad" '})
                    }
                    break
                default:
                    log.debug("\tValidacion " + event.type + " sin análisis adicional")
                    break
            }
        })
    }
}