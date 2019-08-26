const routes = require("express").Router()
const busesLogic = require("../../logic/buses")

routes.get('/', (req,res) => {
    // res.status(200).json({message: "route de buses"})
    res.send(busesLogic.getTest())
})
module.exports = routes
