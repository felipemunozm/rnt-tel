const routes = require("express").Router()
const privadoLogic = require("../../logic/privado")

routes.get('/', (req,res) => {
    // res.status(200).json({message: "route de privado"})
    res.send(privadoLogic.getTest())
})
module.exports = routes