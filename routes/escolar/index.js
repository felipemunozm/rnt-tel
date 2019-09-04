const Router = require('koa-router')
const router = new Router()
const escolarLogic = require("../../logic/escolar")

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de escolar"})
    ctx.body = escolarLogic.getTest()
})
module.exports = router.routes()