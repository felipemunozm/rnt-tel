const log = require('../log')
const helper = require('./helper.logic')
const commons = require('./commons/RuleValidator')
const SolicitudServicio = require('../model/models.joi').models.SolicitudServicio
const registroCivil = require('../services/registro-civil.service')

module.exports = {
    /**
     *  @param {SolicitudServicio} inputValidarFlota
     */
    validarFlota: async(inputValidarFlota) => {
        let tipoValidacion = "ESCOLARES";
        let continua = { estado: true, lstRechazos: [] }
        let docs = []
        let docsOpcionales = []
        let datosVehiculo;
        let lstFlotaValidada = []
        let lstFlotaRechazada = []

        for (let i = 0; i < inputValidarFlota.lstPpuRut[i].length; i++) {
            const itemFlota = inputValidarFlota.lstPpuRut[i]
                //implementar como extraer data para llenar objeto para evaluar condiciones
            continua.lstRechazos = []
            continua.estado = true
            docs = []
            docsOpcionales = []

            let srcei = await registroCivil.obtenerDatos(itemFlota.ppu);
            let sgprtResponse = await commons.consumoServicioSgprt(itemFlota.ppu);

            //Recorre los documentos obtenidos de registro civil
            for (let index = 0; index < srcei.docs.length; index++) {
                docs.push(srcei.docs[index]);
            }

            //Recorre los documentos Opcionales obtenidos de registro civil
            for (let index = 0; index < srcei.docsOpcionales.length; index++) {
                docsOpcionales.push(srcei.docsOpcionales[index]);
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
            let dataRNT = await busesRepository.findInscripcionRNTData(inputValidarFlota.folio, inputValidarFlota.region, ppu, srcei.tipoVehi)
            log.trace('DataRNT para PPU ' + ppu + ": " + JSON.stringify(dataRNT))
                //otra consulta para determinar la Antiguedad Maxima permitida por tipo de vehiculo en el folio donde se desea inscribir
            log.trace('FechaPRT: ' + sgprtResponse.return.revisionTecnica.fechaVencimiento)

            datosVehiculo = {
                registrocivil: srcei,
                sgprt: {
                    resultadoRT: (sgprtResponse.return.revisionTecnica.resultado == 'A' && sgprtResponse.return.revisionesGases.revisionGas[sgprtResponse.return.revisionesGases.revisionGas.length - 1].resultado == 'A') ? 'Aprobada' : 'Rechazada',
                    fechaVencimientoRT: sgprtResponse.return.revisionTecnica.fechaVencimiento.getTime() != undefined ? sgprtResponse.return.revisionTecnica.fechaVencimiento : 0
                },
                rnt: {
                    estado: dataRNT.estado != undefined ? dataRNT.estado : 0, //No Encontrado = 0, Cancelado Definitivo = 3, VIGENTE = 1, Cancelado Temporal = 2 
                    tipoCancelacion: dataRNT.tipoCancelacion != undefined ? dataRNT.tipoCancelacion : "",
                    regionOrigen: dataRNT.regionOrigen != undefined ? dataRNT.regionOrigen : inputValidarFlota.region,
                    antiguedadMaxima: dataRNT.antiguedadMaxima != undefined ? dataRNT.antiguedadMaxima : 0,
                    lstTipoVehiculoPermitidos: dataRNT.lstTipoVehiculoPermitidos != undefined ? dataRNT.lstTipoVehiculoPermitidos : ['BUS', 'MINIBUS'],
                    categoria: dataRNT.categoria != undefined ? dataRNT.categoria : ""
                },
                solicitud: {
                    rutPropietario: itemFlota.rut,
                    regionInscripcion: inputValidarFlota.region,
                    ppu: itemFlota.ppu,
                    // ppureemplaza: inputValidarFlota.ppureemplaza != undefined ? inputValidarFlota.ppureemplaza : "",
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
            docs.push({ codigo: config.documents.V04.code, descripcion: config.documents.V04.description })

            //se revisa si procede la PPU para añadirla a lista de flota validada
            if (continua.estado === true) {
                lstFlotaValidada.push({ ppu: datosVehiculo.solicitud.ppu, validacion: true, documentosAdjuntar: docs, documentosOpcionales: docsOpcionales })
            } else {
                lstFlotaRechazada.push({ ppu: datosVehiculo.solicitud.ppu, validacion: false, mensaje: "PPU Rechazada", listaRechazos: continua.lstRechazos })
            }

            log.debug("datosVehiculo PPU: " + datosVehiculo.solicitud.ppu)

            continua.lstRechazos = []
            continua.estado = true
        }
        return {
            listaFlotaValidada: lstFlotaValidada,
            listaFlotaRechazada: lstFlotaRechazada,
            monto: helper.costoTramite(inputValidarFlota.cantidadRecorridos * lstFlotaValidada.length)
        }
    },

    /**
     * @param {SolicitudServicio} inputValidarFlota
     */
    validarServiciosFlota: async(inputValidarFlota) => {
        let tipoValidacion = "ESCOLARES";
        let continua = { estado: true, lstRechazos: [] }
        let docs = []
        let docsOpcionales = []
        let datosVehiculo;
        let lstFlotaValidada = []
        let lstFlotaRechazada = []
        let documentos = []

        for (let i = 0; i < inputValidarFlota.lstPpuRut.length; i++) {
            //implementar como extraer data para llenar objeto para evaluar condiciones
            continua.lstRechazos = []
            continua.estado = true
            docs = []
            docsOpcionales = []

            try {
                let ppu = inputValidarFlota.lstPpuRut[i].ppu
                let srceiResponse = await commons.consumoServicioRegistroCivil(ppu);
                let sgprtResponse = await commons.consumoServicioSgprt(ppu);

                const srcei = srceiResponse.return;

                //Recorre los documentos obtenidos de registro civil
                for (let index = 0; index < srcei.docs.length; index++) {
                    docs.push(srcei.docs[index]);
                }

                //Recorre los documentos Opcionales obtenidos de registro civil
                for (let index = 0; index < srcei.docsOpcionales.length; index++) {
                    docsOpcionales.push(srcei.docsOpcionales[index]);
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
                let dataRNT = await taxisRepository.findInscripcionRNTData(inputValidarFlota.folio, inputValidarFlota.region, ppu, srcei.tipoVehi)
                log.trace('DataRNT para PPU ' + ppu + ": " + JSON.stringify(dataRNT))
                    //otra consulta para determinar la Antiguedad Maxima permitida por tipo de vehiculo en el folio donde se desea inscribir
                log.trace('FechaPRT: ' + sgprtResponse.return.revisionTecnica.fechaVencimiento)
                datosVehiculo = {
                    registrocivil: {
                        rutPropietario: srcei.propieActual.propact.itemPropact.length > 1 ? srceiUtils.getArrayPropietarioComunidad(srcei.propieActual.propact.itemPropact) : srcei.propieActual.propact.itemPropact[0].rut,
                        antiguedad: (srcei.aaFabric > (new Date()).getFullYear()) ? 0 : (Number((new Date()).getFullYear()) - Number(srcei.aaFabric)),
                        tipoVehiculo: srcei.tipoVehi != undefined ? srcei.tipoVehi : "",
                        leasing: srceiUtils.determinarLeasing(srcei.limita) != undefined ? srceiUtils.determinarLeasing(srcei.limita) : "",
                        rutMerotenedor: srceiUtils.getRutMerotenedor(srcei.limita) != undefined ? srceiUtils.getRutMerotenedor(srcei.limita) : "",
                        comunidad: srcei.propieActual.propact.itemPropact.length > 1 ? true : false,
                        status: srcei.status != undefined ? srcei.status : ""
                    },
                    sgprt: {
                        resultadoRT: (sgprtResponse.return.revisionTecnica.resultado == 'A' && sgprtResponse.return.revisionesGases.revisionGas[sgprtResponse.return.revisionesGases.revisionGas.length - 1].resultado == 'A') ? 'Aprobada' : 'Rechazada',
                        fechaVencimientoRT: sgprtResponse.return.revisionTecnica.fechaVencimiento != undefined ? sgprtResponse.return.revisionTecnica.fechaVencimiento : 0
                    },
                    rnt: {
                        estado: dataRNT.estado != undefined ? dataRNT.estado : 0, //No Encontrado = 0, Cancelado Definitivo = 3, VIGENTE = 1, Cancelado Temporal = 2 
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
                } else {
                    continua.estado = false
                    continua.lstRechazos.push('Rechazo por Tipo Vehiculo en Norma')
                }

                //--------------------------------------------------------------------------------------------------------------------

                //se revisa si procede la PPU para añadirla a lista de flota validada
                if (continua.estado === true) {
                    lstFlotaValidada.push({ ppu: datosVehiculo.solicitud.ppu, validacion: true, documentosAdjuntar: docs, documentosOpcionales: docsOpcionales })
                } else {
                    lstFlotaRechazada.push({ ppu: datosVehiculo.solicitud.ppu, validacion: false, mensaje: "PPU Rechazada", listaRechazos: continua.lstRechazos })
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
        let monto = (inputValidarFlota.CantidadRecorridos * lstFlotaValidada.length) * 530 + (790 - 530) //se cobra al primero 790 y todos los demas 530
        let response = { listaFlotaValidada: lstFlotaValidada, listaFlotaRechazada: lstFlotaRechazada, monto: monto }
        return response
    }
}