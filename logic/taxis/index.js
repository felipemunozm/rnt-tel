const taxisRepository = require('../../repository/taxis')
const log = require('../../log')
const rntTramitesMap= require('../../config')
const config = require('../../config')
const services = require('../../utils/serviciosGateway')
const srceiUtils = require('../../utils/SRCeIUtils')
const commons = require('../commons/RuleValidator')
module.exports = {
    getTest: () => {
        return {mensaje: "ejecucion de logica taxis exiosa", code: "OK"}
    },
    getServiciosVigentesInscritosPorRutResponsable: (rut_responsable) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = taxisRepository.getServiciosVigentesInscritosPorRutResponsable(rut_responsable)
        if(!Array.isArray(servicios)  || servicios.length==0) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach( (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.ID_REGION) 
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                   id_tipo_servicio : servicioDB.ID_TIPO_SERVICIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                    id_tipo_servicio : servicioDB.ID_TIPO_SERVICIO
                }) 
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    },
    getServiciosVigentesInscritosPorRutResponsableAndRutMandatario: (rut_responsable, rut_mandatario) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = taxisRepository.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario(rut_responsable, rut_mandatario)
        if(!Array.isArray(servicios) || servicios.length==0) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach( (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.ID_REGION)
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.ID_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    },
    findServiciosByRepresentanteLegalAndEmpresa: (rut_empresa, rut_representante_legal) => {
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = taxisRepository.findServiciosByRepresentanteLegalAndEmpresa(rut_empresa, rut_representante_legal)
        if(!Array.isArray(servicios) || servicios.length==0) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach( (servicioDB) => {
            //Extraer recorridos de los servicios asociados
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO,servicioDB.COD_REGION) 
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    tipo_servicio: servicioDB.TIPO_SERVICIO
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    },
    findServiciosByMandatarioAndRepresentanteAndEmpresa: (rut_empresa, rut_representante, rut_solicitante) => {
        let response = {
            servicios: []
        }
        let servicios = taxisRepository.findServiciosByMandatarioAndRepresentanteAndEmpresa(rut_empresa, rut_representante, rut_solicitante)
        if(!Array.isArray(servicios) || servicios.length==0) {
            response.estado = 'RECHAZADO'
            response.mensaje = 'Usted no se encuentra habilitado en el Registro Nacional de Transportes para realizar este Trámite, dirígase a la Seremitt mas cercana.'
            delete response.servicios
            return response
        }
        response.estado = 'APROBADO'
        response.mensaje = 'Habilitado en el Registro Nacional de Transportes'
        servicios.forEach((servicioDB) => {
            //Extraer Recorridos
            let recorridos = taxisRepository.findRecorridosByFolioRegion(servicioDB.FOLIO, servicioDB.COD_REGION)
            if(recorridos.length > 0){
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO,
                    recorridos: recorridos
                })
            }else{
                response.servicios.push({
                    folio:servicioDB.FOLIO,
                    region: servicioDB.REGION,
                    cod_region: servicioDB.COD_REGION,
                    rut_responsable: servicioDB.RUT_RESPONSABLE,
                    nombre_responsable: servicioDB.NOMBRE_RESPONSABLE,
                    rut_representante: servicioDB.RUT_REPRESENTANTE,
                    rut_mandatario: servicioDB.RUT_MANDATARIO,
                    tipo_servicio: servicioDB.TIPO_SERVICIO
                })
            }
        })
        if(response.servicios.length == 0) {
            delete response.servicios
        }
        return response
    } ,
    //psalas empresa -solicitante
    getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis:   (id_region,rut_representante,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.taxis.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios =   taxisRepository.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis(id_region,rut_representante,rut_solicitante,idtramite)
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
    getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis:   (id_region,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.taxis.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios =   taxisRepository.getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis(id_region,rut_solicitante,idtramite)
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

    getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioTaxis:   (id_region,RUT_RESPONSABLE,rut_solicitante) => {
        let idtramite =rntTramitesMap.rntTramitesMap.taxis.IdsTramites[0]
        let response = {
            estado: '',
            mensaje: '',
            servicios: []
        }
        let servicios = taxisRepository.getAutorizadoPorPersonaMandatarioParaTramiteInscripcionServicioTaxis(id_region,RUT_RESPONSABLE,rut_solicitante,idtramite)
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
    validarFlota: async (inputValidarFlota) => {
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
                let ppu = inputValidarFlota.lstPpuRut[i].ppu
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
                let dataRNT = await taxisRepository.findInscripcionRNTData(inputValidarFlota.folio, inputValidarFlota.region, ppu, srceiResponse.return.tipoVehi,inputValidarFlota.tipoingreso)
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
                        id_tipoCancelacion: dataRNT.id_tipoCancelacion != undefined ? dataRNT.id_tipoCancelacion : "", // psalas
                        regionOrigen: dataRNT.regionOrigen != undefined ? dataRNT.regionOrigen : inputValidarFlota.region,
                        antiguedadMaxima: dataRNT.antiguedadMaxima != undefined ? dataRNT.antiguedadMaxima : 0,
                        lstTipoVehiculoPermitidos: dataRNT.lstTipoVehiculoPermitidos != undefined ? dataRNT.lstTipoVehiculoPermitidos : ["AUTOMOVIL"],
                        categoria: dataRNT.categoria != undefined ? dataRNT.categoria : "",
                        id_tipoCategoria: dataRNT.id_tipoCategoria != undefined ? dataRNT.id_tipoCategoria : ""
                        
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
                log.debug('DataRNT para PPU ' + ppu + ": " + JSON.stringify(dataRNT))

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