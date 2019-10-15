module.exports = {
    db2ConectionString: "DATABASE=RNT5;HOSTNAME=alamo.mtt.cl;UID=db2admin;PWD=**db2admin;PORT=50000;PROTOCOL=TCPIP",
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
    rntRules: {
        inscripcionVehiculo: {
            validacionInscripcionBuses: {
                conditions: {
                    all: [
                        {
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
                                }
                            ]
                        }, {//validacion de antiguedad con antiguedad permitida por Norma del folio/region
                            fact: 'registrocivil',
                            path: '.antiguedad',
                            operator: 'lessThanInclusive',
                            value: {
                                fact: 'rnt',
                                path: '.antiguedadMaxima'
                            }
                        }, {//validacion de tipo de vehiculo con tipo de vehiculo de la norma asociada al folio/region
                            fact: 'rnt',
                            path: '.lstTipoVehiculoPermitidos',
                            operator: 'contains',
                            value: {
                                fact: 'registrocivil',
                                path: '.tipoVehiculo'
                            }
                        }, {//validacion de resultado de RT
                            fact: 'sgprt',
                            path: '.resultadoRT',
                            operator: 'equal',
                            value: 'Aprobada'
                        }, {
                            any : [
                                {//valida que vehiculo no exista en RNT
                                    fact: 'rnt',
                                    path: '.estado',
                                    operator: 'equal',
                                    value: 'No Encontrado'
                                },
                                {//valida que si existe esté cancelado por traslado y que la region sea distinta a la region de cancelacion anterior
                                    all: [{
                                        fact: 'rnt',
                                        path: '.estado',
                                        operator: 'equal',
                                        value: 'Cancelado' 
                                    },
                                    {
                                        fact: 'rnt',
                                        path: '.tipoCancelacion',
                                        operator: 'equal',
                                        value: 'Cancelado por Traslado'
                                    },
                                    {
                                        fact: 'solicitud',
                                        path: '.regionInscripcion',
                                        operator: 'notEqual',
                                        value: {
                                            fact: 'rnt',
                                            path: 'regionOrigen'
                                        }
                                    }]
                                },
                                {//valida si esta cancelado por cambio de categoria y que la categoria nueva no sea anterior no sea Publico
                                    all: [
                                        {
                                            fact: 'rnt',
                                            path: 'estado',
                                            operator: 'equal',
                                            value: 'Cancelado'
                                        },
                                        {
                                            fact: 'rnt',
                                            path: '.tipoCancelacion',
                                            operator: 'equal',
                                            value: 'Cancelado por Cambio Categoria'
                                        },
                                        {
                                            fact: 'rnt',
                                            path: '.categoria',
                                            operator: 'notEqual',
                                            value: 'Publico'
                                        }
                                    ]
                                }
                            ]
                        },//revisar si es taxi colectivo y que el vehiculo saliente este cancelado por reemplazo
                        {
                            any: [
                                {all: [ 
                                    {
                                        fact: 'solicitud',
                                        path: '.ppureemplaza',
                                        operator: 'notEqual',
                                        value: undefined
                                    },
                                    {
                                        fact: 'rnt',
                                        path: '.estado',
                                        operator: 'equal',
                                        value: 'Cancelado Definitivo'
                                    }
                                ]},
                                {
                                    fact: 'solicitud',
                                    path: '.ppureemplaza',
                                    operator: 'equal',
                                    value: undefined
                                }
                            ]
                        }
                    ]
                },
                event: {
                    type: 'aceptado',
                    params : {
                        mensaje: 'Vehiculo Aceptado'
                    }
                }
            }
        }
    }
}