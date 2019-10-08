const Router = require('koa-router')
const router = new Router()
const colectivosLogic = require("../../logic/colectivos")
const serviciosRoute = require('./servicios')
const vehiculosRoute = require('./vehiculos')

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de colectivos"})
    ctx.body = colectivosLogic.getTest()
})
router.use('/servicios',serviciosRoute)
//router.use('/vehiculos',vehiculosRoute)
module.exports = router.routes()