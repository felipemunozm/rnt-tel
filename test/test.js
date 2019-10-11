const assert = require('chai').assert
const servicegateway = require('../utils/serviciosGateway')
const busesLogic = require('../logic/buses')
const taxisLogic = require('../logic/taxis')
const colectivosLogic = require('../logic/colectivos')
const escolaresLogic = require('../logic/escolar')
const privadosLogic = require('../logic/privado')
const config = require('../config')
const log = require('../log')

describe('Test Buses Logic',() => {
    it('Inscripcion Vehiculos Empresa',() => {
        assert.typeOf(busesLogic.findServiciosByRepresentanteLegalAndEmpresa('99554700-7','21917402-0'),'Object')
    })
    it('Inscripcion Vehiculos Empresa - Mandatario',() => {
        assert.typeOf(busesLogic.findServiciosByMandatarioAndRepresentanteAndEmpresa('99554700-7','21917402-0','10855306-5'),'Object')
    })
    it('Inscripcion Vehiculos Persona',() => {
        assert.typeOf(busesLogic.getServiciosVigentesInscritosPorRutResponsable('6171162-7'),'Object')
    })
    it('Inscripcion Vehiculos Persona - Mandato',() => {
        assert.typeOf(busesLogic.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario('6171162-7','12563016-2'),'Object')
    })
    it('Inscripcion de Servicios Empresa',() => {
        assert.typeOf(busesLogic.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioBuses('01','99531590-4','12630194-4',config.rntTramitesMap.buses.IdsTramites[0]),'Object')
    })
    it('Inscripcion de Servicios Persona',() => {
        assert.typeOf(busesLogic.getAutorizadoPorPersonaParaTramiteInscripcionServicioBuses('01','4180282-0',config.rntTramitesMap.buses.IdsTramites[0]),'Object')
    })
})
describe('Test Taxis Logic',() => {
    it('Inscripcion Vehiculos Empresa',() => {
        assert.typeOf(taxisLogic.findServiciosByRepresentanteLegalAndEmpresa('76090561-5','6060703-6'),'Object')
    })
    it('Inscripcion Vehiculos Empresa - Mandatario',() => {
        assert.typeOf(taxisLogic.findServiciosByMandatarioAndRepresentanteAndEmpresa('77191130-7','13257351-4','10011754-1'),'Object')
    })
    it('Inscripcion Vehiculos Persona',() => {
        assert.typeOf(taxisLogic.getServiciosVigentesInscritosPorRutResponsable('10014636-3'),'Object')
    })
    it('Inscripcion Vehiculos Persona - Mandato',() => {
        assert.typeOf(taxisLogic.getServiciosVigentesInscritosPorRutResponsableAndRutMandatario('7540299-6','13919487-K'),'Object')
    })
    it('Inscripcion de Servicios Empresa',() => {
        assert.typeOf(taxisLogic.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioTaxis('01','99531590-4','12630194-4',config.rntTramitesMap.taxis.IdsTramites[0]),'Object')
    })
    it('Inscripcion de Servicios Persona',() => {
        assert.typeOf(taxisLogic.getAutorizadoPorPersonaParaTramiteInscripcionServicioTaxis('01','12630194-4',config.rntTramitesMap.taxis.IdsTramites[0]),'Object')
    })
})
describe('Test Colectivos Logic',() => {
    it('Inscripcion de Servicios Empresa',() => {
        assert.typeOf(colectivosLogic.getAutorizacionPorEmpresaAndPersonaTramiteInscripcionTaxiColectivo('01','96866510-3','12630194-4',config.rntTramitesMap.colectivos.IdsTramites[0]),'Object')
    })
    it('Inscripcion de Servicios Persona',() => {
        assert.typeOf(colectivosLogic.getAutorizacionPorPersonaTramiteInscripcionTaxiColectivo('01','1103851-4',config.rntTramitesMap.colectivos.IdsTramites[0]),'Object')
    })
})
describe('Test Escolares Logic',() => {
    it('Inscripcion de Servicios Empresa',() => {
        assert.typeOf(escolaresLogic.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioEscolar('01','99531590-4','12630194-4',config.rntTramitesMap.escolares.IdsTramites[0]),'Object')
    })
    it('Inscripcion de Servicios Persona',() => {
        assert.typeOf(escolaresLogic.getAutorizadoPorPersonaParaTramiteInscripcionServicioEscolar('01','12630194-4',config.rntTramitesMap.escolares.IdsTramites[0]),'Object')
    })
})
describe('Test Privados Logic',() => {
    it('Inscripcion de Servicios Empresa',() => {
        assert.typeOf(privadosLogic.getAutorizadoPorEmpresaAndSolicitanteInscripcionServicioPrivado('01','99531590-4','12630194-4',config.rntTramitesMap.privados.IdsTramites[0]),'Object')
    })
    it('Inscripcion de Servicios Persona',() => {
        assert.typeOf(privadosLogic.getAutorizadoPorPersonaParaTramiteInscripcionServicioPrivado('01','12630194-4',config.rntTramitesMap.privados.IdsTramites[0]),'Object')
    })
})

describe('Test Consumo Servicios Web', () => {
    it('Retornar Objeto SRCeI', async () => {
        assert.typeOf(await servicegateway.getPPUSRCeI('YB2215'),'Object')
    })
    it('Retornar Objeto RT', async () => {
        assert.typeOf(await servicegateway.getPPURT('YB2215'),'Object')
    })
})