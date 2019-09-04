const busesRoute = require('./routes/buses')
const colectivosRoute = require('./routes/colectivos')
const escolarRoute = require('./routes/escolar')
const privadoRoute = require('./routes/privado')
const taxisRoute = require('./routes/taxis')
const koa = require('koa') 
const app = new koa()

const port = 3000

// app.use("/buses", busesRoute)
app.use(busesRoute)
app.use(colectivosRoute)
app.use(escolarRoute)
app.use(privadoRoute)
app.use(taxisRoute)

app.listen(port, () => {
    console.log("RNT-API iniciado en puerto: " + port)
})