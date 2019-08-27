const routes = require("express").Router()

routes.get('/personas/:RUT/', (req, res) => {
    res.send({message: "ver en LOG" + req.params.RUT})
})

module.exports = routes