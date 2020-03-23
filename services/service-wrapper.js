const soap = require('soap');
const { createClientAsync, Client } = require('soap');
const log = require('../log')

class ServiceWrapper {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this._client = client
    }

    async callAction(actionName, args) {
        this._client
    }
}

module.exports = {
    createClient: async(url, timeOut = 5000) => {
        return createClientAsync(url, { wsdl_options: { timeOut: timeOut } }).then(client => new ServiceWrapper(client))
    }
}