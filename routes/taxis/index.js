const routes = require("express").Router()
const taxisLogic = require("../../logic/taxis")

routes.get('/', (req,res) => {
    // res.status(200).json({message: "route de taxis"})
    res.send(taxisLogic.getTest())
})
module.exports = routes