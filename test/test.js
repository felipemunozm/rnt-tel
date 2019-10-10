const assert = require('chai').assert
const servicegateway = require('../utils/serviciosGateway')
describe('Array', () => {
    it('Return a value', () => {
        // assert.typeOf(servicegateway.getPPUSRCeI('YB2215'))
        assert.isObject(servicegateway.getPPUSRCeI('YB2215'))
    })
})