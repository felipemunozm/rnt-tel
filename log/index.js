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
            level: 'trace',
            enableCallStack: true
        }
    },
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID'
})
const logger = log4js.getLogger()
logger.level = 'info'
module.exports = logger