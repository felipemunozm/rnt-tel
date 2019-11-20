module.exports = {
    //conexion QA
    // db2ConectionString: process.env.RNTDN ? process.env.RNTDN : "DATABASE=RNT5;HOSTNAME=alamo.mtt.cl;UID=db2admin;PWD=**db2admin;PORT=50000;PROTOCOL=TCPIP",
    //conexion PRD
    db2ConectionString: "DATABASE=RNT5;HOSTNAME=alamo.mtt.cl;UID=db2admin;PWD=**db2admin;PORT=50000;PROTOCOL=TCPIP",
    //QA
    // rntTramitesMap: {
    //     buses: {
    //         IdsTramites: [22]
    //     },
    //     colectivos: {
    //         IdsTramites: [7]
    //     },
    //     escolares: {
    //         IdsTramites: [21]
    //     },
    //     privados: {
    //         IdsTramites: [23]
    //     },
    //     taxis: {
    //         IdsTramites: [24]
    //     }
    // },
    //PRODUCCION
    rntTramitesMap: {
        buses: {
            IdsTramites: [4]
        },
        colectivos: {
            IdsTramites: [2]
        },
        escolares: {
            IdsTramites: [6]
        },
        privados: {
            IdsTramites: [7]
        },
        taxis: {
            IdsTramites: [1]
        }
    },
    rntTipoServicioMap: {
        buses: {
            IdsTiposServicios: [2,3,5,7,9,11,12,13,14,15,16,17,18,26]
        },
        taxis: {
            IdsTiposServicios: [19,20,21,22,23,24]
        },
        escolares: {
            IdsTiposServicios: []
        },
        privados: {
            IdsTiposServicios: []
        }
    },
    validacionRules: {
        inscripcionVehiculo: {
            validaPropietarioRule: {
                conditions: {
                    any: [//validacion de propietario, considera casos de comunidad y leasing
                        {
                            fact: 'registrocivil',
                            path: '.rutPropietario',
                            operator: 'equal',
                            value: {
                                fact: 'solicitud',
                                path: '.rutPropietario'
                            }
                        },
                        {//valida si es leasing y busca el rut merotenedor para comparar con el rut propietario de la solicitud
                            all: [
                                {
                                    fact: 'registrocivil',
                                    path: '.rutMerotenedor',
                                    operator: 'equal',
                                    value: {
                                        fact: 'solicitud',
                                        path: '.rutPropietario'
                                    }
                                },
                                {
                                    fact: 'registrocivil',
                                    path: '.leasing',
                                    operator: 'equal',
                                    value: true
                                }
                            ]
                        },
                        {//valida que exista el rutPropietario de la solicitud dentro de un array de ruts de civil, luego revisa que este indicado como comunidad.
                            all: [
                                {
                                    fact: 'registrocivil',
                                    path: '.rutPropietario',
                                    operator: 'contains',
                                    value: {
                                        fact: 'solicitud',
                                        path: '.rutPropietario'
                                    }
                                },
                                {
                                    fact: 'registrocivil',
                                    path: '.comunidad',
                                    operator: 'equal',
                                    value: true
                                }
                            ]
                        },// valida que el servicio contestara OK, cuando falla trae un campo status = false, si es exitoso es undefined
                        {
                            fact: 'registrocivil',
                            path: '.status',
                            operator: 'equal',
                            value: 'undefined'
                        }
                    ]
                },
                event: {
                    type: 'propietario',
                    params : {
                        mensaje: 'Propietario Validado'
                    }
                }
            },
            validaAntiguedadRule: {
                conditions: {
                    all: [
                        {//validacion de antiguedad con antiguedad permitida por Norma del folio/region
                            fact: 'registrocivil',
                            path: '.antiguedad',
                            operator: 'lessThanInclusive',
                            value: {
                                fact: 'rnt',
                                path: '.antiguedadMaxima'
                            }
                        }
                    ]
                },
                event: {
                    type: "antiguedad",
                    params: {
                        mensaje: "Antiguedad Validada"
                    }
                }
            },
            validaRTRule: {
                conditions: {
                    all: [
                        {//validacion de resultado de RT
                            fact: 'sgprt',
                            path: '.resultadoRT',
                            operator: 'equal',
                            value: 'Aprobada'
                        },
                        {
                            fact: 'sgprt',
                            path: '.fechaVencimientoRT',
                            operator: 'greaterThanInclusive',
                            value: {
                                fact: 'solicitud',
                                path: '.fechaSolicitud'
                            }
                        }
                    ]
                },
                event: {
                    type: "rt",
                    params: {
                        mensaje: "RT Validada"
                    }
                }
            },
            validaTipoVehiculoNormaRule: {
                conditions: {
                    all: [
                        {
                            fact: 'rnt',
                            path: '.lstTipoVehiculoPermitidos',
                            operator: 'contains',
                            value: {
                                fact: 'registrocivil',
                                path: '.tipoVehiculo'
                            }
                        }
                    ]
                },
                event: {
                    type: 'TVNORMA',
                    params: {
                        message: 'Tipo Vehiculo Norma Validado'
                    }
                }
            },
            buses: {
                validaInscripcionRNTRule: {
                    conditions: {
                        any : [
                            {//valida que vehiculo no exista en RNT
                                fact: 'rnt',
                                path: '.estado',
                                operator: 'equal',
                                value: '0'
                            },
                            {//valida que si existe esté cancelado por traslado y que la region sea distinta a la region de cancelacion anterior
                                all: [{
                                    fact: 'rnt',
                                    path: '.estado',
                                    operator: 'equal',
                                    value: '2'
                                },
                                {
                                    fact: 'rnt',
                                    path: '.tipoCancelacion',
                                    operator: 'equal',
                                    value: 'TRASLADO DE REGIÓN'
                                },
                                {
                                    fact: 'solicitud',
                                    path: '.regionInscripcion',
                                    operator: 'notEqual',
                                    value: {
                                        fact: 'rnt',
                                        path: '.regionOrigen'
                                    }
                                }]
                            },
                            {//valida si esta cancelado por cambio de categoria y que la categoria nueva no sea anterior no sea Publico
                                all: [
                                    {
                                        fact: 'rnt',
                                        path: 'estado',
                                        operator: 'equal',
                                        value: '2'
                                    },
                                    {
                                        fact: 'rnt',
                                        path: '.tipoCancelacion',
                                        operator: 'equal',
                                        value: 'CANCELACIÓN POR CAMBIO DE CATEGORÍA DE TRANSPORTE'
                                    },
                                    {
                                        fact: 'rnt',
                                        path: '.categoria',
                                        operator: 'notEqual',
                                        value: 'PÚBLICO'
                                    }
                                ]
                            }
                        ]
                    },
                    event: {
                        type: "BUSOK",
                        params: {
                            mensaje: "Bus Aceptado"
                        }
                    }
                }
            },
            taxisColectivos: {
                validaInscripcionRNTRule: {
                    conditions: {
                        all: [ 
                            {
                                fact: 'solicitud',
                                path: '.ppureemplaza',
                                operator: 'notEqual',
                                value: undefined
                            },
                            {
                                fact: 'rnt',
                                path: '.estadoPPUReemplazo',
                                operator: 'equal',
                                value: 3
                            }
                        ]
                    },
                    event: {
                        type: "COLECTIVOOK",
                        params: {
                            mensaje: "Colectivo Aceptado"
                        }
                    }
                }
            }
        }
    },
    documents:{
        V01: {
            code : "V01",
            description : "ACREDITACIÓN DE OTORGAMIENTO DE SUBSIDIO"
        },
        V02: {
            code : "V02",
            description : "ACREDITACIÓN DEL SII SOBRE EL GIRO DE AGENCIA DE VIAJES U OPERADOR TURÍSTICO"
        },
        V03: {
            code : "V03",
            description : "ACREDITACIÓN LEASING"
        },
        V04: {
            code : "V04",
            description : "ADJUDICACIÓN DE CONDICIONES DE OPERACIÓN"
        },
        V05: {
            code : "V05",
            description : "AUTORIZACIÓN DEL PROPIETARIO AL MERO TENEDOR"
        },
        V06: {
            code : "V06",
            description : "CÉDULA DE IDENTIDAD (RUN)"
        },
        V07: {
            code : "V07",
            description : "CERTIFICADO DE ANTECEDENTES"
        },
        V08: {
            code : "V08",
            description : "CERTIFICADO DE GASES"
        },
        V09: {
            code : "V09",
            description : "CERTIFICADO DE CARACTERÍSTICAS ESPECIALES"
        },
        V10: {
            code : "V10",
            description : "CERTIFICADO DE CONTROL DE TAXÍMETRO"
        },
        V11: {
            code : "V11",
            description : "CERTIFICADO DE HOMOLOGACIÓN"
        },
        V12: {
            code : "V12",
            description : "CERTIFICADO DE INSCRIPCIÓN Y DE ANOTACIONES VIGENTES (CAV)"
        },
        V13: {
            code : "V13",
            description : "CERTIFICADO DE REVISIÓN TÉCNICA (RT)"
        },
        V14: {
            code : "V14",
            description : "CERTIFICADO DE VIGENCIA DE LA SOCIEDAD"
        },
        V15: {
            code : "V15",
            description : "CERTIFICADO DE VIGENCIA DE REPRESENTATIVIDAD CON VIGENCIA NO MAYOR A 30 DÍAS"
        },
        V16: {
            code : "V16",
            description : "COMPROBANTE DE TRANSFERENCIA O DEPÓSITO"
        },
        V17: {
            code : "V17",
            description : "CONTRATO CON TERCERO PARA REALIZAR SERVICIO SEGÚN GIRO SII"
        },
        V18: {
            code : "V18",
            description : "DOCUMENTO EMITIDO POR SEREMITT DE EDUCACIÓN ACREDITANDO PERÍODO DE VACACIONES"
        },
        V19: {
            code : "V19",
            description : "DOCUMENTO QUE ACREDITA LA INSTALACIÓN DE TACÓGRAFO"
        },
        V20: {
            code : "V20",
            description : "ESCRITURA PÚBLICA DE CONSTITUCIÓN DE SOCIEDAD"
        },
        V21: {
            code : "V21",
            description : "ESCRITURA PÚBLICA DEL MANDATO DE LA COMUNIDAD"
        },
        V22: {
            code : "V22",
            description : "EXTRACTO DE PUBLICACIÓN EN EL DIARIO OFICIAL DE LA EMPRESA"
        },
        V23: {
            code : "V23",
            description : "FACTURA DE COMPRAVENTA"
        },
        V24: {
            code : "V24",
            description : "FORMULARIO E SOLICITUD DE PERMISO ESPECIAL PARA SERVICIOS DE TRANSPORTE PRIVADO REMUNERADO DE PASAJEROS"
        },
        V25: {
            code : "V25",
            description : "FORMULARIO G SOLICITUD DE PERMISO GENERAL PARA SERVICIOS DE TRANSPORTE PRIVADO REMUNERADO DE PASAJEROS"
        },
        V26: {
            code : "V26",
            description : "FORMULARIO N°1 DE INSCRIPCIÓN O ANOTACIÓN"
        },
        V27: {
            code : "V27",
            description : "FORMULARIO N°2 DE CARACTERÍSTICAS DEL SERVICIO"
        },
        V28: {
            code : "V28",
            description : "FORMULARIO N°3 FLOTA ASOCIADA AL SERVICIO Y CONSTANCIA DE EXISTENCIA DE TITULO"
        },
        V29: {
            code : "V29",
            description : "FORMULARIO PARA REGISTRO DE SERVICIOS DE TRANSPORTE REMUNERADO DE ESCOLARES"
        },
        V30: {
            code : "V30",
            description : "FORMULARIO ÚNICO DE REEMPLAZO (FUR)"
        },
        V31: {
            code : "V31",
            description : "INSCRIPCIÓN EN EL REGISTRO DE COMERCIO"
        },
        V32: {
            code : "V32",
            description : "INSPECCIÓN VISUAL OTORGADA POR UNA PLANTA DE REVISIÓN CLASE A"
        },
        V33: {
            code : "V33",
            description : "LICENCIA DE CONDUCIR"
        },
        V34: {
            code : "V34",
            description : "MANDATO NOTARIAL CON VIGENCIA NO MAYOR A 30 DÍAS"
        },
        V35: {
            code : "V35",
            description : "PERMISO DE CIRCULACIÓN (PC)"
        },
        V36: {
            code : "V36",
            description : "PODER NOTARIAL AL REPRESENTANTE DEL MANDATO"
        },
        V37: {
            code : "V37",
            description : "ROL ÚNICO TRIBUTARIO (RUT)"
        },
        V38: {
            code : "V38",
            description : "SEGURO DEL PERSONAL DE CONDUCCIÓN"
        },
        V39: {
            code : "V39",
            description : "SOLICITUD DE PRIMERA INSCRIPCIÓN O TRANSFERENCIA EN EL REGISTRO NACIONAL DE VEHÍCULOS MOTORIZADOS (RNVM)"
        },
        V40: {
            code : "V40",
            description : "TÍTULO QUE HABILITA AL VEHÍCULO PARA PRESTAR SERVICIO"
        },
        V41: {
            code : "V41",
            description : "AUTORIZACIÓN MUNICIPAL PARA EL USO DE VÍAS INCLUIDAS EN EL TRAZADO"
        },
        V42: {
            code : "V42",
            description : "ACREDITACIÓN DE USO DE TERMINAL PARA INICIO Y/O TÉRMINO DE SERVICIOS URBANOS, RURALES E INTERURBANOS"
        },
        V43: {
            code : "V43",
            description : "AUTORIZACIÓN MUNICIPAL PARA EL USO DE PARADEROS"
        },
        V44: {
            code : "V44",
            description : "FIJACIÓN DE VÍAS A SERVICIOS RURALES E INTERURBANOS QUE ESTABLECE EL TRAZADO A REALIZAR EN ZONAS URBANAS"
        },
        V45: {
            code : "V45",
            description : "TARIFAS DEL RECORRIDO"
        },
        V46: {
            code : "V46",
            description : "ACREDITACIÓN DE USO DE TERMINAL INTERMEDIOS EN CASO DE SERVICIOS RURALES E INTERURBANOS"
        }
    }
}