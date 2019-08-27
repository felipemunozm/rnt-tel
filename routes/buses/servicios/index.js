const routes = require("express").Router()
const logicBuses = require('../../../logic/buses')

routes.get('/personas/:RUT/', (req, res) => {
    res.send(logicBuses.getAutorizadosParaInscripcionServicios(req.params.RUT))
})

module.exports = routes;