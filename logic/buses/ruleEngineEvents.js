const log = require('../../log')
const config = require('../../config')

module.exports = {
    revisionRechazosBuses: (ruleEngine, docs, docsOpcionales, continua) => {
        ruleEngine.on("failure", (event, almanac, ruleResult) => {
            log.debug("Rechazo Buses, Revisando...")
            log.trace("\tEvent: " + JSON.stringify(event))
            log.trace("\tAlmanac: " + JSON.stringify(almanac))
            log.trace("\tRuleResult: " + JSON.stringify(ruleResult))          
            try {
                switch(event.type) {
                    case 'propietario':
                        log.debug("\tRechazo BUS Propietario")
                        console.log("\tRechazo BUS Propietario failure")
                        let validacionrutPropietario = ruleResult.conditions.any[0].result;
                        //revisar meratenencia para agregar documentos a solicitar
                        let resultadoMerotenedor = ruleResult.conditions.any[1].all[0].result
                        let resultadoLeasing = ruleResult.conditions.any[1].all[1].result 
                        
                        //revisar Comunidad para agregar documentos a solicitar
                        let resultadoRutPerteneceComunidad = ruleResult.conditions.any[2].all[0].result
                        let resultadoComunidad = ruleResult.conditions.any[2].all[1].result
                        
                        if (validacionrutPropietario) {
                            log.debug("\tRevisando Propietario")
                            console.log("\tRevisando Propietario failure")
                            //Documentos obligatorios
                            docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                            docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                            //Documentos adicionales opcionales
                            docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                        }else{
                            if(resultadoLeasing || resultadoMerotenedor){
                                log.debug("\tRevisando Merotenedor")
                                console.log("\tRevisando Merotenedor failure")
                                //Documentos obligatorios
                                docs.push({codigo: config.documents.V03.code, descripcion: config.documents.V03.description})
                                docs.push({codigo: config.documents.V05.code, descripcion: config.documents.V05.description})
                                docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                                docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                                //Documentos adicionales opcionales
                                docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                            }
                            if(resultadoRutPerteneceComunidad || resultadoComunidad) {
                                log.debug("\tRevisando Comunidad")
                                console.log("\tRevisando Comunidad failure")
                                //Documentos obligatorios
                                docs.push({codigo: config.documents.V21.code, descripcion: config.documents.V21.description})
                                docs.push({codigo: config.documents.V36.code, descripcion: config.documents.V36.description})
                                docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                                docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                                //Documentos adicionales opcionales
                                docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                            }
                        }

                        docs.push({codigo : config.documents.V02.code, descripcion: config.documents.V02.description},
                            {codigo:config.documents.V03.code, descripcion: config.documents.V03.description})
                            
                        break;
                    case 'antiguedad':
                        log.debug("\tRechazo BUS Antiguedad")
                        console.log("\tRechazo BUS Antiguedad failure")
                        let validacionAntiguedad = ruleResult.conditions.all[0].result

                        if (validacionAntiguedad) {
                            continua.estado = false
                            continua.lstRechazos.push('Vehículo rechazado por antigüedad')   
                        }
                        break;
                    case 'rt':
                        log.debug("\tRechazo BUS RT")
                        console.log("\tRechazo BUS RT failure")
                        let validacionResultadoRT = ruleResult.conditions.all[0].result
                        let validacionVigenciaRT = ruleResult.conditions.all[1].result

                        log.trace("valor de la vigencia " + validacionVigenciaRT)
                        console.log("valor de la vigencia failure " + validacionVigenciaRT)
                        if (!validacionVigenciaRT && !validacionResultadoRT) {
                            //Documentos obligatorios
                            docs.push({codigo: config.documents.V13.code, descripcion: config.documents.V13.description},
                                      {codigo: config.documents.V08.code, descripcion: config.documents.V08.description}) 
                            //Documentos adicionales opcionales
                            docsOpcionales.push({codigo: config.documents.V19.code, descripcion: config.documents.V19.description}) 
                        }
                        break;
                    case 'TVNORMA':
                        log.debug("\tRechazo BUS TV NORMA")
                        console.log("\tRechazo BUS TV NORMA failure")
                        let validacionTVNorma = ruleResult.conditions.all[0].result
                        if (validacionTVNorma) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por Tipo Vehiculo en Norma')
                        }
                        break;
                    case 'BUSOK':
                        log.debug("\tRechazo BUS RNT")
                        console.log("\tRechazo BUS RNT failure")
                        //verificar condicion de rechazo por RNT
                        let resultadoRNTNoEncontrado = ruleResult.conditions.any[0].result
                        if(resultadoRNTNoEncontrado) {
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

                        break;
                    default:
                        console.log("\tRechazo no detectado, evento: failure " + event.type)
                        log.debug("\tRechazo no detectado, evento: " + event.type)
                        break;
                }
            } catch (e) {
                console.log("\tError buscando rechazo: failure " + e)
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
            try {
                switch(event.type) {
                    case 'propietario':
                        log.debug("\tRechazo BUS Propietario")
                        console.log("\tRechazo BUS Propietario")
                        let validacionrutPropietario = ruleResult.conditions.any[0].result;
                        console.log("Revisando validacionrutPropietario: " + validacionrutPropietario)

                        //revisar meratenencia para agregar documentos a solicitar
                        let resultadoMerotenedor = ruleResult.conditions.any[1].all[0].result
                        let resultadoLeasing = ruleResult.conditions.any[1].all[1].result
                        console.log("Revisando resultadoMerotenedor: " + resultadoMerotenedor)
                        console.log("Revisando resultadoLeasing: " + resultadoLeasing)
                        
                        //revisar Comunidad para agregar documentos a solicitar
                        let resultadoRutPerteneceComunidad = ruleResult.conditions.any[2].all[0].result
                        let resultadoComunidad = ruleResult.conditions.any[2].all[1].result
                        console.log("Revisando resultadoRutPerteneceComunidad: " + resultadoRutPerteneceComunidad)
                        console.log("Revisando resultadoComunidad: " + resultadoComunidad)
                        
                        if (validacionrutPropietario) {
                            log.debug("\tRevisando Propietario")
                            console.log("\tRevisando Propietario")
                            //Documentos obligatorios
                            docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                            docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                            //Documentos adicionales opcionales
                            docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                        }else{
                            if(resultadoLeasing || resultadoMerotenedor){
                                log.debug("\tRevisando Merotenedor")
                                console.log("\tRevisando Merotenedor")
                                //Documentos obligatorios
                                docs.push({codigo: config.documents.V03.code, descripcion: config.documents.V03.description})
                                docs.push({codigo: config.documents.V05.code, descripcion: config.documents.V05.description})
                                docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                                docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                                //Documentos adicionales opcionales
                                docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                            }
                            if(resultadoRutPerteneceComunidad || resultadoComunidad) {
                                log.debug("\tRevisando Comunidad")
                                console.log("\tRevisando Comunidad")
                                //Documentos obligatorios
                                docs.push({codigo: config.documents.V21.code, descripcion: config.documents.V21.description})
                                docs.push({codigo: config.documents.V36.code, descripcion: config.documents.V36.description})
                                docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                                docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                                //Documentos adicionales opcionales
                                docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                            }
                        }

                        docs.push({codigo : config.documents.V02.code, descripcion: config.documents.V02.description},
                            {codigo:config.documents.V03.code, descripcion: config.documents.V03.description})
                            
                        break;
                    case 'antiguedad':
                        log.debug("\tRechazo BUS Antiguedad")
                        console.log("\tRechazo BUS Antiguedad")
                        let validacionAntiguedad = ruleResult.conditions.all[0].result
                        console.log("validacion validacionAntiguedad: " + validacionAntiguedad)

                        if (!validacionAntiguedad) {
                            continua.estado = false
                            continua.lstRechazos.push('Vehículo rechazado por antigüedad')   
                        }
                        break;
                    case 'rt':
                        log.debug("\tRechazo BUS RT")
                        console.log("\tRechazo BUS RT")
                        let validacionResultadoRT = ruleResult.conditions.all[0].result
                        let validacionVigenciaRT = ruleResult.conditions.all[1].result

                        log.trace("valor de la vigencia " + validacionVigenciaRT)
                        console.log("valor de la vigencia " + validacionVigenciaRT)
                        console.log("resultado de la vigencia " + validacionResultadoRT)
                        if (!validacionVigenciaRT || !validacionResultadoRT) {
                            //Documentos obligatorios
                            docs.push({codigo: config.documents.V13.code, descripcion: config.documents.V13.description},
                                      {codigo: config.documents.V08.code, descripcion: config.documents.V08.description}) 
                            //Documentos adicionales opcionales
                            docsOpcionales.push({codigo: config.documents.V19.code, descripcion: config.documents.V19.description}) 
                        }
                        break;
                    case 'TVNORMA':
                        log.debug("\tRechazo BUS TV NORMA")
                        console.log("\tRechazo BUS TV NORMA")
                        let validacionTVNorma = ruleResult.conditions.all[0].result
                        console.log("validacion TV NORMA " + validacionTVNorma)

                        if (validacionTVNorma) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por Tipo Vehiculo en Norma')
                        }
                        break;
                    case 'BUSOK':
                        log.debug("\tRechazo BUS RNT")
                        console.log("\tRechazo BUS RNT")
                        //verificar condicion de rechazo por RNT
                        let resultadoRNTNoEncontrado = ruleResult.conditions.any[0].result

                        console.log("validacion Rechazo BUS RNT resultadoRNTNoEncontrado: " + resultadoRNTNoEncontrado)
                        if(resultadoRNTNoEncontrado) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por existir en RNT previamente')
                        }
                        let resultadoRNTCanceladoTraslado = ruleResult.conditions.any[1].all[0].result
                        let resultadoRNTCanceladoTipoTraslado = ruleResult.conditions.any[1].all[1].result
                        let resultadoRNTCanceladoTrasladoRegion = ruleResult.conditions.any[1].all[2].result
                        console.log("validacion Rechazo BUS RNT resultadoRNTCanceladoTraslado: " + resultadoRNTCanceladoTraslado)
                        console.log("validacion Rechazo BUS RNT resultadoRNTCanceladoTipoTraslado: " + resultadoRNTCanceladoTipoTraslado)
                        console.log("validacion Rechazo BUS RNT resultadoRNTCanceladoTrasladoRegion: " + resultadoRNTCanceladoTrasladoRegion)
                        if(!resultadoRNTCanceladoTraslado && !resultadoRNTCanceladoTipoTraslado && !resultadoRNTCanceladoTrasladoRegion) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por Tipo de Cancelacion Traslado')
                        }
                        let resultadoRNTCanceladoCategoria = ruleResult.conditions.any[2].all[0].result
                        let resultadoRNTCanceladoTipoCategoria = ruleResult.conditions.any[2].all[1].result
                        let resultadoRNTCanceladoCategoriaAnterior = ruleResult.conditions.any[2].all[2].result
                        console.log("validacion Rechazo BUS RNT resultadoRNTCanceladoCategoria: " + resultadoRNTCanceladoCategoria)
                        console.log("validacion Rechazo BUS RNT resultadoRNTCanceladoTipoCategoria: " + resultadoRNTCanceladoTipoCategoria)
                        console.log("validacion Rechazo BUS RNT resultadoRNTCanceladoCategoriaAnterior: " + resultadoRNTCanceladoCategoriaAnterior)
                        if(!resultadoRNTCanceladoCategoria && !resultadoRNTCanceladoTipoCategoria && !resultadoRNTCanceladoCategoriaAnterior) {
                            continua.estado = false
                            continua.lstRechazos.push('Rechazo por Tipo de Cancelacion Cambio Categoria')
                        }

                        break;
                    default:
                        console.log("\tRechazo no detectado, evento: " + event.type)
                        log.debug("\tRechazo no detectado, evento: " + event.type)
                        break;
                }
            } catch (e) {
                console.log("\tError buscando rechazo: " + e)
                log.error("\tError buscando rechazo: " + e)
                continua.estado = false                
            }
        })
    }
}