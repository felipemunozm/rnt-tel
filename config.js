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
    }
}