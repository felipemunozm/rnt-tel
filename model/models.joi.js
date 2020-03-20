const Joi = require('koa-joi-router').Joi;

const RutJoi = Joi.string().min(9).max(10).regex(/^\d{7,8}-[0-9kK]$/).label('Número de Rol Único tributario')
    .description('Correlativo con verificador, sin puntos, con guión').example('71234567-k')

const IdJoi = Joi.number().integer().label('Id')

const CodigoRegionJoi = Joi.string().regex(/^\d{2}$/).example('08')

const PPUJoi = Joi.string().label('Placa Patente Única').example('HTKK67').regex(/^([A-Z]{4}\d{2})|([A-Z]{2}\d{4})$/)


const TipoServicioJoi = Joi.object({
    CATEGORIA_TRANSPORTE: Joi.string().required(),
    CATEGORIA_NOMBRE: Joi.string()
})

const SolicitudServicioJoi = Joi.object({
    rut_solicitante: RutJoi.required(),
    rut_responsable: RutJoi.required(),
    folio: Joi.number().optional(),
    region: IdJoi,
    lstPpuRut: Joi.array().items({ rut: RutJoi, ppu: PPUJoi }).example(new Array([{ rut: '1234567-0', ppu: 'XD3456' }, { rut: '12345678-K', ppu: 'AKPF09' }])),
    CantidadRecorridos: Joi.number()
})



const ServicioAutorizadoJoi = Joi.object({
    ID_CATEGORIA: IdJoi.label('Id Categoría'),
    ID_TIPO_SERICIO: IdJoi.label('Id Tipo Servicio'),
    categoria: Joi.string().label('Categoría'),
    tipo_servicio: Joi.string().label('Área servicio'),
    tipovehiculo: Joi.string().label('Tipo Vehículo'),
    modalidad: Joi.string().label('Modalidad'),
    tiposervicio: Joi.string().label('tipoServicio').description('Nombre servicio compuesto: {Area Servicio} {Tipo Vehiculo} {Modalidad}')
}).label('Servicio autorizado')

const RespServiciosAutorizadosJoi = Joi.object({
    estado: Joi.string(),
    mensaje: Joi.string(),
    servicios: Joi.array().items(ServicioAutorizadoJoi)
})



const ItemFlota = Joi.object({
    ppu: PPUJoi,
    validacion: Joi.boolean(),
    documentosAdjuntar: Joi.array().items(Joi.object()),
    documentosOpcionales: Joi.array().items(Joi.object())
})

const ItemFlotaRechazo = Joi.object({
    ppu: PPUJoi,
    validacion: Joi.boolean(),
    mensaje: Joi.string(),
    listaRechazos: Joi.array().items(Joi.string())
})

const SolicitudServicioRespuestaJoi = Joi.object({
    listaFlotaValidada: Joi.array().items(ItemFlota),
    listaFlotaRechazada: Joi.array().items(ItemFlotaRechazo),
    monto: Joi.number().integer().label('Costo en documentos').description('Consto asociado por concepto de documentos para efectuar el proceso')
}).description('Un objeto con el resultado de la validación de los datos para el Trámite y los items de la Flota especificada')

const CategoriaServicioJoi = Joi.string().valid(['BUSES', 'COLECTIVOS', 'PRIVADO', 'TAXIS', 'ESCOLARES'])

module.exports = {
    RutJoi,
    IdJoi,
    CodigoRegionJoi,

    RespServiciosAutorizadosJoi,
    ServicioAutorizadoJoi

}