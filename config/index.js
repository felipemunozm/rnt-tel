const _ = require('lodash')
let defaults = require('./config')

const env = process.env.NODE_ENV
if (env !== '') {
    const envConfig = require(`./config.${env}.js`)
    defaults = _.merge(defaults, envConfig)
}

module.exports = defaults