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
const port = 3001
const app = new koa()
app.use(bodyParser())
app.use(koaStatic(__dirname + '/static'))
const router = new Router()
router.use('/buses',busesRoute)
router.use('/taxis_colectivos',colectivosRoute)
router.use('/escolares',escolarRoute)
router.use('/privados',privadoRoute)
router.use('/taxis',taxisRoute)
router.use('/commons',commonsRoute)
app.use(router.routes())
log.debug("RNTDN: " + JSON.stringify(process.env.RNTDN))
log.debug("PORT: " + JSON.stringify(process.env.PORT))
app.listen(process.env.PORT ? process.env.PORT : 3001, () => {
    log.debug("RNT-API iniciado en puerto: " + port)
    // console.log("RNT-API iniciado en puerto: " + port)
})