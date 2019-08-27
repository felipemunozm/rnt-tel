const routes = require("express").Router()
const busesLogic = require("../../logic/buses")
const serviciosRoute = require("./servicios")
const vehiculosRoute = require("./vehiculos")

routes.get('/', (req,res) => {
    // res.status(200).json({message: "route de buses"})
    res.send(busesLogic.getTest())
})
routes.use('/servicios',serviciosRoute)
routes.use('/vehiculos',vehiculosRoute)
module.exports = routes
