module.exports = {
    //conexion QA
    db2ConectionString: process.env.RNTDN ? process.env.RNTDN : "DATABASE=RNT5;HOSTNAME=alamo.mtt.cl;UID=db2admin;PWD=**db2admin;PORT=50000;PROTOCOL=TCPIP",
    //conexion PRD
    // db2ConectionString: "DATABASE=RNT5;HOSTNAME=alamo.mtt.cl;UID=db2admin;PWD=**db2admin;PORT=50000;PROTOCOL=TCPIP",
    rntTramitesMap: {
        buses: {
            IdsTramites: [22]
        },
        colectivos: {
            IdsTramites: [7]
        },
        escolares: {
            IdsTramites: [21]
        },
        privados: {
            IdsTramites: [23]
        },
        taxis: {
            IdsTramites: [24]
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
    }
}