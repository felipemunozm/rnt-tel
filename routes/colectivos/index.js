const Router = require('koa-router')
const router = new Router({prefix: "/colectivos"})
const colectivosLogic = require("../../logic/colectivos")

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de colectivos"})
    ctx.body = colectivosLogic.getTest()
})
module.exports = router.routes()