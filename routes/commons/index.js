const Router = require('koa-router')
const router = new Router()
const log = require('../../log')
const commons = require('../../repository/commons')

router.get('/tipos_servicios/:ID_CATEGORIA_TRANSPORTE', async (ctx) => {
    log.debug("ID_CATEGORIA_TRANSPORTE: " + ctx.params.ID_CATEGORIA_TRANSPORTE);
    let idCategoriaTransporte = ctx.params.ID_CATEGORIA_TRANSPORTE;
    ctx.body = await commons.findServiciosByCategoriaTransporte(idCategoriaTransporte);
})

router.get('/', (ctx) => {
    // res.status(200).json({message: "route de commons"})
    ctx.body = "Hola mundo"
})

module.exports = router.routes()