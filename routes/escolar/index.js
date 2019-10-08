const Router = require('koa-router')
const router = new Router()
const escolarLogic = require("../../logic/escolar")
const serviciosRoute = require("./servicios")
const vehiculosRoute = require("./vehiculos")
// router.get('/', (ctx) => {
//     // res.status(200).json({message: "route de escolar"})
//     ctx.body = escolarLogic.getTest()
// })
// module.exports = router.routes()



router.get('/', (ctx) => {
    ctx.body = escolarLogic.getTest()
})
router.use('/servicios',serviciosRoute)
router.use('/vehiculos',vehiculosRoute)

module.exports = router.routes()


