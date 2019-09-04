const Router = require('koa-router')
const router = new Router({prefix: '/buses'})
const busesLogic = require("../../logic/buses")
const serviciosRoute = require("./servicios")
const vehiculosRoute = require("./vehiculos")

router.get('/', (ctx) => {
    ctx.body = busesLogic.getTest()
})
router.use(serviciosRoute)
router.use(vehiculosRoute)

module.exports = router.routes()
