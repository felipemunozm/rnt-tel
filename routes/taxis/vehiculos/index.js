const Router = require('koa-router')
const router = new Router()

router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/empresas/:RUT_EMPRESA/representantes/:RUT_REPRESENTANTE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/personas/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.post('/ppus/validaciones', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.post('/solicitudes', (ctx) => {
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()