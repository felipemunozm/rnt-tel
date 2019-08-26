const routes = require("express").Router()
const colectivosLogic = require("../../logic/colectivos")

routes.get('/', (req,res) => {
    // res.status(200).json({message: "route de colectivos"})
    res.send(colectivosLogic.getTest())
})
module.exports = routes