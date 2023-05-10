import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { CpeService } from 'src/app/services/cpe/cpe.service';

@Component({
    selector: 'app-actualizar-cpe',
    templateUrl: './actualizar-cpe.component.html',
    styleUrls: ['./actualizar-cpe.component.css']
})
export class ActualizarCPEComponent {

    cols: any = []

    datosTabla: any = []

    db_carta_porte: any = []
    db_socios: any = []

    load_carta_porte: boolean = false
    load_socios: boolean = false

    spinnerActualizarCPE: boolean = false
    actualizarRecursivamente: boolean = false

    cambiosDetectadosCPE: any = []
    datosParaActualizarCPE: any = []


    constructor(
        private comunicacionService: ComunicacionService,
        private cpeService: CpeService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'socio', header: 'Socio' },
            { field: 'nro_ctg', header: 'CTG' },
            { field: 'sucursal', header: 'Sucursal' },
            { field: 'nro_cpe', header: 'CPE' },
            { field: 'estado', header: 'Estado' },
        ]

        this.obtenerSocios()
    }

    obtenerSocios() {
        this.comunicacionService.getDB('socios').subscribe(
            (res: any) => {
                this.db_socios = res;
                this.load_socios = false;

                this.obtenerCartasPorte()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerCartasPorte() {
        this.comunicacionService.getDB('carta_porte').subscribe(
            (res: any) => {
                this.db_carta_porte = res;
                this.load_carta_porte = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }


    datosParaTabla(){
        if(!(this.load_carta_porte && this.load_socios)){
            this.db_carta_porte.forEach((cpe:any) => {

                const estado = this.transformDatoTabla(cpe.data, "estadoCPE")

                if(estado != 'CN' && estado != 'AN'){
                    const dato = {
                        socio: this.transformDatoTabla(cpe.cuit_solicitante, "socioCuit"),
                        nro_ctg: cpe.nro_ctg,
                        sucursal: cpe.sucursal,
                        nro_cpe: cpe.nro_cpe,
                        estado: estado,
                        datos: cpe,
                        actualizado: false,
                    }

                    this.datosTabla.push(dato)
                }
            });

            this.datosTabla.sort(function(a:any, b:any) {
                return b.nro_ctg - a.nro_ctg;
            });
            this.datosTabla.sort(function(a:any, b:any) {
                return a.datos.cuit_solicitante - b.datos.cuit_solicitante;
            });
        }
    }

    cpeActualizarPDF(datoEntrada:any){
        var datoVerCPE = datoEntrada.datos
        this.spinnerActualizarCPE = true

        if(!datoVerCPE.cuit_solicitante){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No tiene CUIT solicitante' })
            return
        }

        var data:any = {
            cuit: parseInt(datoVerCPE.cuit_solicitante),
            ejecutar: "consultar_cpe_automotor",
            data: {}
        }

        if(datoVerCPE.nro_ctg){
            data.data.ctg = parseInt(datoVerCPE.nro_ctg)
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No tiene nro CTG' })
            return
        }

        this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
            (res: any) => {
                if(res){
                    if(res.mensaje){
                        if(res.mensaje.nroCTG){
                            if(res.mensaje.nroCTG.toString().length == 11){
                                this.compararDatosCPE(datoVerCPE, res.mensaje)
                                if(res.mensaje.estado){
                                    const nro_cpe = res.mensaje.sucursal.toString().padStart(2, '0') + "-" + res.mensaje.nroOrden.toString().padStart(5, '0')
                                    this.cpeService.moverArchivo(res.mensaje.nroCTG.toString(), res.mensaje.estado, nro_cpe).subscribe(
                                        (resp: any) => {
                                            if(resp){
                                                if(resp.mensaje){
                                                    datoEntrada.actualizado = true
                                                    this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Archivo creado con exito' })
                                                } else {
                                                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar mover el archivo' })
                                                }
                                            } else {
                                                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar mover el archivo' })
                                            }
                                        },
                                        (errr: any) => {
                                            console.log(errr)
                                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar mover el archivo' })
                                        },
                                    )
                                }

                            }
                        }
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontraron datos dsa' })
                }
                this.spinnerActualizarCPE = false
            },
            (err: any) => {
                console.log(err)
                this.spinnerActualizarCPE = false
            }
        )
    }




    
    transformDatoTabla(dato: any, tipo: any) {

        if (tipo == 'socioCuit') {
            return this.db_socios.some((e: any) => { return e.cuit.toString() == dato.toString() }) ? this.db_socios.find((e: any) => { return e.cuit.toString() == dato.toString() }).alias : dato
        }
        if (tipo == 'estadoCPE'){
            if(!dato){
                return '-'
            }
            if(!JSON.parse(dato)){
                return '-'
            }
            return JSON.parse(dato).estado ? JSON.parse(dato).estado : ''
        }

        if (tipo == 'moneda') {
            const number = parseFloat(dato);
            if (number == 0 || number == null || !number) {
                return ''
            }
            const options = {
                style: 'currency',
                currency: 'ARS',
                useGrouping: true,
                maximumFractionDigits: 2
            };
            return number.toLocaleString('es-AR', options);
        }

        return dato
    }

    objUtf8ToBase64(ent: any) {
        let str = JSON.stringify(ent)
        let bytes = new TextEncoder().encode(str);
        let base64 = btoa(String.fromCharCode(...new Uint8Array(bytes.buffer)));
        return base64;
    }

    compararDatosCPE(ant:any, act:any){
        this.cambiosDetectadosCPE = []
        this.datosParaActualizarCPE = ant

        var diferencias:any = 0

        if(act.nroCTG != ant.nro_ctg){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'nro_ctg',
                tipoDato: 'NRO CTG',
                valorAnt: ant.nro_ctg,
                valor: act.nroCTG
            })
            diferencias += 1
        }
        if(act.sucursal != ant.sucursal){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'sucursal',
                tipoDato: 'SUCURSAL',
                valorAnt: ant.sucursal,
                valor: act.sucursal
            })
            diferencias += 1
        }
        if(act.nroOrden != ant.nro_cpe){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'nro_cpe',
                tipoDato: 'NRO CPE',
                valorAnt: ant.nro_cpe,
                valor: act.nroOrden
            })
            diferencias += 1
        }
        if(act.datosCarga.codGrano != ant.cod_grano){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cod_grano',
                tipoDato: 'Cod. GRANO',
                valorAnt: ant.cod_grano,
                valor: act.datosCarga.codGrano
            })
            diferencias += 1
        }
        if(act.destinatario.cuit != ant.cuit_destinatario){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_destinatario',
                tipoDato: 'CUIT DESTINATARIO',
                valorAnt: ant.cuit_destinatario,
                valor: act.destinatario.cuit
            })
            diferencias += 1
        }
        
        if(act.transporte.codigoTurno != ant.codigo_turno){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'codigo_turno',
                tipoDato: 'CODIGO TURNO',
                valorAnt: ant.codigo_turno,
                valor: act.transporte.codigoTurno
            })
            diferencias += 1
        }
        if(act.transporte.cuitTransportista != ant.cuit_transportista){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_transportista',
                tipoDato: 'CUIT TRANSPORTISTA',
                valorAnt: ant.cuit_transportista,
                valor: act.transporte.cuitTransportista
            })
            diferencias += 1
        }
        if(act.transporte.cuitChofer != ant.cuit_chofer){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_chofer',
                tipoDato: 'CUIT CHOFER',
                valorAnt: ant.cuit_chofer,
                valor: act.transporte.cuitChofer
            })
            diferencias += 1
        }
        if(act.transporte.tarifa != ant.tarifa){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'tarifa',
                tipoDato: 'TARIFA',
                valorAnt: ant.tarifa,
                valor: act.transporte.tarifa
            })
            diferencias += 1
        }
        if(act.transporte.kmRecorrer != ant.km_recorrer){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'km_recorrer',
                tipoDato: 'KM A RECORRER',
                valorAnt: ant.km_recorrer,
                valor: act.transporte.kmRecorrer
            })
            diferencias += 1
        }

        if(act.destino.planta != ant.planta_destino){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'planta_destino',
                tipoDato: 'COD PLANTA DESTINO',
                valorAnt: ant.planta_destino,
                valor: act.destino.planta
            })
            diferencias += 1
        }
        if(act.destino.codProvincia != ant.cod_provincia){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cod_provincia',
                tipoDato: 'COD PROVINCIA',
                valorAnt: ant.cod_provincia,
                valor: act.destino.codProvincia
            })
            diferencias += 1
        }
        if(act.destino.codLocalidad != ant.cod_localidad){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cod_localidad',
                tipoDato: 'COD LOCALIDAD',
                valorAnt: ant.cod_localidad,
                valor: act.destino.codLocalidad
            })
            diferencias += 1
        }
        if(act.destino.cuit != ant.cuit_destino){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_destino',
                tipoDato: 'CUIT DESTINO',
                valorAnt: ant.cuit_destino,
                valor: act.destino.cuit
            })
            diferencias += 1
        }

        if(act.codACTUAL != ant.codVIEJO){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'codVIEJO',
                tipoDato: 'codVIEJO',
                valorAnt: ant.codVIEJO,
                valor: act.codACTUAL
            })
            diferencias += 1
        }

        if(!ant.data){
            ant.data = {
                kg_descarga: 0,
                estado: ""
            }
        }
        if(typeof ant.data == 'string'){
            ant.data = JSON.parse(ant.data)
        }

        const tara = act.datosCarga.pesoTara ? parseInt(act.datosCarga.pesoTara) : 0
        const bruto = act.datosCarga.pesoBruto ? parseInt(act.datosCarga.pesoBruto) : 0
        const taraDesc = act.datosCarga.pesoTaraDescarga ? parseInt(act.datosCarga.pesoTaraDescarga) : 0
        const brutoDesc = act.datosCarga.pesoBrutoDescarga ? parseInt(act.datosCarga.pesoBrutoDescarga) : 0
        const neto = brutoDesc - taraDesc
        if(neto != ant.data.kg_descarga){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'kg_descarga',
                tipoDato: 'KGS DESCARGA',
                valorAnt: ant.data.kg_descarga,
                valor: neto
            })
            diferencias += 1
        }
        if(bruto != ant.peso_bruto){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'peso_bruto',
                tipoDato: 'KGS BRUTO',
                valorAnt: ant.peso_bruto,
                valor: bruto
            })
            diferencias += 1
        }
        if(tara != ant.peso_tara){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'peso_tara',
                tipoDato: 'KGS TARA',
                valorAnt: ant.peso_tara,
                valor: tara
            })
            diferencias += 1
        }
        if(act.estado != ant.data.estado){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'estado',
                tipoDato: 'ESTADO',
                valorAnt: ant.data.estado,
                valor: act.estado
            })
            diferencias += 1
        }

        if(act.intervinientes){
            let int = act.intervinientes
            if(int.cuitCorredorVentaPrimaria){
                if(int.cuitCorredorVentaPrimaria != ant.cuit_corredor_venta_primaria){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_corredor_venta_primaria',
                        tipoDato: 'CUIT CORREDOR VENTA PRIMARIA',
                        valorAnt: ant.cuit_corredor_venta_primaria,
                        valor: int.cuitCorredorVentaPrimaria
                    })
                    diferencias += 1
                }
            }
            if(int.cuitCorredorVentaSecundaria){
                if(int.cuitCorredorVentaSecundaria != ant.cuit_corredor_venta_secundaria){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_corredor_venta_secundaria',
                        tipoDato: 'CUIT CORREDOR VENTA SECUNDARIA',
                        valorAnt: ant.cuit_corredor_venta_secundaria,
                        valor: int.cuitCorredorVentaSecundaria
                    })
                    diferencias += 1
                }
            }
            if(int.cuitMercadoATermino){
                if(int.cuitMercadoATermino != ant.cuit_mercado_a_termino){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_mercado_a_termino',
                        tipoDato: 'CUIT MERCADO A TERMINO',
                        valorAnt: ant.cuit_mercado_a_termino,
                        valor: int.cuitMercadoATermino
                    })
                    diferencias += 1
                }
            }
            if(int.cuitRemitenteComercialVentaPrimaria){
                if(int.cuitRemitenteComercialVentaPrimaria != ant.cuit_remitente_comercial_venta_primaria){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_remitente_comercial_venta_primaria',
                        tipoDato: 'CUIT REMITENTE COMERCIAL VENTA PRIMARIA',
                        valorAnt: ant.cuit_remitente_comercial_venta_primaria,
                        valor: int.cuitRemitenteComercialVentaPrimaria
                    })
                    diferencias += 1
                }
            }
            if(int.cuitRemitenteComercialVentaSecundaria){
                if(int.cuitRemitenteComercialVentaSecundaria != ant.cuit_remitente_comercial_venta_secundaria){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_remitente_comercial_venta_secundaria',
                        tipoDato: 'CUIT REMITENTE COMERCIAL VENTA SECUNDARIA',
                        valorAnt: ant.cuit_remitente_comercial_venta_secundaria,
                        valor: int.cuitRemitenteComercialVentaSecundaria
                    })
                    diferencias += 1
                }
            }
            if(int.cuitRemitenteComercialVentaSecundaria2){
                if(int.cuitRemitenteComercialVentaSecundaria2 != ant.cuit_remitente_comercial_venta_secundaria2){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_remitente_comercial_venta_secundaria2',
                        tipoDato: 'CUIT REMITENTE COMERCIAL VENTA SECUNDARIA 2',
                        valorAnt: ant.cuit_remitente_comercial_venta_secundaria2,
                        valor: int.cuitRemitenteComercialVentaSecundaria2
                    })
                    diferencias += 1
                }
            }
            if(int.cuitRepresentanteEntregador){
                if(int.cuitRepresentanteEntregador != ant.cuit_representante_entregador){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_representante_entregador',
                        tipoDato: 'CUIT REPRESENTANTE ENTREGADOR',
                        valorAnt: ant.cuit_representante_entregador,
                        valor: int.cuitRepresentanteEntregador
                    })
                    diferencias += 1
                }
            }
            if(int.cuitRepresentanteRecibidor){
                if(int.cuitRepresentanteRecibidor != ant.cuit_representante_recibidor){
                    this.cambiosDetectadosCPE.push({
                        modificar: true,
                        tipo: 'cuit_representante_recibidor',
                        tipoDato: 'CUIT REPRESENTANTE RECIBIDOR',
                        valorAnt: ant.cuit_representante_recibidor,
                        valor: int.cuitRepresentanteRecibidor
                    })
                    diferencias += 1
                }
            }
        }

        if(!diferencias && this.actualizarRecursivamente){
            setTimeout(()=>{this.actualizarTodos()}, 1000)
        }
    }

    actualizarCPE(){
        this.actualizarRecursivamente = false

        this.cambiosDetectadosCPE.forEach((e:any) => {
            if(e.modificar){
                if(e.tipo == "kg_descarga" || e.tipo == "estado"){
                    this.datosParaActualizarCPE.data[e.tipo] = e.valor
                } else {
                    this.datosParaActualizarCPE[e.tipo] = e.valor
                }
            }
        });

        this.datosParaActualizarCPE.data = JSON.stringify(this.datosParaActualizarCPE.data)

        delete this.datosParaActualizarCPE.archivos;

        this.comunicacionService.updateDB("carta_porte", this.datosParaActualizarCPE).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Modificado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.cambiosDetectadosCPE = []
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }

    actualizarTodos(){
        this.actualizarRecursivamente = true

        var datosActualizar:any = this.datosTabla.filter((e:any) => { return e.actualizado == false })
        if(datosActualizar.length){
            this.cpeActualizarPDF(datosActualizar[0])
        }
    }

}
