const Router = require('koa-router')
const router = new Router({prefix: "/privados"})
const privadoLogic = require("../../logic/privado")

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de privado"})
    ctx.body = privadoLogic.getTest()
})
module.exports = router.routes()