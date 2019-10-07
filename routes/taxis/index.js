const Router = require('koa-router')
const router = new Router()
const taxisLogic = require("../../logic/taxis")
const vehiculosRoute = require('./vehiculos')
const serviciosRoute = require('./servicios')

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de taxis"})
    ctx.body = taxisLogic.getTest()
})
router.use('/vehiculos',vehiculosRoute)
router.use('/servicios',serviciosRoute)

module.exports = router.routes()