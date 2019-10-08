const Router = require('koa-router')
const router = new Router()
const privadoLogic = require("../../logic/privado")
const vehiculosRoute = require('./vehiculos')
const serviciosRoute = require('./servicios')

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de privado"})
    ctx.body = privadoLogic.getTest()
})
router.use('/vehiculos',vehiculosRoute)
router.use('/servicios',serviciosRoute)
module.exports = router.routes()


