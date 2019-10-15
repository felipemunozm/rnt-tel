const log = require('../../log')

module.exports = {
    cargarRevisionRechazoVehiculo: (ruleEngine) => {
        ruleEngine.on('failure', (event,almanac, ruleResult) => {
            log.debug("Failure event trigger...")
            log.debug('RuleResult: ' + JSON.stringify(ruleResult))
            ruleResult.conditions.all.forEach(condition => {
                if(condition.result == false 
                    && condition.operator == 'equal'
                    && condition.fact == 'registrocivil'
                    && condition.path == '.rutPropietario') {
                    log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                    docs.push('V02','V03')
                }
                if(condition.result == false 
                    && condition.operator == 'lessThanInclusive'
                    && condition.fact == 'registrocivil'
                    && condition.path == '.antiguedad') {
                    log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                    continua = false
                }
                if(condition.result == false 
                    && condition.operator == 'contains'
                    && condition.fact == 'rnt'
                    && condition.path == '.lstTipoVehiculoPermitidos') {
                    log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                    continua = false
                }
                if(condition.result == false 
                    && condition.operator == 'equal'
                    && condition.fact == 'sgprt'
                    && condition.path == '.resultadoRT') {
                    log.debug('Imprimiendo condicion fallida: ' + JSON.stringify(condition))
                    docs.push('V07')
                }
            })
        })
        ruleEngine.on("success", (event,almanac, ruleResult) => {
            log.debug("Success event trigger...")
            ruleResult.conditions.all.forEach(condition => {
                if(condition.result == true 
                    && condition.operator == 'equal'
                    && condition.fact == 'registrocivil'
                    && condition.path == '.leasing') {
                    log.debug('Imprimiendo condicion Exitosa: ' + JSON.stringify(condition))
                    docs.push('V05')
                }
                if(condition.result == true 
                    && condition.operator == 'equal'
                    && condition.fact == 'registrocivil'
                    && condition.path == '.comunidad') {
                    log.debug('Imprimiendo condicion Exitosa: ' + JSON.stringify(condition))
                    docs.push('V06')
                }
            })
        })
    }
}