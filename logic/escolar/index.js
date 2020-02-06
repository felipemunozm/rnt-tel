const escolarRepository = require("../../repository/escolar")
const log = require('../../log')
const rntTramitesMap= require('../../config')

module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica escolar exiosa", code: "OK"}
    },
     //psalas empresa -solicitante
     getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar:   (id_region,rut_representante,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.escolares.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = escolarRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar(id_region,rut_representante,rut_solicitante,idtramite)
        if(!Array.isArray(servicios) || servicios.length==0) {
            response.estado = servicios.estado
            response.mensaje = servicios.mensaje
            delete response.servicios
            return response
        }else
        { 
            response.estado = 'APROBADO'
            response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
            servicios.forEach((servicioDB) => {
                response.servicios.push({
                    ID_TIPO_SERVICIO:servicioDB.ID_TIPO_SERVICIO,
                    tiposervicio: servicioDB.TIPOSERVICIO
                })
              });
              if(response.servicios.length == 0) {
                delete response.servicios
            }
            return response

        }
                               
    },
    //psalas persona - solicitante
    getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar:   (id_region,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.escolares.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios =  escolarRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar(id_region,rut_solicitante,idtramite)
        if(!Array.isArray(servicios) || servicios.length==0) {
            response.estado = servicios.estado
            response.mensaje = servicios.mensaje
            delete response.servicios
            return response
        }else
        { 
            response.estado = 'APROBADO'
            response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
            servicios.forEach((servicioDB) => {
                response.servicios.push({
                    ID_TIPO_SERVICIO:servicioDB.ID_TIPO_SERVICIO,
                    tiposervicio: servicioDB.TIPOSERVICIO
                })
              });
              if(response.servicios.length == 0) {
                delete response.servicios
            }
            return response

        }
         
    },
    //psalas persona - mandatario
   getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioEscolar:   (id_region,RUT_RESPONSABLE,rut_solicitante) => {
    let idtramite =rntTramitesMap.rntTramitesMap.escolares.IdsTramites[0]
    let response = {
        estado: '',
        mensaje: '',
        servicios: []
    }
    let servicios = escolarRepository.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioEscolar(id_region,RUT_RESPONSABLE,rut_solicitante,idtramite)
    if(!Array.isArray(servicios) || servicios.length==0) {
        response.estado = servicios.estado
        response.mensaje = servicios.mensaje
        delete response.servicios
        return response
    }else
    { 
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach((servicioDB) => {
            response.servicios.push({
                ID_TIPO_SERVICIO:servicioDB.ID_TIPO_SERVICIO,
                tiposervicio: servicioDB.TIPOSERVICIO
            })
          });
          if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response

    }
    }, 
    //@param: InputValidarFlota class
    validarFlota: async (inputValidarFlota ) => {
        let tipoValidacion = "BUSES";
        let continua = {estado: true, lstRechazos: []}
        let docs = []
        let docsOpcionales = []
        let datosVehiculo;
        let lstFlotaValidada = []
        let lstFlotaRechazada = []
        
        for(let i = 0; i < inputValidarFlota.lstPpuRut.length; i++) {
            //implementar como extraer data para llenar objeto para evaluar condiciones
            continua.lstRechazos = []
            continua.estado = true
            docs = []
            docsOpcionales = []

            try {        
                let ppu =  inputValidarFlota.lstPpuRut[i].ppu
                let srceiResponse = await commons.consumoServicioRegistroCivil(ppu);
                let sgprtResponse = await commons.consumoServicioSgprt(ppu);

                //Recorre los documentos obtenidos de registro civil
                for (let index = 0; index < srceiResponse.return.docs.length; index++) {
                    docs.push(srceiResponse.return.docs[index]);
                }

                //Recorre los documentos Opcionales obtenidos de registro civil
                for (let index = 0; index < srceiResponse.return.docsOpcionales.length; index++) {
                    docsOpcionales.push(srceiResponse.return.docsOpcionales[index]);
                }

                //Recorre los documentos obtenidos obtenidos de sgprt
                for (let index = 0; index < sgprtResponse.return.docs.length; index++) {
                    docs.push(sgprtResponse.return.docs[index]);
                }

                //Recorre los documentos Opcionales obtenidos de sgprt
                for (let index = 0; index < sgprtResponse.return.docsOpcionales.length; index++) {
                    docsOpcionales.push(sgprtResponse.return.docsOpcionales[index]);
                }
                //para datos RNT, se necesitan las consultas por PPU, para determinar si existe o no y los estados del vehiculo, la region de origen del PPU y la categoria de transporte ne caso de existir.
                let dataRNT = await busesRepository.findInscripcionRNTData(inputValidarFlota.folio, inputValidarFlota.region, ppu, srceiResponse.return.tipoVehi)
                log.trace('DataRNT para PPU ' + ppu + ": " + JSON.stringify(dataRNT))
                //otra consulta para determinar la Antiguedad Maxima permitida por tipo de vehiculo en el folio donde se desea inscribir
                log.trace('FechaPRT: ' + sgprtResponse.return.revisionTecnica.fechaVencimiento)
                datosVehiculo = {
                    registrocivil: {
                        rutPropietario: srceiResponse.return.propieActual.propact.itemPropact.length > 1 ? srceiUtils.getArrayPropietarioComunidad(srceiResponse.return.propieActual.propact.itemPropact) : srceiResponse.return.propieActual.propact.itemPropact[0].rut ,
                        antiguedad: (srceiResponse.return.aaFabric > (new Date()).getFullYear()) ? 0 : (Number((new Date()).getFullYear()) - Number(srceiResponse.return.aaFabric)),
                        tipoVehiculo: srceiResponse.return.tipoVehi != undefined ? srceiResponse.return.tipoVehi : "",
                        leasing: srceiUtils.determinarLeasing(srceiResponse.return.limita) != undefined ? srceiUtils.determinarLeasing(srceiResponse.return.limita) : "",
                        rutMerotenedor: srceiUtils.getRutMerotenedor(srceiResponse.return.limita) != undefined ? srceiUtils.getRutMerotenedor(srceiResponse.return.limita) : "",
                        comunidad: srceiResponse.return.propieActual.propact.itemPropact.length > 1 ? true : false,
                        status: srceiResponse.return.status != undefined ? srceiResponse.return.status : ""
                    },
                    sgprt: {
                        resultadoRT: (sgprtResponse.return.revisionTecnica.resultado == 'A' && sgprtResponse.return.revisionesGases.revisionGas[sgprtResponse.return.revisionesGases.revisionGas.length - 1].resultado == 'A') ? 'Aprobada' : 'Rechazada',
                        fechaVencimientoRT: sgprtResponse.return.revisionTecnica.fechaVencimiento.getTime() != undefined ? sgprtResponse.return.revisionTecnica.fechaVencimiento : 0
                    },
                    rnt: {
                        estado: dataRNT.estado != undefined ? dataRNT.estado : 0,//No Encontrado = 0, Cancelado Definitivo = 3, VIGENTE = 1, Cancelado Temporal = 2 
                        tipoCancelacion: dataRNT.tipoCancelacion != undefined ? dataRNT.tipoCancelacion : "",
                        regionOrigen: dataRNT.regionOrigen != undefined ? dataRNT.regionOrigen : inputValidarFlota.region,
                        antiguedadMaxima: dataRNT.antiguedadMaxima != undefined ? dataRNT.antiguedadMaxima : 0,
                        lstTipoVehiculoPermitidos: dataRNT.lstTipoVehiculoPermitidos != undefined ? dataRNT.lstTipoVehiculoPermitidos : ['BUS','MINIBUS'],
                        categoria: dataRNT.categoria != undefined ? dataRNT.categoria : ""
                    },
                    solicitud: {
                        rutPropietario: inputValidarFlota.lstPpuRut[i].rut != undefined ? inputValidarFlota.lstPpuRut[i].rut : "",
                        regionInscripcion: inputValidarFlota.region != undefined ? inputValidarFlota.region : "",
                        ppu: inputValidarFlota.lstPpuRut[i].ppu != undefined ? inputValidarFlota.lstPpuRut[i].ppu : "",
                        ppureemplaza: inputValidarFlota.ppureemplaza != undefined ? inputValidarFlota.ppureemplaza : "",
                        fechaSolicitud: (new Date()).getTime()
                    }
                }
                log.debug("datosVehiculo PPU: " + datosVehiculo.solicitud.ppu)
                
                let documentos = commons.validacionFlota(datosVehiculo, tipoValidacion);

                //Recorre los documentos
                for (let index = 0; index < documentos.docs.length; index++) {
                    docs.push(documentos.docs[index]);
                }

                //Recorre los documentos Opcionales
                for (let index = 0; index < documentos.docsOpcionales.length; index++) {
                    docsOpcionales.push(documentos.docsOpcionales[index]);
                }
                continua.estado = documentos.continua.estado;
                if (typeof documentos.continua.lstRechazos !== "undefined") {
                    continua.lstRechazos = documentos.continua.lstRechazos
                }
                
                //--------------------------------------------------------------------------------------------------------------------
                //documentos obligatorios para todos los casos: V04
                docs.push({codigo: config.documents.V04.code, descripcion: config.documents.V04.description})
                
                //se revisa si procede la PPU para añadirla a lista de flota validada
                if(continua.estado === true) {
                    lstFlotaValidada.push({ppu: datosVehiculo.solicitud.ppu,validacion: true, documentosAdjuntar: docs, documentosOpcionales: docsOpcionales})
                } else {
                    lstFlotaRechazada.push({ppu: datosVehiculo.solicitud.ppu,validacion: false, mensaje: "PPU Rechazada",listaRechazos: continua.lstRechazos})
                }

                log.debug("datosVehiculo PPU: " + datosVehiculo.solicitud.ppu)
                
                continua.lstRechazos = []
                continua.estado = true
                docs = []
                docsOpcionales = []
            } catch (e) {
                log.error("Error en logica de negocio: " + e)
            }    
        }
        let monto = (inputValidarFlota.cantidadRecorridos * lstFlotaValidada.length ) * 530 + (790-530) //se cobra al primero 790 y todos los demas 530
        let response = {listaFlotaValidada: lstFlotaValidada, listaFlotaRechazada: lstFlotaRechazada, monto: monto}
        return response
    },
    InputValidarServiciosFlota: async (inputValidarFlota ) => {
        let tipoValidacion = "TAXIS";
        let continua = {estado: true, lstRechazos: []}
        let docs = []
        let docsOpcionales = []
        let datosVehiculo;
        let lstFlotaValidada = []
        let lstFlotaRechazada = []
        let documentos = []
        
        for(let i = 0; i < inputValidarFlota.lstPpuRut.length; i++) {
            //implementar como extraer data para llenar objeto para evaluar condiciones
            continua.lstRechazos = []
            continua.estado = true
            docs = []
            docsOpcionales = []

            try {        
                let ppu =  inputValidarFlota.lstPpuRut[i].ppu
                let srceiResponse = await commons.consumoServicioRegistroCivil(ppu);
                let sgprtResponse = await commons.consumoServicioSgprt(ppu);

                //Recorre los documentos obtenidos de registro civil
                for (let index = 0; index < srceiResponse.return.docs.length; index++) {
                    docs.push(srceiResponse.return.docs[index]);
                }

                //Recorre los documentos Opcionales obtenidos de registro civil
                for (let index = 0; index < srceiResponse.return.docsOpcionales.length; index++) {
                    docsOpcionales.push(srceiResponse.return.docsOpcionales[index]);
                }

                //Recorre los documentos obtenidos obtenidos de sgprt
                for (let index = 0; index < sgprtResponse.return.docs.length; index++) {
                    docs.push(sgprtResponse.return.docs[index]);
                }

                //Recorre los documentos Opcionales obtenidos de sgprt
                for (let index = 0; index < sgprtResponse.return.docsOpcionales.length; index++) {
                    docsOpcionales.push(sgprtResponse.return.docsOpcionales[index]);
                }
                //para datos RNT, se necesitan las consultas por PPU, para determinar si existe o no y los estados del vehiculo, la region de origen del PPU y la categoria de transporte ne caso de existir.
                let dataRNT = await taxisRepository.findInscripcionRNTData(inputValidarFlota.folio, inputValidarFlota.region, ppu, srceiResponse.return.tipoVehi)
                log.trace('DataRNT para PPU ' + ppu + ": " + JSON.stringify(dataRNT))
                //otra consulta para determinar la Antiguedad Maxima permitida por tipo de vehiculo en el folio donde se desea inscribir
                log.trace('FechaPRT: ' + sgprtResponse.return.revisionTecnica.fechaVencimiento)
                datosVehiculo = {
                    registrocivil: {
                        rutPropietario: srceiResponse.return.propieActual.propact.itemPropact.length > 1 ? srceiUtils.getArrayPropietarioComunidad(srceiResponse.return.propieActual.propact.itemPropact) : srceiResponse.return.propieActual.propact.itemPropact[0].rut ,
                        antiguedad: (srceiResponse.return.aaFabric > (new Date()).getFullYear()) ? 0 : (Number((new Date()).getFullYear()) - Number(srceiResponse.return.aaFabric)),
                        tipoVehiculo: srceiResponse.return.tipoVehi != undefined ? srceiResponse.return.tipoVehi : "",
                        leasing: srceiUtils.determinarLeasing(srceiResponse.return.limita) != undefined ? srceiUtils.determinarLeasing(srceiResponse.return.limita) : "",
                        rutMerotenedor: srceiUtils.getRutMerotenedor(srceiResponse.return.limita) != undefined ? srceiUtils.getRutMerotenedor(srceiResponse.return.limita) : "",
                        comunidad: srceiResponse.return.propieActual.propact.itemPropact.length > 1 ? true : false,
                        status: srceiResponse.return.status != undefined ? srceiResponse.return.status : ""
                    },
                    sgprt: {
                        resultadoRT: (sgprtResponse.return.revisionTecnica.resultado == 'A' && sgprtResponse.return.revisionesGases.revisionGas[sgprtResponse.return.revisionesGases.revisionGas.length - 1].resultado == 'A') ? 'Aprobada' : 'Rechazada',
                        fechaVencimientoRT: sgprtResponse.return.revisionTecnica.fechaVencimiento != undefined ? sgprtResponse.return.revisionTecnica.fechaVencimiento : 0
                    },
                    rnt: {
                        estado: dataRNT.estado != undefined ? dataRNT.estado : 0,//No Encontrado = 0, Cancelado Definitivo = 3, VIGENTE = 1, Cancelado Temporal = 2 
                        tipoCancelacion: dataRNT.tipoCancelacion != undefined ? dataRNT.tipoCancelacion : "",
                        regionOrigen: dataRNT.regionOrigen != undefined ? dataRNT.regionOrigen : inputValidarFlota.region,
                        antiguedadMaxima: dataRNT.antiguedadMaxima != undefined ? dataRNT.antiguedadMaxima : 0,
                        lstTipoVehiculoPermitidos: dataRNT.lstTipoVehiculoPermitidos != undefined ? dataRNT.lstTipoVehiculoPermitidos : ["AUTOMOVIL"],
                        categoria: dataRNT.categoria != undefined ? dataRNT.categoria : ""
                    },
                    solicitud: {
                        rutPropietario: inputValidarFlota.lstPpuRut[i].rut != undefined ? inputValidarFlota.lstPpuRut[i].rut : "",
                        regionInscripcion: inputValidarFlota.region != undefined ? inputValidarFlota.region : "",
                        ppu: inputValidarFlota.lstPpuRut[i].ppu != undefined ? inputValidarFlota.lstPpuRut[i].ppu : "",
                        ppureemplaza: inputValidarFlota.ppureemplaza != undefined ? inputValidarFlota.ppureemplaza : "",
                        fechaSolicitud: (new Date()).getTime()
                    }
                }
                log.debug("datosVehiculo PPU: " + datosVehiculo.solicitud.ppu)
                
                if (datosVehiculo.registrocivil.tipoVehiculo == "AUTOMOVIL") {
                    //Realiza la validacion de la flota a partir de los datos obtenidos de RNT, SGPRT Y REGISTRO CIVIL
                    documentos = commons.validacionFlota(datosVehiculo, tipoValidacion);
                    
                    //Recorre los documentos
                    for (let index = 0; index < documentos.docs.length; index++) {
                        docs.push(documentos.docs[index]);
                    }

                    //Recorre los documentos Opcionales
                    for (let index = 0; index < documentos.docsOpcionales.length; index++) {
                        docsOpcionales.push(documentos.docsOpcionales[index]);
                    }
                    continua.estado = documentos.continua.estado;
                    if (typeof documentos.continua.lstRechazos !== "undefined") {
                        continua.lstRechazos = documentos.continua.lstRechazos
                    }
                }else{
                    continua.estado = false
                    continua.lstRechazos.push('Rechazo por Tipo Vehiculo en Norma')
                }   
                
                //--------------------------------------------------------------------------------------------------------------------
                
                //se revisa si procede la PPU para añadirla a lista de flota validada
                if(continua.estado === true) {
                    lstFlotaValidada.push({ppu: datosVehiculo.solicitud.ppu,validacion: true, documentosAdjuntar: docs, documentosOpcionales: docsOpcionales})
                } else {
                    lstFlotaRechazada.push({ppu: datosVehiculo.solicitud.ppu,validacion: false, mensaje: "PPU Rechazada",listaRechazos: continua.lstRechazos})
                }

                log.debug("datosVehiculo PPU: " + datosVehiculo.solicitud.ppu)
                
                continua.lstRechazos = []
                continua.estado = true
                docs = []
                docsOpcionales = []
            } catch (e) {
                log.error("Error en logica de negocio: " + e)
            }    
        }
        let monto = (inputValidarFlota.CantidadRecorridos * lstFlotaValidada.length ) * 530 + (790-530) //se cobra al primero 790 y todos los demas 530
        let response = {listaFlotaValidada: lstFlotaValidada, listaFlotaRechazada: lstFlotaRechazada, monto: monto}
        return response
    }
}