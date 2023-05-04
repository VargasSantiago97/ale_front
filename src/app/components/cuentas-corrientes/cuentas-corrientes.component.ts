import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { NumeroLetrasService } from 'src/app/services/numeroLetras/numero-letras.service';

declare var vars: any;
const ORDEN_PAGO = vars.ORDEN_CARGA;
const PUNTO_ORDEN_PAGO = vars.PUNTO_ORDEN_PAGO;

@Component({
    selector: 'app-cuentas-corrientes',
    templateUrl: './cuentas-corrientes.component.html',
    styleUrls: ['./cuentas-corrientes.component.css']
})
export class CuentasCorrientesComponent {
    @ViewChild('myCargador') uploader: any;
    @ViewChild('myCargadorGasto') uploaderGasto: any;

    API_URI = vars.API_URI_UPLOAD;

    db_camiones: any = []
    db_choferes: any = []
    db_transportistas: any = []
    db_condicion_iva: any = []
    db_socios: any = []
    db_movimientos: any = []
    db_granos: any = []
    db_asientos: any = []
    db_ordenes_carga: any = []
    db_ordenes_pago: any = []
    db_medios_pago: any = []
    db_carta_porte: any = []

    dataMovimientosASeleccionar: any = []
    dataMovimientosASeleccionarGastos: any = []
    dataMovimientosSeleccionados: any = []
    dataMovimientosSeleccionadosGastos: any = []

    datosAsiento: any = {}
    datosAsientoMostrar: any = {}

    datosCuentaCorriente: any = []
    datosCuentaCorrienteTotales: any = {}

    ordenDePago_pagarParaSeleccionar: any = []
    ordenDePago_descontarParaSeleccionar: any = []
    ordenDePago_conceptosAfectados: any = []
    ordenDePago_mediosPago: any = []
    ordenDePago_saldoFinalAfectar: any = 0
    ordenDePago_saldoFinalPagando: any = 0
    ordenDePago_datos: any = {}
    ordenDePago_idAsientoCreado: any = 0

    arrastreDeSaldo: any = 0

    transportista: any;
    socio: any;
    chofer: any;
    camion: any;

    select_choferes: any = [];
    select_camiones: any = [];

    load_camiones: any = true
    load_choferes: any = true
    load_transportistas: any = true
    load_condicion_iva: any = true
    load_movimientos: any = true
    load_granos: any = true
    load_asientos: any = true
    load_ordenes_carga: any = true
    load_ordenes_pago: any = true
    load_medios_pago: any = true
    load_carta_porte: any = true

    verViajesPreviamenteAfec: any = false

    displayNuevoViaje: any = false
    displayVerAsiento: any = false
    displayNuevoGasto: any = false
    displayOrdenPago: any = false
    displayVerOrdenPago: any = false

    cols: any = []
    selectedColumns: any = []

    constructor(
        private messageService: MessageService,
        private comunicacionService: ComunicacionService,
        private numToLet : NumeroLetrasService,
        private router: Router
    ) { }

    ngOnInit() {
        this.cols = [
            { field: "fecha", header: "Fecha" },
            { field: "cultivo", header: "Cultivo" },
            { field: "orden", header: "O.C." },
            { field: "ctg", header: "C.T.G." },
            { field: "cpe", header: "N° C.P." },

            { field: "campo", header: "Est." },
            { field: "pat", header: "Pats." },

            { field: "kg_neto_final", header: "Neto Final" },

            { field: "tarifa", header: "Tarifa" },
            { field: "kg_descarga", header: "Kg Descargados" },
            { field: "monto_final", header: "Monto calc" },
        ];
        this.selectedColumns = [
            { field: "fecha", header: "Fecha" },
            { field: "cultivo", header: "Cultivo" },
            { field: "orden", header: "O.C." },
            { field: "ctg", header: "C.T.G." },
            { field: "cpe", header: "N° C.P." },

            { field: "campo", header: "Est." },
            { field: "pat", header: "Pats." },

            { field: "kg_neto_final", header: "Neto Final" },

            { field: "tarifa", header: "Tarifa" },
            { field: "kg_descarga", header: "Kg Descargados" },
            { field: "monto_final", header: "Monto calc" },
        ];

        this.obtenerCamiones()
        this.obtenerChoferes()
        this.obtenerTransportistas()
        this.obtenerCondicion_iva()
        this.obtenerSocios()
        this.obtenerMovimientos()
        this.obtenerGranos()
        this.obtenerAsientos()
        this.obtenerOrdenesCarga()

        this.obtenerOrdenesPago()
        this.obtenerMediosPago()
        this.obtenerCartasPorte()
    }

