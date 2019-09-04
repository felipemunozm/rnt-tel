const Router = require('koa-router')
const router = new Router()
const taxisLogic = require("../../logic/taxis")

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de taxis"})
    ctx.body = taxisLogic.getTest()
})
module.exports = router.routes()