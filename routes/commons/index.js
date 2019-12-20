const Router = require('koa-router')
const router = new Router()
const log = require('../../log')
const commons = require('../../repository/commons')

router.get('/tipos_servicios/:NOMBRE_CATEGORIA', async (ctx) => {
    log.debug("NOMBRE_CATEGORIA: " + ctx.params.NOMBRE_CATEGORIA);
    let nombreCategoriaTransporte = ctx.params.NOMBRE_CATEGORIA;
    ctx.body = await commons.findServiciosByCategoriaTransporte(nombreCategoriaTransporte);
})

module.exports = router.routes()