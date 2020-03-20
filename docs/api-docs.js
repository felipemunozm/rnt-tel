const SwaggerAPI = require('koa-joi-router-docs').SwaggerAPI
const Joi = require('koa-joi-router').Joi
const pckg = require('../package.json')
const JoiSchemas = require('../model/models.joi')
const Path = require('path')

module.exports = {
    mountDefinition: (path, router) => {
        const swaggerSpecsRoute = path + (path.endsWith('/') ? '' : '/') + 'swagger.specs.json'

        router.get('/', {
            meta: {
                swagger: {
                    summary: pckg.displayName,
                    description: pckg.description,
                    tags: ['#API']
                }
            },
            validate: {
                output: {
                    200: {
                        body: {
                            name: Joi.string().example(pckg.displayName || 'API - RNT'),
                            appId: Joi.string().example(pckg.name || 'cl.mtt.rnt-tel.cl'),
                            description: Joi.string().example(pckg.description || 'Api para servicios trámites en línea'),
                            version: Joi.string().example(pckg.version || 'V1.0'),
                            swaggerjs: Joi.string(),
                            apiDocs: Joi.string()
                        }
                    }
                }
            },
            handler: (ctx) => {
                ctx.body = {
                    name: pckg.displayName,
                    appId: pckg.name,
                    description: pckg.description,
                    version: pckg.version,
                    swaggerjs: swaggerSpecsRoute,
                    apiDocs: path
                }
            }
        });

        /**
         * Generate Swagger json from the router object
         */
        const generator = new SwaggerAPI()
        generator.addJoiRouter(router)

        const specs = generator.generateSpec({
            info: {
                title: pckg.displayName || pckg.name,
                description: pckg.description,
                version: pckg.version
            },
            basePath: '/',
            tags: [
                { name: '#API', description: `Datos api` },
                { name: 'escolares', description: 'Trámites para escolares' }
            ],
            // pass `definitions` if you need schema references
            definitions: JoiSchemas
        }, {
            defaultResponses: {
                200: {
                    description: 'OK'
                }
            } // Custom default responses if you don't like default 200
        })

        /**
         * Swagger JSON API
         */
        router.get(swaggerSpecsRoute, async ctx => {
            ctx.body = JSON.stringify(specs, null, '  ')
        })

        /**
         * API documentation
         */
        router.get(path, async ctx => {
            ctx.body = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>${pckg.displayName || pckg.name}</title>
            </head>
            <body>
                <redoc spec-url='${swaggerSpecsRoute}' lazy-rendering></redoc>
                <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"></script>
            </body>
            </html>
            `
        })

        return {
            apiDocs: path,
            specs: swaggerSpecsRoute
        }

    }
}