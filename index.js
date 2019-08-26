
const express = require('express')
const busesRoute = require('./routes/buses')
const colectivosRoute = require('./routes/colectivos')
const escolarRoute = require('./routes/escolar')
const privadoRoute = require('./routes/privado')
const taxisRoute = require('./routes/taxis')
const app = express()

const port = 3000

app.use("/buses", busesRoute)
app.use("/colectivos", colectivosRoute)
app.use("/escolar", escolarRoute)
app.use("/privado", privadoRoute)
app.use("/taxis", taxisRoute)

app.listen(port, () => {
    console.log("RNT-API iniciado en puerto: " + port)
})