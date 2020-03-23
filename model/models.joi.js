const Joi = require('koa-joi-router').Joi;

const RutJoi = Joi.string().min(9).max(10).regex(/^\d{7,8}-[0-9kK]$/)
    //.description('Correlativo con verificador, sin puntos, con guión').example('71234567-k')

const IdJoi = Joi.number().integer()
    //.label('Id')

const CodigoRegionJoi = Joi.string().regex(/^\d{2}$/)
    //.example('08')

const PPUJoi = Joi.string().regex(/^([A-Z]{4}\d{2})|([A-Z]{2}\d{4})$/)
    // .label('Placa Patente Única').example('HTKK67')

const TipoVehiculoJoi = Joi.string().valid(['BUSES', 'COLECTIVOS', 'PRIVADO', 'TAXIS', 'ESCOLARES'])

class SolicitudServicioItemFlota {
    /** @type string */
    rut;
    /** @type string */
    ppu;

    static joi() {
        return Joi.object({ rut: RutJoi, ppu: PPUJoi })
    }
}

class SolicitudServicio {
    /** @type string */
    rut_solicitante;
    /** @type string */
    rut_responsable;
    /** @type string */
    folio;
    /** @type string : código de la región */
    region;
    /** @type SolicitudServicioItemFlota[] */
    lstPpuRut;
    /** @type number */
    CantidadRecorridos;

    static joi() {
        return Joi.object({
            rut_solicitante: RutJoi.required(),
            rut_responsable: RutJoi.required(),
            folio: Joi.number().optional(),
            region: IdJoi.required(),
            lstPpuRut: Joi.array().items(SolicitudServicioItemFlota.joi()),
            CantidadRecorridos: Joi.number()
        })
    }
}

class ServicioAutorizado {
    /** @type number */
    ID_CATEGORIA;
    /** @type number */
    ID_TIPO_SERICIO;
    /** @type string */
    categoria;
    /** @type string */
    tipo_servicio;
    /** @type string */
    tipovehiculo;
    /** @type string */
    modalidad;
    /** @type string */
    tiposervicio;

    static joi() {
        return Joi.object({
            ID_CATEGORIA: IdJoi.label('Id Categoría'),
            ID_TIPO_SERICIO: IdJoi.label('Id Tipo Servicio'),
            categoria: Joi.string().label('Categoría'),
            tipo_servicio: Joi.string().label('Área servicio'),
            tipovehiculo: Joi.string().label('Tipo Vehículo'),
            modalidad: Joi.string().label('Modalidad'),
            tiposervicio: Joi.string().label('tipoServicio').description('Nombre servicio compuesto: {Area Servicio} {Tipo Vehiculo} {Modalidad}')
        })
    }
}

class ServiciosAutorizadosRespuesta {
    /** @type string */
    estado;
    /** @type string */
    mensaje;
    /** @type ServicioAutorizado[] */
    servicios;

    static joi() {
        return Joi.object({
            estado: Joi.string(),
            mensaje: Joi.string(),
            servicios: Joi.array().items(ServicioAutorizado.joi())
        })
    }
}

class ItemFlotaValidacion {
    /** @type string */
    ppu;
    /** @type boolean */
    validacion;

    /** @type string */
    mensaje;

    /** @type any[] */
    listaRechazos;

    /** @type any[] */
    documentosAdjuntar;

    /** @type any[] */
    documentosOpcionales;

    static joi() {
        return Joi.object({
            ppu: PPUJoi.required(),
            validacion: Joi.boolean().required(),

            documentosAdjuntar: Joi.array().items(Joi.object()).when('validacion', { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),
            documentosOpcionales: Joi.array().items(Joi.object()).when('validacion', { is: true, then: Joi.required(), otherwise: Joi.forbidden() }),

            mensaje: Joi.string().when('validacion', { is: false, then: Joi.required(), otherwise: Joi.forbidden() }),
            listaRechazos: Joi.array().items(Joi.string()).when('validacion', { is: false, then: Joi.required(), otherwise: Joi.forbidden() })
        })
    }
}

class ValidacionFlotaRespuesta {
    /** @typeof number */
    listaFlotaValidada
    /** @typeof number */
    listaFlotaRechazada
    /** @typeof number */
    monto

    static joi() {
        return Joi.object({
            listaFlotaValidada: Joi.array().items(ItemFlotaValidacion.joi()),
            listaFlotaRechazada: Joi.array().items(ItemFlotaValidacion.joi()),
            monto: Joi.number().integer().label('Costo en documentos').description('Consto asociado por concepto de documentos para efectuar el proceso')
        })
    }
}



module.exports = {
    /** Definiciones puras Joi o elementos que solo serán usados en la capa de controladores */
    joi: {
        RutJoi,
        IdJoi,
        CodigoRegionJoi
    },

    /** 
     * Definiciones de clases que entregan, usando .joi(), la definicion Joi. Aunque no es necesario
     * se establece esta convención para poder dar más información al desarrollador de los datos esperados en los métodos.      
     */
    models: {
        ValidacionFlotaRespuesta,
        ServiciosAutorizadosRespuesta,
        SolicitudServicio
    }
}