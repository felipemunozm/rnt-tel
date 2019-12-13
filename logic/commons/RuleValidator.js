const log = require('../../log')
const config = require('../../config')

module.exports = {
    validacionFlota: (datosVehiculo, tipoValidacion) => {
        let documentos = [];
        //--------------------------------------------------------------------------------------------------------------------
        //VALIDACIONES BUSES, TAXIS
        //-------------------------------------------------------------------------------------------------------------------

        try {
            documentos = {ppu: datosVehiculo.solicitud.ppu ,docs: [], docsOpcionales: [], continua: {estado: [], lstRechazos: []}}
            documentos.continua.estado = true

            //VALIDACIÓN PROPIETARIO
            let validacionrutPropietario = datosVehiculo.solicitud.rutPropietario == datosVehiculo.registrocivil.rutPropietario ? true : false;

            //revisar meratenencia para agregar documentos a solicitar
            let resultadoMerotenedor = datosVehiculo.solicitud.rutPropietario == datosVehiculo.registrocivil.rutMerotenedor ? true : false;
            let resultadoLeasing = datosVehiculo.registrocivil.leasing == true ? true : false
                    
            //revisar Comunidad para agregar documentos a solicitar
            let resultadoRutPerteneceComunidad = datosVehiculo.registrocivil.rutPropietario.includes(datosVehiculo.solicitud.rutPropietario) ? true : false;
            let resultadoComunidad = datosVehiculo.registrocivil.comunidad == true ? true : false
                    
            if (validacionrutPropietario) {
                log.debug("\tRevisando Propietario")
                if (tipoValidacion == "BUSES") {
                    //Documentos obligatorios BUSES
                    documentos.docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                    documentos.docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                    //Documentos adicionales opcionales BUSES
                    documentos.docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                }
                
            }else{
                if(resultadoLeasing && resultadoMerotenedor){
                    log.debug("\tRevisando Merotenedor")
                    if (tipoValidacion == "BUSES") {
                        //Documentos obligatorios BUSES
                        documentos.docs.push({codigo: config.documents.V03.code, descripcion: config.documents.V03.description})
                        documentos.docs.push({codigo: config.documents.V05.code, descripcion: config.documents.V05.description})
                        documentos.docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                        documentos.docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                        //Documentos adicionales opcionales BUSES
                        documentos.docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                    }
                }
                if(resultadoRutPerteneceComunidad && resultadoComunidad ) {
                    log.debug("\tRevisando Comunidad")
                    if (tipoValidacion == "BUSES") {
                        //Documentos obligatorios
                        documentos.docs.push({codigo: config.documents.V21.code, descripcion: config.documents.V21.description})
                        documentos.docs.push({codigo: config.documents.V36.code, descripcion: config.documents.V36.description})
                        documentos.docs.push({codigo: config.documents.V28.code, descripcion: config.documents.V28.description})
                        documentos.docs.push({codigo: config.documents.V35.code, descripcion: config.documents.V35.description})
                        //Documentos adicionales opcionales
                        documentos.docsOpcionales.push({codigo: config.documents.V40.code, descripcion: config.documents.V40.description})
                    }
                }
            }

            documentos.docs.push({codigo : config.documents.V02.code, descripcion: config.documents.V02.description},
            {codigo:config.documents.V03.code, descripcion: config.documents.V03.description})
            
            //VALIDACIÓN DE ANTIGUEDAD
            let validacionAntiguedad = datosVehiculo.rnt.antiguedadMaxima < datosVehiculo.registrocivil.antiguedad ? true : false;

            if (validacionAntiguedad) {
                documentos.continua.estado = false
                documentos.continua.lstRechazos.push('Vehículo rechazado por antigüedad')   
            }
            
            //VALIDACIÓN DE SGPRT
            let validacionResultadoRT = datosVehiculo.sgprt.resultadoRT  == "Aprobada" ? true :false;
            let validacionVigenciaRT = datosVehiculo.sgprt.fechaVencimientoRT > datosVehiculo.solicitud.fechaSolicitud ? true : false;

            if (!validacionVigenciaRT && !validacionResultadoRT) {
                if (tipoValidacion == "BUSES") {
                    //Documentos obligatorios
                    documentos.docs.push({codigo: config.documents.V13.code, descripcion: config.documents.V13.description},
                                {codigo: config.documents.V08.code, descripcion: config.documents.V08.description}) 
                    //Documentos adicionales opcionales
                    documentos.docsOpcionales.push({codigo: config.documents.V19.code, descripcion: config.documents.V19.description})
                } 
            }

            //VALIDACIÓN TIPO DE VEHICULO
            if (tipoValidacion == "BUSES") {
                let validacionTVNorma = datosVehiculo.rnt.lstTipoVehiculoPermitidos.includes(datosVehiculo.registrocivil.tipoVehiculo) ? true: false;
                log.debug("\tRechazo BUS TV NORMA")
                if (validacionTVNorma) {
                    documentos.continua.estado = false
                    documentos.continua.lstRechazos.push('Rechazo por Tipo Vehiculo en Norma')
                }
            }
                
            //VALIDACIONES RNT
            //verificar condicion de rechazo por RNT
            let resultadoRNTNoEncontrado = datosVehiculo.rnt.estado == 0 ? true : false;
            log.debug("\tRechazo " + tipoValidacion + " RNT")

            if(!resultadoRNTNoEncontrado)  {
                documentos.continua.estado = false
                documentos.continua.lstRechazos.push('Rechazo por existir en RNT previamente')
            }

            if (tipoValidacion == "BUSES") {
                let resultadoRNTCanceladoTraslado = datosVehiculo.rnt.estado == 2 ? true : false;
                let resultadoRNTCanceladoTipoTraslado = datosVehiculo.rnt.tipoCancelacion == "TRASLADO DE REGIÓN" ? true : false;
                let resultadoRNTCanceladoTrasladoRegion = datosVehiculo.rnt.regionOrigen == datosVehiculo.solicitud.regionInscripcion ? true : false;
                if(resultadoRNTCanceladoTraslado && resultadoRNTCanceladoTipoTraslado && resultadoRNTCanceladoTrasladoRegion) {
                    documentos.continua.estado = false
                    documentos.continua.lstRechazos.push('Rechazo por Tipo de Cancelacion Traslado')
                }

                let resultadoRNTCanceladoCategoria = datosVehiculo.rnt.estado == 2 ? true : false;
                let resultadoRNTCanceladoTipoCategoria = datosVehiculo.rnt.tipoCancelacion == "CANCELACIÓN POR CAMBIO DE CATEGORÍA DE TRANSPORTE" ? true : false;
                let resultadoRNTCanceladoCategoriaAnterior = datosVehiculo.rnt.categoria != "PÚBLICO" ? true : false;
                if(resultadoRNTCanceladoCategoria && resultadoRNTCanceladoTipoCategoria && resultadoRNTCanceladoCategoriaAnterior) {
                    documentos.continua.estado = false
                    documentos.continua.lstRechazos.push('Rechazo por Tipo de Cancelacion Cambio Categoria')
                }
            }
        } catch (e) {
            log.error("\tError buscando rechazo: " + e)
            log.debug("\tError buscando rechazo: " + e)
            documentos.continua.estado = false
            documentos.continua.lstRechazos.push('Rechazo por Tipo de Cancelacion Cambio Categoria')
        }

        return documentos;
    }
}