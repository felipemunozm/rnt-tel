const Router = require('koa-router')
const router = new Router()
const serviciosRoute = require("./servicios")
const vehiculosRoute = require("./vehiculos")

router.get('/', (ctx) => {
    ctx.body = busesLogic.getTest()
})
router.use('/servicios',serviciosRoute)
router.use('/vehiculos',vehiculosRoute)

module.exports = router.routes()
