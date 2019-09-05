const log4js = require('log4js')
log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'coloured'
                //type: 'pattern',
                //pattern: '%s [%p] %m'
            }
        }    
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'debug',
            enableCallStack: true
        }
    }
})
const logger = log4js.getLogger()
logger.level = 'debug'
module.exports = logger