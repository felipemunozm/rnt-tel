const dotenv = require('dotenv').config(); // node -r dotenv/config index.js => como alternativa
const koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const busesRoute = require('./routes/buses')
const colectivosRoute = require('./routes/colectivos')
const escolarRoute = require('./routes/escolar')
const privadoRoute = require('./routes/privado')
const taxisRoute = require('./routes/taxis')
const commonsRoute = require('./routes/commons')

const log = require('./log')
log.mark('archivo .env', dotenv)

const app = new koa()
app.use(bodyParser())
app.use(koaStatic(__dirname + '/static'))
const router = new Router()
router.use('/buses', busesRoute)
router.use('/taxis_colectivos', colectivosRoute)
router.use('/escolares', escolarRoute)
router.use('/privados', privadoRoute)
router.use('/taxis', taxisRoute)
router.use('/commons', commonsRoute)

app.use(router.routes())
app.listen(process.env.SERVER_PORT, () => {
    const url = `http://localhost:${process.env.SERVER_PORT}`
    log.debug(`RNT-API iniciado en  ${url}`)
})