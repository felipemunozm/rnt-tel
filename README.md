# Registro Nacional e Transporte - Trámites en Línea
API servicios para Tramites en Línea (RNT-TEL)

## Documentación

La API cuenta con documentación automática basada en definición de rutas usando [koa-joi-router](https://github.com/koajs/joi-router) sobre las cuales se usa [koa-joi-router-docs](https://github.com/chuyik/koa-joi-router-docs) para generar documentación automática. Esta documentación se encuentra publicada en 

La documentación automática genera una especificación [Swagger](https://swagger.io/) en formato de especificación v2 json. Este armicho está disponible en http://localhost:3001/api-docs/swagger.specs.json.

El proyecto a su vez monta un cliente de [Swagger UI](https://swagger.io/tools/swagger-ui/) para pruebas activas de request. EL cliente puede ser accedido en  http://localhost:3001/swagger

*Nota: Las URLs mencionadas son las definidas por omisión y pueden ser configuradas en el servicio.*

## Variables de ambiente

El siguiente es el listado de varaibles de ambientes que pueden ser configurados para el funcionamiento de la API. Se usa [dotenv](https://github.com/motdotla/dotenv) pueden ser configuradas dentro del archivo [.env] en la raiz del proyecto.

* NODE_ENV : ambiente (prod, qa, dev) del sistema que afecta a:
  * configuracion de IDs por ambiente de Simple 
* LOG_LEVEL : nivel de log usado por log4js
  * si es debug o menor se entrega informacioón completa del error en el response 
junto con el código de estado HTTP correspondiente
* RNTDN : String de conexión con la BD db2
* DB2CODEPAGE : codificación para interactuar con la BD (_**debe ser testeada dado que puede producir comportamientos no deseados**_)
* SERVER_PORT: puerto para levantar la API