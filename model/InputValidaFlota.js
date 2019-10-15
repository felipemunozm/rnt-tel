class InputValidaFlota {
    constructor(rut_responsable, rut_solicitante, folio, region, lstPpuRut, cantidadRecorridos) {
        this.rut_responsable = rut_responsable
        this.rut_solicitante = rut_solicitante
        this.folio = folio
        this.region = region
        this.lstPpuRut = lstPpuRut
        this.cantidadRecorridos = cantidadRecorridos
    }
}

module.exports = InputValidaFlota