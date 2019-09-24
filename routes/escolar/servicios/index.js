const Router = require('koa-router')
const router = new Router()

router.get('/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/regiones/:ID_REGION/empresas/:RUT_EMPRESA/representante/:RUT_REPRESENTANTE/mandatario/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/regiones/:ID_REGION/personas/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/regiones/:ID_REGION/personas/:RUT_RESPONSABLE/mandatarios/:RUT_SOLICITANTE', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.get('/tipos_servicios', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.post('/ppus/validaciones', (ctx) => {
    ctx.body = {test: ctx.url}
})

router.post('/solicitudes', (ctx) => {
    ctx.body = {test: ctx.url}
})

module.exports = router.routes()