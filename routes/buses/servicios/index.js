const routes = require("express").Router()
const logicBuses = require('../../../logic/buses')

routes.get('/personas/:RUT/', (req, res) => {
    res.send(logicBuses.getAutorizadosParaInscripcionServiciosBuses (req.params.RUT))
})

routes.get('/personas/:RUT/empresas/:RUT_EMPRESA', (req,res) => {
    res.send(logicBuses.getAutorizadoPorEmpresaParaInscripcionServicioBuses(req.params.RUT, req.params.RUT_EMPRESA))
})

module.exports = routes;