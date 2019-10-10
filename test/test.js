const assert = require('chai').assert
const servicegateway = require('../utils/serviciosGateway')
const log = require('../log')
describe('Test Consumo Servicios Web', () => {
    it('Retornar Objeto SRCeI', async () => {
        assert.typeOf(await servicegateway.getPPUSRCeI('YB22sdfasdf155'),'Object')
    })
    it('Retornar Objeto RT', async () => {
        assert.typeOf(await servicegateway.getPPURT('YB2215'),'Object')
    })
})