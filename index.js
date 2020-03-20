const dotenv = require('dotenv').config(); // node -r dotenv/config index.js => como alternativa
const koa = require('koa')
const Router = require('koa-joi-router')

const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')

const busesRoute = require('./routes/buses')
const colectivosRoute = require('./routes/colectivos')
const escolarRoute = require('./routes/escolares.routes')
const privadoRoute = require('./routes/privado')
const taxisRoute = require('./routes/taxis')
const commonsRoute = require('./routes/commons')

const apiDocs = require('./docs/api-docs')
const koaSwagger = require('koa2-swagger-ui')

const log = require('./log')
log.mark('archivo .env =>', dotenv)

const app = new koa()

if (process.env.NODE_ENV !== 'prod') {
    // agregar detalle de errores en body
    app.use(require('./middlewares/verbose-errors.middleware'))
}

app.use(bodyParser())
app.use(koaStatic(__dirname + '/static'))

const router = Router()

router.use('/buses', busesRoute)
router.use('/taxis_colectivos', colectivosRoute)
router.route(escolarRoute.routes)
router.use('/privados', privadoRoute)
router.use('/taxis', taxisRoute)
router.use('/commons', commonsRoute)

app.use(router.middleware())



const docRoutes = apiDocs.mountDefinition('/api-docs', router)
app.use(
    koaSwagger({
        routePrefix: '/swagger', // host at /swagger instead of default /docs
        swaggerOptions: {
            url: docRoutes.specs, // example path to json
        },
    }),
);

app.listen(process.env.SERVER_PORT, () => {
    const url = `http://localhost:${process.env.SERVER_PORT}`
    log.debug(`RNT-API iniciado en  ${url}`)
    log.debug(`RNT-API documentacion  ${url}${docRoutes.apiDocs}`)
})