    routerLinkIr(ruta:any){
        this.router.navigate([ruta])
    }

    //CONEXION A BASE DE DATOS
    obtenerCamiones() {
        this.comunicacionService.getDB("camiones").subscribe(
            (res: any) => {
                this.db_camiones = res;
                this.load_camiones = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerChoferes() {
        this.comunicacionService.getDB("choferes").subscribe(
            (res: any) => {
                this.db_choferes = res;
                this.load_choferes = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerTransportistas() {
        this.comunicacionService.getDB("transportistas").subscribe(
            (res: any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerCondicion_iva() {
        this.comunicacionService.getDB("condicion_iva").subscribe(
            (res: any) => {
                this.db_condicion_iva = res;
                this.load_condicion_iva = false
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerSocios() {
        this.comunicacionService.getDB("socios").subscribe(
            (res: any) => {
                this.db_socios = res;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerMovimientos() {
        this.comunicacionService.getDB('movimientos').subscribe(
            (res: any) => {
                this.db_movimientos = res;
                this.load_movimientos = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerGranos() {
        this.comunicacionService.getDB('granos').subscribe(
            (res: any) => {
                this.db_granos = res;
                this.load_granos = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerAsientos() {
        this.comunicacionService.getDB('asientos').subscribe(
            (res: any) => {
                this.db_asientos = res;
                this.load_asientos = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerOrdenesCarga() {
        this.comunicacionService.getDB('orden_carga').subscribe(
            (res: any) => {
                this.db_ordenes_carga = res;
                this.load_ordenes_carga = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerOrdenesPago() {
        this.comunicacionService.getDB('orden_pago').subscribe(
            (res: any) => {
                this.db_ordenes_pago = res;
                this.load_ordenes_pago = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerMediosPago() {
        this.comunicacionService.getDB('medios_pago').subscribe(
            (res: any) => {
                this.db_medios_pago = res;
                this.load_medios_pago = false;
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
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    onSelectTransporte() {
        this.buscarDatosTransportista()
    }

    onSelectSocio() {
        if (this.transportista) {
            this.buscarDatosTransportista()
        }
    }

    buscarDatosTransportista() {
        //INFORMACION PARA MOSTRAR EN TABLA CTA CTE
        this.datosCuentaCorriente = []
        this.datosCuentaCorrienteTotales = {
            ingreso: 0.0,
            gasto: 0.0,
            saldo: 0.0
        }
        this.arrastreDeSaldo = 0

        var asientos_filtrados: any = []
        var movimientosPreviamenteAfectados: any = []
        var movimientosPreviamenteAfectadosGastos: any = []

        //filtramos por SOCIO y TRANSPORTISTA
        asientos_filtrados = this.db_asientos.filter((e: any) => {
            return (e.id_socio == this.socio.id) && (e.id_transportista == this.transportista.id)
        });

        //ordenamos por fecha
        asientos_filtrados.sort((ann: any, bnn: any) => {
            const fecha1: any = new Date(ann.fecha)
            const fecha2: any = new Date(bnn.fecha)
            return fecha1 - fecha2
        });

        asientos_filtrados.forEach((e: any) => {
            const dateObj = new Date(e.fecha);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const dateString = `${year}/${month}/${day}`;

            const nuevoIngreso = parseFloat(e.haber) ? parseFloat(e.haber) : 0
            const nuevoGasto = parseFloat(e.debe) ? parseFloat(e.debe) : 0

            const saldoCalculo = nuevoIngreso - nuevoGasto
            this.arrastreDeSaldo += saldoCalculo

            this.datosCuentaCorriente.push(
                {
                    id_asiento: e.id,
                    fecha: dateString,
                    tipo: e.tipo,
                    descripcion: e.descripcion,
                    ingreso: parseFloat(e.haber),
                    gasto: parseFloat(e.debe),
                    saldo: this.arrastreDeSaldo
                }
            )

            this.datosCuentaCorrienteTotales = {
                ingreso: this.datosCuentaCorrienteTotales.ingreso + nuevoIngreso,
                gasto: this.datosCuentaCorrienteTotales.gasto + nuevoGasto,
                saldo: this.arrastreDeSaldo
            }
        });



        //movimientos para seleccionar
        asientos_filtrados.forEach((e: any) => {
            if (e.afecta != null && !this.verViajesPreviamenteAfec && e.tipo == 'MOV') {
                if (JSON.parse(e.afecta).length > 0) {
                    movimientosPreviamenteAfectados.push(...JSON.parse(e.afecta))
                }
            }

            if (e.afecta != null && !this.verViajesPreviamenteAfec && e.tipo == 'GAS') {
                if (JSON.parse(e.afecta).length > 0) {
                    movimientosPreviamenteAfectadosGastos.push(...JSON.parse(e.afecta))
                }
            }
        })

        this.dataMovimientosASeleccionar = []
        this.dataMovimientosASeleccionarGastos = []

        this.db_movimientos.filter((e: any) => { return ((e.id_socio == this.socio.id) && (e.id_transporte == this.transportista.id)) }).map((e: any) => {

            const dateObj = new Date(e.fecha);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const dateString = `${year}/${month}/${day}`;

            const patentes = this.db_camiones.some((f: any) => { return f.id == e.id_camion }) ? this.db_camiones.find((f: any) => { return f.id == e.id_camion }).patente_chasis + ' / ' + this.db_camiones.find((f: any) => { return f.id == e.id_camion }).patente_acoplado : ''

            var constDatosCPE = this.db_carta_porte.filter((f:any) => { return f.id_movimiento == e.id })

            var ctg:any = ''
            var cpe:any = ''
            var tarifa:any = 0
            var kg_descarga:any = ''
            var monto_final:any = ''

            if(constDatosCPE.length == 1){
                ctg = constDatosCPE[0].nro_ctg
                cpe = constDatosCPE[0].nro_cpe
                tarifa = constDatosCPE[0].tarifa

                kg_descarga = 0
                monto_final = 0

                this.transportista

                if(constDatosCPE[0].data){
                    if(JSON.parse(constDatosCPE[0].data)){
                        if(JSON.parse(constDatosCPE[0].data).kg_descarga){
                            kg_descarga = parseFloat(JSON.parse(constDatosCPE[0].data).kg_descarga)

                            const iva = this.db_condicion_iva.find((f:any) => { return f.id == this.transportista.condicion_iva }).iva

                            monto_final = ((kg_descarga * parseFloat(tarifa)) * (iva==1 ? 1.21 : 1) / 1000).toFixed(2)
                        }
                    }
                }
            }



            if (!movimientosPreviamenteAfectados.includes(e.id)) {
                this.dataMovimientosASeleccionar.push({
                    id: e.id,
                    fecha: dateString,
                    cultivo: this.db_granos.some((f: any) => { return f.id == e.id_grano }) ? this.db_granos.find((f: any) => { return f.id == e.id_grano }).alias : '-',
                    orden: this.db_ordenes_carga.some((f: any) => { return f.id_movimiento == e.id }) ? this.db_ordenes_carga.find((f: any) => { return f.id_movimiento == e.id }).numero : '',
                    ctg: ctg,
                    cpe: cpe,
                    campo: e.campo,
                    pat: patentes,
                    kg_neto_final: e.kg_neto_final,
                    tarifa: tarifa,
                    kg_descarga: kg_descarga,
                    monto_final: monto_final
                })
            }
            if (!movimientosPreviamenteAfectadosGastos.includes(e.id)) {
                this.dataMovimientosASeleccionarGastos.push({
                    id: e.id,
                    fecha: dateString,
                    cultivo: this.db_granos.some((f: any) => { return f.id == e.id_grano }) ? this.db_granos.find((f: any) => { return f.id == e.id_grano }).alias : '-',
                    orden: this.db_ordenes_carga.some((f: any) => { return f.id_movimiento == e.id }) ? this.db_ordenes_carga.find((f: any) => { return f.id_movimiento == e.id }).numero : '',
                    ctg: ctg,
                    cpe: cpe,
                    campo: e.campo,
                    pat: patentes,
                    kg_neto_final: e.kg_neto_final,
                    tarifa: tarifa,
                    kg_descarga: kg_descarga,
                    monto_final: monto_final
                })
            }
        })
    }

    transformarDatoMostrarTabla(dato: any, tipo: any) {
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
        if (tipo == 'numToLet') {
            return this.numToLet.numeroALetras(dato)
        }
        return dato
    }

    agregarMovimiento(mov: any) {
        this.dataMovimientosSeleccionados.push(mov)

        var valorSuma = 0
        var valorDesc: any = ''
        this.dataMovimientosSeleccionados.forEach((e: any) => {
            const valorActual = parseFloat(e.monto_final) ? parseFloat(e.monto_final) : 0
            valorSuma = valorSuma + valorActual

            if (valorDesc == '') {
                valorDesc = e.cultivo ? 'FLETE ' + e.cultivo.toUpperCase() : null
            }
            const ctg = e.ctg ? " / CTG " + e.ctg : ""
            const cpe = e.cpe ? " - CP " + e.cpe : ""

            valorDesc += ctg + cpe
        });

        this.datosAsiento.montoTotal = valorSuma.toFixed(2)
        this.datosAsiento.montoFactura = valorSuma.toFixed(2)
        this.datosAsiento.descripcion = valorDesc
    }

    agregarMovimientoGasto(mov: any) {
        this.dataMovimientosSeleccionados.push(mov)

        var valorSuma = 0
        var valorDesc: any = ''
        this.dataMovimientosSeleccionados.forEach((e: any) => {
            const valorActual = parseFloat(e.monto_final) ? parseFloat(e.monto_final) : 0
            valorSuma = valorSuma + valorActual

            if (valorDesc == '') {
                valorDesc = 'GASTO'
            }
            const ctg = e.ctg ? " / CTG " + e.ctg : ""
            const cpe = e.cpe ? " - CP " + e.cpe : ""

            valorDesc += ctg + cpe
        });

        this.datosAsiento.montoTotal = valorSuma.toFixed(2)
        this.datosAsiento.montoFactura = valorSuma.toFixed(2)
        this.datosAsiento.descripcion = valorDesc
    }

    cambiaNumFactura() {
        var valorDesc: any = ''
        this.dataMovimientosSeleccionados.forEach((e: any) => {

            if (valorDesc == '') {
                if (this.datosAsiento.tipo == "MOV") {
                    valorDesc = e.cultivo ? 'FLETE ' + e.cultivo.toUpperCase() : null
                }
                if (this.datosAsiento.tipo == "GAS") {
                    valorDesc = 'GASTO'
                }
            }
            const ctg = e.ctg ? " / CTG " + e.ctg : ""
            const cpe = e.cpe ? " - CP " + e.cpe : ""

            valorDesc += ctg + cpe
        });

        const letra = this.datosAsiento.cpte_letra ? 'F' + this.datosAsiento.cpte_letra : ''
        const punto = this.datosAsiento.cpte_punto ? this.datosAsiento.cpte_punto.toString().padStart(4, "0") : ''
        const numero = this.datosAsiento.cpte_numero ? this.datosAsiento.cpte_numero.toString().padStart(8, "0") : ''

        this.datosAsiento.descripcion = valorDesc + '/' + letra + ' ' + punto + '-' + numero
    }

    nuevoAsientoViaje() {

        var idd = this.generateUUID()
        if (this.db_asientos.some((e: any) => { return e.id == idd })) {
            this.nuevoAsientoViaje()
            return
        }

        this.dataMovimientosSeleccionados = []
        this.displayNuevoViaje = true

        var fecha = new Date()
        fecha.setHours(fecha.getHours() - 3);
        const fechaISO = fecha.toISOString().slice(0, 10);


        this.datosAsiento = {
            id: idd,
            tipo: "MOV",
            id_socio: this.socio.id,
            id_transportista: this.transportista.id,
            montoTotal: 0,
            cpte_letra: 'A',
            cpte_punto: null,
            cpte_numero: null,
            montoFactura: 0,
            fecha: fechaISO,
            descripcion: null,
            observacion: null
        }
    }

    guardarAsiento() {

        this.datosAsiento.activo = 1

        var fechaHora = new Date(this.datosAsiento.fecha);
        this.datosAsiento.fecha = fechaHora.toISOString().slice(0, 19).replace('T', ' ');
        this.datosAsiento.cpte_fecha = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

        var afecta: any = []
        this.dataMovimientosSeleccionados.forEach((e: any) => { afecta.push(e.id) });
        this.datosAsiento.afecta = JSON.stringify(afecta)

        this.datosAsiento.haber = null
        this.datosAsiento.debe = null

        if (this.datosAsiento.tipo == "MOV") {
            this.datosAsiento.montoFactura < 0 ? (this.datosAsiento.debe = -1 * this.datosAsiento.montoFactura) : (this.datosAsiento.haber = this.datosAsiento.montoFactura)
        }
        if (this.datosAsiento.tipo == "GAS") {
            this.datosAsiento.montoFactura < 0 ? (this.datosAsiento.haber = -1 * this.datosAsiento.montoFactura) : (this.datosAsiento.debe = this.datosAsiento.montoFactura)
        }

        this.comunicacionService.createDB("asientos", this.datosAsiento).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Creado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.obtenerAsientos()
                setTimeout(() => {
                    this.buscarDatosTransportista()
                    this.displayNuevoViaje = false
                    this.displayNuevoGasto = false
                }, 100)

                //subir archivos
                this.datosAsiento.tipo == "MOV" ? this.uploader.upload() : null;
                this.datosAsiento.tipo == "GAS" ? this.uploaderGasto.upload() : null;
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }

    mostrarAsiento(asiento: any) {
        this.datosAsientoMostrar = this.db_asientos.find((e: any) => { return e.id == asiento.id_asiento })
        if(this.datosAsientoMostrar.tipo != 'ODP'){
            this.displayVerAsiento = true

            this.datosAsientoMostrar.archivos = false
    
            this.comunicacionService.getDir(this.datosAsientoMostrar.id).subscribe(
                (res: any) => {
                    if (res.mensaje) {
                        this.datosAsientoMostrar.archivos = res.ruta
                    }
                },
                (err: any) => {
                    console.log(err)
                }
            )
        } else {
            this.ordenDePago_datos = this.db_ordenes_pago.find((e:any) => { return e.id_asiento == asiento.id_asiento })
            this.ordenDePago_mediosPago = this.db_medios_pago.filter((e:any) => { return e.id_orden == this.ordenDePago_datos.id })

            var concepts = []
            if (this.ordenDePago_datos.afecta != null) {
                if (JSON.parse(this.ordenDePago_datos.afecta).length > 0) {
                    concepts.push(...JSON.parse(this.ordenDePago_datos.afecta))
                }
            }

            this.ordenDePago_conceptosAfectados = []
            var saldo = 0

            concepts.forEach((id_asiento:any) => {

                const asiento = this.db_asientos.find((e: any) => { return e.id == id_asiento })

                const dateObj = new Date(asiento.fecha);
                const year = dateObj.getFullYear();
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const day = dateObj.getDate().toString().padStart(2, '0');
                const dateString = `${day}/${month}/${year}`;
        
                var descripcion = "(" + dateString + ") - " + asiento.descripcion
        
                var debe = asiento.debe ? parseFloat(asiento.debe) : 0
                var haber = asiento.haber ? parseFloat(asiento.haber) : 0
                saldo = saldo - debe + haber
        
                this.ordenDePago_conceptosAfectados.push({
                    id: asiento.id,
                    descripcion: descripcion,
                    debe: debe,
                    haber: haber,
                    saldo: saldo
                })
            })
            this.ordenDePago_saldoFinalAfectar = saldo

            this.displayVerOrdenPago = true
        }
    }

    borrarAsiento(id_asiento: any) {
        if (confirm('Desea eliminar elemento?')) {
            var asientoEliminar = this.db_asientos.find((e: any) => { return e.id == id_asiento })

            console.log(asientoEliminar)

            asientoEliminar.estado = 0

            this.comunicacionService.updateDB("asientos", asientoEliminar).subscribe(
                (res: any) => {
                    res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                    this.obtenerAsientos()
                    setTimeout(() => {
                        this.buscarDatosTransportista()
                        this.displayVerAsiento = false
                    }, 100)
                },
                (err: any) => {
                    console.log(err)
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
                }
            )
        }
    }


    onUpload(event: any) {
        if (event.originalEvent.body.mensaje) {
            this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Archivos cargados con exito' })
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al cargar archivos' })
        }
    }

    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    verViajesPreviamenteAfectados() {
        this.verViajesPreviamenteAfec = !this.verViajesPreviamenteAfec
        this.buscarDatosTransportista()
    }


    nuevoAsientoGasto() {

        var idd = this.generateUUID()
        if (this.db_asientos.some((e: any) => { return e.id == idd })) {
            this.nuevoAsientoGasto()
            return
        }

        this.dataMovimientosSeleccionados = []
        this.displayNuevoGasto = true

        var fecha = new Date()
        fecha.setHours(fecha.getHours() - 3);
        const fechaISO = fecha.toISOString().slice(0, 10);


        this.datosAsiento = {
            id: idd,
            tipo: "GAS",
            id_socio: this.socio.id,
            id_transportista: this.transportista.id,
            montoTotal: 0,
            cpte_letra: 'A',
            cpte_punto: null,
            cpte_numero: null,
            montoFactura: 0,
            fecha: fechaISO,
            descripcion: null,
            observacion: null
        }
    }


    //ORDENES DE PAGO
    nuevoOrdenDePago() {

        var idd = this.generateUUID()
        if (this.db_ordenes_pago.some((e: any) => { return e.id == idd })) {
            this.nuevoOrdenDePago()
            return
        }

        this.ordenDePago_pagarParaSeleccionar = []
        this.ordenDePago_descontarParaSeleccionar = []
        this.ordenDePago_mediosPago = []
        this.ordenDePago_conceptosAfectados = []
        this.ordenDePago_saldoFinalAfectar = 0
        this.ordenDePago_saldoFinalPagando = 0

        const transp = this.db_transportistas.find((e:any) => { return e.id == this.transportista.id})
        const numero = this.generateNumeroOrdenDePago()
        
        var fechaHora = new Date();
        const fecha = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

        this.ordenDePago_datos = {
            id: idd,
            id_asiento: 0,
            id_socio: this.socio.id,
            fondo: this.socio.id + ".png",
            id_transportista: this.transportista.id,
            fecha: fecha,
            afecta: [],


            beneficiario_razon: transp.razon_social,
            beneficiario_cuit: transp.cuit,
            beneficiario_domicilio: transp.direccion + ", " + transp.localidad + " (" + transp.codigoPostal + ") - " + transp.descripcionProvincia,
            beneficiario_codigo: transp.codigo,

            punto: PUNTO_ORDEN_PAGO,
            numero: numero,

            total: 0,
            total_letras: '',

            descripcion: "ORDEN DE PAGO - N° " + PUNTO_ORDEN_PAGO.toString().padStart(2, '0') + "-" + numero.toString().padStart(5, '0'),
            observacion: "",
        }

        //filtramos por SOCIO y TRANSPORTISTA
        var asientos_filtrados:any = this.db_asientos.filter((e: any) => {
            return (e.id_socio == this.socio.id) && (e.id_transportista == this.transportista.id) && (e.tipo != 'ODP')
        });

        //ordenamos por fecha
        asientos_filtrados.sort((ann: any, bnn: any) => {
            const fecha1: any = new Date(ann.fecha)
            const fecha2: any = new Date(bnn.fecha)
            return fecha1 - fecha2
        });

        var movimientosPreviamenteAfectados: any = []
        this.db_ordenes_pago.forEach((e: any) => {
            if (e.afecta != null && !this.verViajesPreviamenteAfec) {
                if (JSON.parse(e.afecta).length > 0) {
                    movimientosPreviamenteAfectados.push(...JSON.parse(e.afecta))
                }
            }
        })

        asientos_filtrados.forEach((e: any) => {

            const dateObj = new Date(e.fecha);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const dateString = `${year}/${month}/${day}`;

            const patentes = this.db_camiones.some((f: any) => { return f.id == e.id_camion }) ? this.db_camiones.find((f: any) => { return f.id == e.id_camion }).patente_chasis + ' / ' + this.db_camiones.find((f: any) => { return f.id == e.id_camion }).patente_acoplado : ''

            if (!movimientosPreviamenteAfectados.includes(e.id)) {

                if(e.haber){
                    this.ordenDePago_pagarParaSeleccionar.push({
                        id: e.id,
                        fecha: dateString,
                        tipo: e.tipo,
                        descripcion: e.descripcion,
                        saldo: e.haber,
                        afectar: 0
                    })
                }
                if(e.debe){
                    this.ordenDePago_descontarParaSeleccionar.push({
                        id: e.id,
                        fecha: dateString,
                        tipo: e.tipo,
                        descripcion: e.descripcion,
                        saldo: e.debe,
                        afectar: 0
                    })
                }
            }
        })


        this.displayOrdenPago = true
    }
    calcularDatosOrdenPago(){

        var conceptosAfectados:any = []

        this.ordenDePago_pagarParaSeleccionar.filter((e:any)=>{ return e.afectar != 0 }).forEach((e:any) => {
            conceptosAfectados.push({
                id: e.id,
                fecha: e.fecha,
                tipo: e.tipo,
                descripcion: e.descripcion,
                debe: 0,
                haber: e.afectar,
            })
        })
        this.ordenDePago_descontarParaSeleccionar.filter((e:any)=>{ return e.afectar != 0 }).forEach((e:any) => {
            conceptosAfectados.push({
                id: e.id,
                fecha: e.fecha,
                tipo: e.tipo,
                descripcion: e.descripcion,
                debe: e.afectar,
                haber: 0,
            })
        })

        //ordenamos por fecha
        conceptosAfectados.sort((ann: any, bnn: any) => {
            const fecha1: any = new Date(ann.fecha)
            const fecha2: any = new Date(bnn.fecha)
            return fecha1 - fecha2
        });

        this.ordenDePago_conceptosAfectados = []
        var saldo = 0

        conceptosAfectados.forEach((e:any) => {
            const dateObj = new Date(e.fecha);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const dateString = `${day}/${month}/${year}`;

            var descripcion = "(" + dateString + ") - " + e.descripcion

            var debe = e.debe ? parseFloat(e.debe) : 0
            var haber = e.haber ? parseFloat(e.haber) : 0
            saldo = saldo - debe + haber

            this.ordenDePago_conceptosAfectados.push({
                id: e.id,
                descripcion: descripcion,
                debe: debe,
                haber: haber,
                saldo: saldo
            })
        })
        this.ordenDePago_saldoFinalAfectar = saldo
    }

    agregarMedioPagoOrdenPago(tipo:any, detalle:any){

        var idd = this.generateUUID()
        if (this.db_medios_pago.some((e: any) => { return e.id == idd })) {
            this.agregarMedioPagoOrdenPago(tipo, detalle)
            return
        }
    
        var fecha = new Date()
        fecha.setHours(fecha.getHours() - 3);
        const fechaISO = fecha.toISOString().slice(0, 10);

        var saldoPagado = 0
        this.ordenDePago_mediosPago.forEach((e:any) => {
            const sald = e.valor ? parseFloat(e.valor) : 0
            saldoPagado += sald
        })

        this.ordenDePago_mediosPago.push({
            id: idd,
            id_orden: this.ordenDePago_datos.id,
            descripcion: detalle,
            emisor: null,
            numero: null,
            serie: null,
            tipo: tipo,
            fecha: fechaISO,
            valor: this.ordenDePago_saldoFinalAfectar - saldoPagado
        })

        this.calcularSaldoFinalPagando()
    }
    calcularSaldoFinalPagando(){
        var saldoPagado:any = 0
        this.ordenDePago_mediosPago.forEach((e:any) => {
            const sald = e.valor ? parseFloat(e.valor) : 0
            saldoPagado += sald
        })
        this.ordenDePago_saldoFinalPagando = saldoPagado
        this.ordenDePago_datos.total_letras = this.numToLet.numeroALetras(saldoPagado)
        this.ordenDePago_datos.total = saldoPagado
    }

    guardarOrdenPago(){

        //guardamos el asiento
        this.guardarAsientoOrdenPagoDB()

        //medios de pago
        this.ordenDePago_mediosPago.forEach((e:any) => {
            this.guardarMedioPagoDB(e)
        })

        //agregamos los asientos afectados
        this.ordenDePago_datos.afecta = []
        this.ordenDePago_conceptosAfectados.forEach((e:any) => {
            this.ordenDePago_datos.afecta.push(e.id)
        })
        this.ordenDePago_datos.afecta = JSON.stringify(this.ordenDePago_datos.afecta)

        var dataEnviar:any = {}
        dataEnviar = this.ordenDePago_datos

        var fechaHora = new Date(this.ordenDePago_datos.fecha);
        dataEnviar.fecha = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

        dataEnviar.activo = 1;
        dataEnviar.id_asiento = this.ordenDePago_idAsientoCreado

        this.comunicacionService.createDB("orden_pago", dataEnviar).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Orden de pago creado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Orden de Pago' })
                this.displayOrdenPago = false
                this.displayVerOrdenPago = true
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Orden de Pago' })
            }
        )

    }
    borrarOrdenPago(){
        if(confirm('Desea eliminar?')){
            this.ordenDePago_mediosPago.forEach((e:any) => {
                this.eliminarMedioPagoDB(e)
            })

            this.eliminarAsientoOrdenPagoDB()

            this.eliminarOrdenPagoDB()
    
        }
    }

    guardarMedioPagoDB(dato:any){

        var fechaHora = new Date(dato.fecha);
        dato.fecha = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

        dato.activo = 1;

        this.comunicacionService.createDB("medios_pago", dato).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Medio de pago creado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Medio de Pago' })
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Medio de Pago' })
            }
        )
    }
    eliminarMedioPagoDB(dato:any){

        dato.estado = 0;

        this.comunicacionService.updateDB("medios_pago", dato).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Medio de pago eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Medio de Pago' })
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Medio de Pago' })
            }
        )
    }
    guardarAsientoOrdenPagoDB(){

        var idd = this.generateUUID()
        if (this.db_asientos.some((e: any) => { return e.id == idd })) {
            this.guardarAsientoOrdenPagoDB()
            return
        }

        this.ordenDePago_idAsientoCreado = idd

        var fechaHora = new Date(this.ordenDePago_datos.fecha);
        var fecha = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

        var datosAsiento = {
            id: idd,
            tipo: "ODP",
            id_socio: this.socio.id,
            id_transportista: this.transportista.id,
            fecha: fecha,
            descripcion: this.ordenDePago_datos.descripcion,
            observacion: this.ordenDePago_datos.observacion,
            afecta: JSON.stringify([]),
            cpte_letra: null,
            cpte_punto: null,
            cpte_numero: null,
            cpte_fecha: fecha,
            debe: this.ordenDePago_datos.total,
            haber: null,
            activo: 1,
            estado: 1
        }

        this.comunicacionService.createDB("asientos", datosAsiento).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Asiento creado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend ASIENTO' })
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend ASIENTO' })
            }
        )
    }
    eliminarAsientoOrdenPagoDB(){

        var asiento = this.db_asientos.find((e:any) => { return e.id == this.ordenDePago_datos.id_asiento})
        asiento.estado = 0

        this.comunicacionService.updateDB("asientos", asiento).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Asiento eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend ASIENTO' })
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend ASIENTO' })
            }
        )
    }
    eliminarOrdenPagoDB(){
        this.ordenDePago_datos.estado = 0
        this.comunicacionService.updateDB("orden_pago", this.ordenDePago_datos).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Orden de pago eliminada con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Orden de Pago' })
                this.displayVerOrdenPago = false
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend Orden de Pago' })
            }
        )
    }

    generateNumeroOrdenDePago() {
        var ordenesPago:any = this.db_ordenes_pago.filter((e:any) => { return parseInt(e.punto) == parseInt(PUNTO_ORDEN_PAGO) })

        var numeroMasGrande:any = ordenesPago.reduce((acumulado:any, objetoActual:any) => {
            const valor = parseInt(objetoActual.numero)
            return Math.max(acumulado, valor);
        }, 0);

        return numeroMasGrande + 1;
    }

    mostrarOrdenPago(ver: any) {
        var pagos:any = []
        this.ordenDePago_mediosPago.forEach((e:any) => {
            const dateObj = new Date(e.fecha);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const dateString = `${day}/${month}/${year}`;

            pagos.push({
                tipo: e.tipo,
                detalle: e.descripcion,
                fecha: dateString,
                valor: e.valor
            })
        })
        
        var conceptos:any = []
        this.ordenDePago_conceptosAfectados.forEach((e:any) => {
            conceptos.push({
                concepto: e.descripcion,
                debe: e.debe,
                haber: e.haber,
                saldo: e.saldo
            })
        })


        const dateObj = new Date(this.ordenDePago_datos.fecha);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const dateString = `${day}/${month}/${year}`;

        const data: any = {
            numero: this.ordenDePago_datos.punto.toString().padStart(2, '0') + "-" + this.ordenDePago_datos.numero.toString().padStart(5, '0'),
            fecha: dateString,
            fondo: this.ordenDePago_datos.fondo,
            beneficiario_razon: this.ordenDePago_datos.beneficiario_razon,
            beneficiario_cuit: this.ordenDePago_datos.beneficiario_cuit,
            beneficiario_codigo: this.ordenDePago_datos.beneficiario_codigo,
            beneficiario_domicilio: this.ordenDePago_datos.beneficiario_domicilio,

            total: this.ordenDePago_datos.total,
            total_letras: this.ordenDePago_datos.total_letras,
            observaciones: this.ordenDePago_datos.observacion,

            conceptos: conceptos,
            pagos: pagos,
        }

        var url = `${ORDEN_PAGO}/orden_pago.php?&o=${this.objUtf8ToBase64(data)}`
        if (ver == 'descargar') {
            window.open(url + '&D=D');
        } else {
            window.open(url + '&D=I', '_blank', 'location=no,height=800,width=800,scrollbars=yes,status=yes');
        }
    }

    objUtf8ToBase64(ent: any) {
        let str = JSON.stringify(ent)
        let bytes = new TextEncoder().encode(str);
        let base64 = btoa(String.fromCharCode(...new Uint8Array(bytes.buffer)));
        return base64;
    }
    base64toObjUtf8(ent: any) {
        let json = atob(ent);
        let utf8String = decodeURIComponent(escape(json));
        let obj = JSON.parse(utf8String)
        return obj;
    }

}
