const routes = require("express").Router()
const escolarLogic = require("../../logic/escolar")

routes.get('/', (req,res) => {
    // res.status(200).json({message: "route de escolar"})
    res.send(escolarLogic.getTest())
})
module.exports = routes