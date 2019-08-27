const routes = require("express").Router()

routes.get('/personas/:RUT/', (req, res) => {
    console.log(req.params.RUT)
    console.log(req.path)
    res.send({message: "ver log file"})
})

module.exports = routes;