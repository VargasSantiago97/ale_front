import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { NumeroLetrasService } from 'src/app/services/numeroLetras/numero-letras.service';

declare var vars: any;
const ORDEN_PAGO = vars.ORDEN_CARGA;

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

    verViajesPreviamenteAfec: any = false

    displayNuevoViaje: any = false
    displayVerAsiento: any = false
    displayNuevoGasto: any = false
    displayOrdenPago: any = false

    cols: any = []
    selectedColumns: any = []

    constructor(
        private messageService: MessageService,
        private comunicacionService: ComunicacionService,
        private numToLet : NumeroLetrasService
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
            if (e.afecta != null && !this.verViajesPreviamenteAfec) {
                if (JSON.parse(e.afecta).length > 0) {
                    movimientosPreviamenteAfectados.push(...JSON.parse(e.afecta))
                }
            }
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

            if (!movimientosPreviamenteAfectados.includes(e.id)) {
                this.dataMovimientosASeleccionar.push({
                    id: e.id,
                    fecha: dateString,
                    cultivo: this.db_granos.some((f: any) => { return f.id == e.id_grano }) ? this.db_granos.find((f: any) => { return f.id == e.id_grano }).alias : '-',
                    orden: this.db_ordenes_carga.some((f: any) => { return f.id_movimiento == e.id }) ? this.db_ordenes_carga.find((f: any) => { return f.id_movimiento == e.id }).numero : '',
                    ctg: '10105050505',
                    cpe: '001-5555',
                    campo: e.campo,
                    pat: patentes,
                    kg_neto_final: e.kg_neto_final,
                    tarifa: 7000,
                    kg_descarga: 35.20,
                    monto_final: 246400
                })
            }
            if (!movimientosPreviamenteAfectadosGastos.includes(e.id)) {
                this.dataMovimientosASeleccionarGastos.push({
                    id: e.id,
                    fecha: dateString,
                    cultivo: this.db_granos.some((f: any) => { return f.id == e.id_grano }) ? this.db_granos.find((f: any) => { return f.id == e.id_grano }).alias : '-',
                    orden: this.db_ordenes_carga.some((f: any) => { return f.id_movimiento == e.id }) ? this.db_ordenes_carga.find((f: any) => { return f.id_movimiento == e.id }).numero : '',
                    ctg: '10105050505',
                    cpe: '001-5555',
                    campo: e.campo,
                    pat: patentes,
                    kg_neto_final: e.kg_neto_final,
                    tarifa: 7000,
                    kg_descarga: 35.20,
                    monto_final: 246400
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
                this.datosAsiento.tipo == "MOV" ? this.uploader.upload() : this.uploaderGasto.upload()
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }

    mostrarAsiento(asiento: any) {
        this.datosAsientoMostrar = this.db_asientos.find((e: any) => { return e.id == asiento.id_asiento })
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


    nuevoOrdenDePago() {

        /*

        {
            "tabla": "medios_pago",

            "id"
            "id_orden"
            "fecha"
            "descripcion"
            "serie"
            "emisor"
            "numero"
            "tipo"
            "valor"
            "creado_por"
            "creado_el"
            "editado_por"
            "editado_el"
            "activo"
            "estado"
        },
        {
            "tabla": "orden_pago",

            "id"
            "id_asiento"
            "id_socio"
            "id_transportista"
            "fecha"
            "beneficiario_razon"
            "beneficiario_domicilio"
            "beneficiario_codigo"
            "beneficiario_cuit"
            "total_letras"
            "total"
            "observacion"
            "fondo"
            "afecta"
            "punto"
            "numero"
            "creado_por"
            "creado_el"
            "editado_por"
            "editado_el"
            "activo"
            "estado"
        }
        */
        this.ordenDePago_pagarParaSeleccionar = []
        this.ordenDePago_descontarParaSeleccionar = []

        var este = {
            fecha: "20/20/2020",
            tipo: "MOV",
            descripcion: "ASDASDASD",
            saldo: "150550",
            afectar: 0
        }
        this.ordenDePago_pagarParaSeleccionar.push({ ... este})
        this.ordenDePago_pagarParaSeleccionar.push({ ... este})
        this.ordenDePago_pagarParaSeleccionar.push({ ... este})

        //filtramos por SOCIO y TRANSPORTISTA
        var asientos_filtrados:any = this.db_asientos.filter((e: any) => {
            return (e.id_socio == this.socio.id) && (e.id_transportista == this.transportista.id)
        });

        //ordenamos por fecha
        asientos_filtrados.sort((ann: any, bnn: any) => {
            const fecha1: any = new Date(ann.fecha)
            const fecha2: any = new Date(bnn.fecha)
            return fecha1 - fecha2
        });



        this.displayOrdenPago = true
    }
    agregarConceptoPagar(concepto:any){
        
    }
    agregarConceptoDescontar(concepto:any){
        
    }

    guardarOrdenPago(){
        console.log(this.ordenDePago_pagarParaSeleccionar)
    }

    mostrarOrdenPago(ver: any) {
        const data: any = {
            numero: '01-12345',
            fecha: '25/05/2023',
            fondo: 'odp_norte.png',
            beneficiario_razon: 'VARGAS, SANTIAGO MANUELÑñó',
            beneficiario_cuit: '20-40500364-4',
            beneficiario_codigo: '01234',
            beneficiario_domicilio: 'LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM ',

            conceptos: [{
                concepto: "FLETE MAIZ - \nCPE 1234 - CTG 10105050505 - FA 004-00000099",
                debe: '',
                haber: '4000000',
                saldo: '400000'
            }, {
                concepto: "FLETE MAIZ - CPE 1234 - CTG 10105050505 - FA 004-00000099",
                debe: '',
                haber: '4000000',
                saldo: '400000'
            }, {
                concepto: "FLETE MAIZ - CPE 1234 - CTG 10105050505 - FA 004-00000099",
                debe: '',
                haber: '4000000',
                saldo: '400000'
            },
            {
                concepto: "COMBUSTIBLE - TICKET N 1234",
                debe: '100000',
                haber: '',
                saldo: '300000'
            }],
            pagos: [{
                tipo: "CHEQUE",
                detalle: "BANCO NACION - NRO: 12121212",
                fecha: '27/02/2023',
                valor: '300000'
            }],
            total: 1234567.89,
            total_letras: this.numToLet.numeroALetras(1234567.89),
            observaciones: 'Observaciones'
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
