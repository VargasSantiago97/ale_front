import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { DatePipe } from '@angular/common';
import { PadronService } from 'src/app/services/padron.service';
import { CpeService } from 'src/app/services/cpe/cpe.service';

declare var vars: any;

const API_URI = vars.API_URI;
const ORDEN_CARGA = vars.ORDEN_CARGA;
const CPE_PROVINCIAS:any = vars.CPE_PROVINCIAS;
const SUCURSAL = vars.SUCURSAL;
const PDF_CPE_URI = vars.PDF_CPE_URI;
const PUNTO_ORDEN_CARGA = vars.PUNTO_ORDEN_CARGA;

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

    cols: any = [];
    selectedColumns: any = [];

    dataParaMostrarTabla: any = []

    displayFiltros: Boolean = true;
    displayNuevoMovimiento: Boolean = false;
    displayBanderas: Boolean = false;
    displayBanderasDis: Boolean = false;
    displayOrdenCarga: Boolean = false;
    displayVistas: Boolean = false;
    displayCPE: Boolean = false;

    accordeonVer = [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false]
    optionsDe: any = [{ label: 'Silo', id: 'S' }, { label: 'Trilla', id: 'T' }, { label: 'Otro', id: 'O' }]

    //DATA-VARIABLES DE DB:
    db_camiones: any = []
    db_choferes: any = []
    db_condicion_iva: any = []
    db_socios: any = []
    db_transportistas: any = []
    db_campanas: any = []
    db_depositos: any = []
    db_establecimientos: any = []
    db_gastos: any = []
    db_granos: any = []
    db_banderas: any = []
    db_corredores: any = []
    db_acopios: any = []
    db_ordenes_carga: any = []
    db_movimientos: any = []
    db_intervinientes: any = []


    load_camiones: any = true
    load_choferes: any = true
    load_condicion_iva: any = true
    load_socios: any = true
    load_transportistas: any = true
    load_campanas: any = true
    load_depositos: any = true
    load_establecimientos: any = true
    load_gastos: any = true
    load_granos: any = true
    load_banderas: any = true
    load_ordenes_carga: any = true
    load_movimientos: any = true
    load_intervinientes: any = true


    datosRegistro: any;

    transportista: any;
    chofer: any;
    camion: any;

    select_choferes: any = [];
    select_camiones: any = [];

    cod_transporte: any;
    cod_chofer: any;
    cod_camion: any;

    establecimiento: any;

    disFlag: any = { icono: null, fondo: null, color: null };
    fondosFlag: any = ['info', 'success', 'warning', 'danger'];
    iconsFlag: any = ['pi-flag-fill', 'pi-bookmark-fill', 'pi-calendar', 'pi-check-square', 'pi-circle-fill', 'pi-cog', 'pi-dollar', 'pi-file-edit', 'pi-info-circle', 'pi-sync', 'pi-thumbs-up-fill', 'pi-thumbs-down-fill', 'pi-user', 'pi-exclamation-triangle', 'pi-exclamation-circle'];

    datosMovimiento: any;
    datosOrdenCarga: any = {};
    datosCPE: any = {};

    existePlantilla = false;

    permiteCrearCTG: any = {
        "9a869d84b572": true,
        "93ff9dd068be": true
    }
    intervinientesCPE: any = {};

    cpeCamposOrigen: any = [];
    cpePlantasDestino: any = [];
    cpeCamposDestino: any = [];

    constructor(
        private comunicacionService: ComunicacionService,
        private messageService: MessageService,
        private padronService: PadronService,
        private cpeService: CpeService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: "cultivo", header: "Cultivo" },
            { field: "fecha", header: "Fecha" },
            { field: "orden", header: "O.C." },
            { field: "benef_orden", header: "Benef Orden" },
            { field: "cpe", header: "N° C.P." },
            { field: "benef", header: "Benef C.P." },
            { field: "ctg", header: "C.T.G." },
            { field: "campo", header: "Campo" },
            { field: "tipo_orig", header: "Desde" },
            { field: "pat", header: "Pat." },
            { field: "patAc", header: "Pat. Ac." },
            { field: "transporte", header: "Transporte" },
            { field: "cuit_transp", header: "CUIT Transp" },
            { field: "gastos", header: "Gastos" },
            { field: "id_corredor", header: "Corredor" },
            { field: "id_acopio", header: "Acopio" },

            { field: "kg_tara", header: "Tara" },
            { field: "kg_bruto", header: "Bruto" },
            { field: "kg_neto", header: "Neto" },
            { field: "kg_regulacion", header: "Carga/Desc" },
            { field: "kg_neto_final", header: "Neto Final" },

            { field: "factura", header: "Factura" },
            { field: "pagado", header: "Pagado" },
            { field: "observaciones", header: "Obser" },
        ];
        this.selectedColumns = [
            { field: "cultivo", header: "Cultivo" },
            { field: "fecha", header: "Fecha" },
            { field: "orden", header: "O.C." },
            { field: "benef_orden", header: "Benef Orden" },
            { field: "cpe", header: "N° C.P." },
            { field: "benef", header: "Benef C.P." },
            { field: "ctg", header: "C.T.G." },
            { field: "campo", header: "Campo" },
            { field: "tipo_orig", header: "Desde" },
            { field: "pat", header: "Pat." },
            { field: "patAc", header: "Pat. Ac." },
            { field: "transporte", header: "Transporte" },
            { field: "cuit_transp", header: "CUIT Transp" },
            { field: "gastos", header: "Gastos" },
            { field: "id_corredor", header: "Corredor" },
            { field: "id_acopio", header: "Acopio" },

            { field: "kg_tara", header: "Tara" },
            { field: "kg_bruto", header: "Bruto" },
            { field: "kg_neto", header: "Neto" },
            { field: "kg_regulacion", header: "Carga/Desc" },
            { field: "kg_neto_final", header: "Neto Final" },

            { field: "factura", header: "Factura" },
            { field: "pagado", header: "Pagado" },
            { field: "observaciones", header: "Obser" },
        ];

        this.obtenerCamiones()
        this.obtenerChoferes()
        this.obtenerCondicion_iva()
        this.obtenerSocios()
        this.obtenerTransportistas()
        this.obtenerCampanas()
        this.obtenerDepositos()
        this.obtenerEstablecimientos()
        this.obtenerGastos()
        this.obtenerGranos()
        this.obtenerBanderas()
        this.obtenerOrdenesCarga()
        this.obtenerIntervinientes()
        this.obtenerMovimientos()

        this.datosMovimiento = {
            id: null,
            fecha: null,
            id_campana: "3a3f05f44963",
            id_socio: null,
            id_origen: null,
            id_grano: null,
            id_transporte: null,
            id_chofer: null,
            id_camion: null,
            id_corredor: null,
            id_acopio: null,
            id_deposito: null,
            id_bandera: null,
            kg_bruto: null,
            kg_tara: null,
            kg_neto: null,
            kg_regulacion: null,
            kg_neto_final: null,
            observaciones: null,
            tipo_origen: 'T',
            creado_por: null,
            creado_el: null,
            editado_por: null,
            editado_el: null,
            activo: null,
            estado: null
        }

        this.intervinientesCPE = {
            destinatario: [{ razon_social: 'nom', cuit: 123 }],
            destino: [{ razon_social: 'nom', cuit: 123 }],
            corredor_venta_primaria: [{ razon_social: 'nom', cuit: 123 }],
            corredor_venta_secundaria: [{ razon_social: 'nom', cuit: 123 }],
            mercado_a_termino: [{ razon_social: 'nom', cuit: 123 }],
            remitente_comercial_venta_primaria: [{ razon_social: 'nom', cuit: 123 }],
            remitente_comercial_venta_secundaria: [{ razon_social: 'nom', cuit: 123 }],
            remitente_comercial_venta_secundaria2: [{ razon_social: 'nom', cuit: 123 }],
            representante_entregador: [{ razon_social: 'nom', cuit: 123 }],
            representante_recibidor: [{ razon_social: 'nom', cuit: 123 }],
            remitente_comercial_productor: [{ razon_social: 'nom', cuit: 123 }],
            chofer: [{ razon_social: 'nom', cuit: 123 }],
            intermediario_flete: [{ razon_social: 'nom', cuit: 123 }],
            pagador_flete: [{ razon_social: 'nom', cuit: 123 }],
            transportista: [{ razon_social: 'nom', cuit: 123 }]
        };
    }

    obtenerCamiones() {
        this.comunicacionService.getDB('camiones').subscribe(
            (res: any) => {
                this.db_camiones = res;
                this.load_camiones = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerChoferes() {
        this.comunicacionService.getDB('choferes').subscribe(
            (res: any) => {
                this.db_choferes = res;
                this.load_choferes = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerCondicion_iva() {
        this.comunicacionService.getDB('condicion_iva').subscribe(
            (res: any) => {
                this.db_condicion_iva = res;
                this.load_condicion_iva = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerSocios() {
        this.comunicacionService.getDB('socios').subscribe(
            (res: any) => {
                this.db_socios = res;
                this.load_socios = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerTransportistas() {
        this.comunicacionService.getDB('transportistas').subscribe(
            (res: any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerCampanas() {
        this.comunicacionService.getDB('campanas').subscribe(
            (res: any) => {
                this.db_campanas = res;
                this.load_campanas = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerDepositos() {
        this.comunicacionService.getDB('depositos').subscribe(
            (res: any) => {
                this.db_depositos = res;
                this.load_depositos = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerEstablecimientos() {
        this.comunicacionService.getDB('establecimientos').subscribe(
            (res: any) => {
                this.db_establecimientos = res;
                this.load_establecimientos = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerGastos() {
        this.comunicacionService.getDB('gastos').subscribe(
            (res: any) => {
                this.db_gastos = res;
                this.load_gastos = false;
                this.datosParaTabla()
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
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerBanderas() {
        this.comunicacionService.getDB('banderas').subscribe(
            (res: any) => {
                this.db_banderas = res;
                this.load_banderas = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerOrdenesCarga(){
        this.comunicacionService.getDB('orden_carga').subscribe(
            (res: any) => {
                this.db_ordenes_carga = res;
                this.load_ordenes_carga = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerIntervinientes(){
        this.comunicacionService.getDB('intervinientes').subscribe(
            (res: any) => {
                console.log(res)
                this.db_intervinientes = res;
                this.db_acopios = [... res.filter((e:any) => { return e.dstno == 1})]
                this.db_corredores = [... res.filter((e:any) => { return e.corvtapri == 1})]
                this.load_intervinientes = false;
                this.datosParaTabla()
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
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    actualizarTransportistas() {
        this.comunicacionService.getDB('transportistas').subscribe(
            (res: any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    actualizarCamiones() {
        this.comunicacionService.getDB('camiones').subscribe(
            (res: any) => {
                this.db_camiones = res;
                this.select_camiones = res;
                this.load_camiones = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    actualizarChoferes() {
        this.comunicacionService.getDB('choferes').subscribe(
            (res: any) => {
                this.db_choferes = res;
                this.select_choferes = res;
                this.load_choferes = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    datosParaTabla() {
        if (!(this.load_camiones || this.load_choferes || this.load_condicion_iva || this.load_socios || this.load_transportistas || this.load_campanas || this.load_depositos || this.load_establecimientos || this.load_gastos || this.load_granos || this.load_banderas || this.load_movimientos || this.load_ordenes_carga || this.load_intervinientes)) {
            this.dataParaMostrarTabla = []

            this.db_movimientos.forEach((e: any) => {
                this.dataParaMostrarTabla.push(e)
            });
        }
    }


    buscarTransporte() {
        if (this.db_transportistas.some((e: any) => { return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase() })) {
            this.transportista = { ... this.db_transportistas.find((e: any) => { return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase() }) }
            this.datosMovimiento.id_transporte = this.transportista.id
            this.buscarChoferesCamiones()
        } else {
            this.transportista = null
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'TRANSPORTISTA no encontrado' })
        }

    }

    buscarChofer() {
        if (this.select_choferes.some((e: any) => { return e.codigo.toUpperCase() == this.cod_chofer.toUpperCase() })) {
            this.chofer = { ... this.select_choferes.find((e: any) => { return e.codigo.toUpperCase() == this.cod_chofer.toUpperCase() }) }
        } else {
            this.chofer = null
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'CHOFER no encontrado' })
        }
    }

    buscarCamion() {
        if (this.select_camiones.some((e: any) => { return e.codigo.toUpperCase() == this.cod_camion.toUpperCase() })) {
            this.camion = { ... this.select_camiones.find((e: any) => { return e.codigo.toUpperCase() == this.cod_camion.toUpperCase() }) }
        } else {
            this.camion = null
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'CAMION no encontrado' })
        }
    }


    onSelectTransporte() {
        if (this.datosMovimiento.id_transporte) {
            this.transportista = this.db_transportistas.find((e: any) => { return e.id == this.datosMovimiento.id_transporte })
            this.cod_transporte = this.transportista.codigo
            this.buscarChoferesCamiones()
        }
    }

    onSelectChofer() {
        if (this.datosMovimiento.id_chofer) {
            this.chofer = this.db_choferes.find((e: any) => { return e.id == this.datosMovimiento.id_chofer })
            this.cod_chofer = this.chofer.codigo
        } else {
            this.chofer = {}
            this.cod_chofer = ''
        }
    }

    onSelectCamion() {
        if (this.datosMovimiento.id_camion) {
            this.camion = this.db_camiones.find((e: any) => { return e.id == this.datosMovimiento.id_camion })
            this.cod_camion = this.camion.codigo
            this.datosMovimiento.kg_tara = this.camion.kg_tara
        } else {
            this.camion = {}
            this.cod_camion = ''
            this.datosMovimiento.kg_tara = null
        }
    }

    buscarChoferesCamiones() {
        this.select_choferes = this.db_choferes.filter((e: any) => { return e.id_transportista == this.transportista.id })
        this.select_camiones = this.db_camiones.filter((e: any) => { return e.id_transportista == this.transportista.id })

        if (this.select_choferes) {
            if (this.select_choferes.length) {
                this.datosMovimiento.id_chofer = this.select_choferes[0].id
            } else {
                this.datosMovimiento.id_chofer = null
            }
            this.onSelectChofer()
        }

        if (this.select_camiones) {
            if (this.select_camiones.length) {
                this.datosMovimiento.id_camion = this.select_camiones[0].id
            } else {
                this.datosMovimiento.id_camion = null
            }
            this.onSelectCamion()
        }
    }

    verTodosChoferes() {
        this.select_choferes = [...this.db_choferes]
    }
    verTodosCamiones() {
        this.select_camiones = [...this.db_camiones]
    }


    calcularKilos(event: any, ingresa: any) {

        this.datosMovimiento

        if (ingresa == 'kilos_bruto') {
            this.datosMovimiento.kg_bruto = event
            this.datosMovimiento.kg_neto = this.datosMovimiento.kg_bruto - this.datosMovimiento.kg_tara
        }
        if (ingresa == 'kilos_tara' && this.datosMovimiento.kg_bruto) {
            this.datosMovimiento.kg_tara = event
            this.datosMovimiento.kg_neto = this.datosMovimiento.kg_bruto - this.datosMovimiento.kg_tara
        }
        if (ingresa == 'kilos_neto') {
            this.datosMovimiento.kg_neto = event
            this.datosMovimiento.kg_bruto = this.datosMovimiento.kg_neto + this.datosMovimiento.kg_tara
        }


        if (ingresa == 'kilos_carga_descarga') {
            this.datosMovimiento.kg_regulacion = event
        }
        if (this.datosMovimiento.kg_neto) {
            this.datosMovimiento.kg_neto_final = this.datosMovimiento.kg_neto + this.datosMovimiento.kg_regulacion
        }

        if (ingresa == 'kilos_neto_final') {
            this.datosMovimiento.kg_neto_final = event
            this.datosMovimiento.kg_neto = this.datosMovimiento.kg_neto_final - this.datosMovimiento.kg_regulacion
            this.datosMovimiento.kg_bruto = this.datosMovimiento.kg_neto + this.datosMovimiento.kg_tara
        }
    }
    save(event: any) {
        console.log("You entered: ", event.target.value);
    }


    nuevoMovimiento() {
        var fecha = new Date()
        fecha.setHours(fecha.getHours() - 3);

        const datePipe = new DatePipe('en-US');
        const fechaHoy = datePipe.transform(fecha, 'yyyy-MM-dd');

        this.datosMovimiento = {
            id: null,
            fecha: null,
            id_campana: null,
            id_socio: null,
            id_origen: null,
            id_grano: null,
            id_transporte: null,
            id_chofer: null,
            id_camion: null,
            id_corredor: null,
            id_acopio: null,
            id_deposito: null,
            id_bandera: null,
            kg_bruto: null,
            kg_tara: null,
            kg_neto: null,
            kg_regulacion: null,
            kg_neto_final: null,
            observaciones: null,
            tipo_origen: null,
            creado_por: null,
            creado_el: null,
            editado_por: null,
            editado_el: null,
            activo: 1,
            estado: 1
        }

        if (localStorage.getItem('plantilla')) {
            this.datosMovimiento = this.base64toObjUtf8(localStorage.getItem('plantilla'))
            this.datosMovimiento.id = null
            this.existePlantilla = true;
        }

        this.datosMovimiento.fecha = fechaHoy

        this.setearTransporteChoferCamion()

        this.displayNuevoMovimiento = true
    }
    guardarMovimiento() {
        var idd = this.generateUUID()
        if (this.db_movimientos.some((e: any) => { return e.id == idd })) {
            this.guardarMovimiento()
            return
        }

        this.datosMovimiento.id = idd

        var fecha = new Date(this.datosMovimiento.fecha);
        this.datosMovimiento.fecha = fecha.toISOString().slice(0, 19).replace('T', ' ');

        this.datosMovimiento.activo = 1


        this.comunicacionService.createDB("movimientos", this.datosMovimiento).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.displayNuevoMovimiento = false
                this.obtenerMovimientos()
                this.nuevaOrdenCarga()
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }
    editarMovimiento() {

        var fecha = new Date(this.datosMovimiento.fecha);
        this.datosMovimiento.fecha = fecha.toISOString().slice(0, 19).replace('T', ' ');

        this.comunicacionService.updateDB("movimientos", this.datosMovimiento).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Editado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.displayNuevoMovimiento = false
                this.obtenerMovimientos()
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }
    borrarMovimiento() {
        if (confirm('Desea eliminar Movimiento?')) {
            this.datosMovimiento.estado = 0
            this.comunicacionService.updateDB("movimientos", this.datosMovimiento).subscribe(
                (res: any) => {
                    res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                    this.displayNuevoMovimiento = false
                    this.obtenerMovimientos()
                },
                (err: any) => {
                    console.log(err)
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
                }
            )
        }
    }
    mostrarMovimiento(mov: any) {
        this.datosMovimiento = { ...mov }

        var fecha = new Date(this.datosMovimiento.fecha)
        const datePipe = new DatePipe('en-US');
        const fechaMov = datePipe.transform(fecha, 'yyyy-MM-dd');

        this.datosMovimiento.fecha = fechaMov;

        this.setearTransporteChoferCamion()

        this.displayNuevoMovimiento = true;
    }
    setearTransporteChoferCamion() {
        this.select_choferes = [... this.db_choferes]
        this.select_camiones = [... this.db_camiones]

        if (this.datosMovimiento.id_transporte) {
            this.transportista = this.db_transportistas.find((e: any) => { return e.id == this.datosMovimiento.id_transporte })
            this.cod_transporte = this.transportista.codigo
        } else {
            this.transportista = {}
            this.cod_transporte = ''
        }
        if (this.datosMovimiento.id_chofer) {
            this.chofer = this.db_choferes.find((e: any) => { return e.id == this.datosMovimiento.id_chofer })
            this.cod_chofer = this.chofer.codigo
        } else {
            this.chofer = {}
            this.cod_chofer = ''
        }
        if (this.datosMovimiento.id_camion) {
            this.camion = this.db_camiones.find((e: any) => { return e.id == this.datosMovimiento.id_camion })
            this.cod_camion = this.camion.codigo
        } else {
            this.camion = {}
            this.cod_camion = ''
        }
    }

    //BANDERAS
    agregarBandera() {
        this.db_banderas.push({
            icono: 'pi-flag-fill',
            fondo: 'success',
            color: '#FFFFFF'
        })
    }
    duplicarBandera(dato: any) {
        var datoAgregar = { ...dato }
        datoAgregar.id = false
        this.db_banderas.push(datoAgregar)
    }
    eliminarBandera(dato: any) {
        if (confirm('Desea eliminar elemento?')) {
            dato.estado = 0
            this.comunicacionService.updateDB("banderas", dato).subscribe(
                (res: any) => {
                    res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                    this.obtenerBanderas()
                },
                (err: any) => {
                    console.log(err)
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
                }
            )
        }
    }
    editarBandera(dato: any) {
        this.comunicacionService.updateDB("banderas", dato).subscribe(
            (res: any) => {
                console.log(res)
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Editado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }
    guardarBandera(dato: any) {
        var idd = this.generateUUID()
        if (this.db_banderas.some((e: any) => { return e.id == idd })) {
            this.messageService.add({ severity: 'info', summary: 'INTENTE NUEVAMENTE', detail: 'Hubo un error interno en UUID. Vuelva a presionar "guardar"' })
            return
        }

        dato.id = idd

        this.comunicacionService.createDB("banderas", dato).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.obtenerBanderas()
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }
    disenarFlag(bandera: any) {
        this.disFlag = bandera
        this.displayBanderasDis = true
    }

    //ORDEN CARGA
    nuevaOrdenCarga() {

        var fecha = new Date(this.datosMovimiento.fecha);
        const fechaFormateada = fecha.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, "/");

        this.datosOrdenCarga = {
            id: null,
            id_movimiento: this.datosMovimiento.id,
            numero: this.generateNumeroOrdenDeCarga(),
            fecha: fechaFormateada,
            beneficiario: this.transformarDatoMostrar(this.datosMovimiento.id_socio, "socio").toUpperCase(),
            transportista: this.transformarDatoMostrar(this.datosMovimiento.id_transporte, "transporte").split(" ").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
            conductor: this.transformarDatoMostrar(this.datosMovimiento.id_chofer, "chofer").split(" ").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
            patentes: this.transformarDatoMostrar(this.datosMovimiento.id_camion, "patentes"),
            establecimiento: this.transformarDatoMostrar(this.datosMovimiento.id_origen, "establecimiento").toUpperCase(),
            cultivo: this.transformarDatoMostrar(this.datosMovimiento.id_grano, "grano").toUpperCase(),
            trilla_silo: this.transformarDatoMostrar(this.datosMovimiento.tipo_origen, "tipo_origen").toUpperCase(),
            tara: this.transformarDatoMostrar(this.datosMovimiento.kg_tara, "kilos"),
            bruto: this.transformarDatoMostrar(this.datosMovimiento.kg_bruto, "kilos"),
            neto: this.transformarDatoMostrar(this.datosMovimiento.kg_neto, "kilos"),
            firma1: this.transformarDatoMostrar(this.datosMovimiento.id_chofer, "chofer").split(" ").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
            firma2: 'cargador',
            observaciones: ''
        }

        this.displayOrdenCarga = true
    }

    guardarOrdenCarga(accion: any) {


        if(this.datosOrdenCarga.id){
            this.editarOrdenCargaEnDB()
        } else {
            this.guardarOrdenCargaEnDB()
        }

        if (accion == 'guardar_ver') {
            this.mostrarOrdenCarga('ver')
        }
        if (accion == 'guardar_descargar') {
            this.mostrarOrdenCarga('descargar')
        }

        this.displayOrdenCarga = false

    }

    agregarOrdenCargaRegistro(registro:any){

        var fecha = new Date(registro.fecha);
        const fechaFormateada = fecha.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, "/");

        this.datosOrdenCarga = {
            id: null,
            id_movimiento: registro.id,
            numero: this.generateNumeroOrdenDeCarga(),
            fecha: fechaFormateada,
            beneficiario: this.transformarDatoMostrar(registro.id_socio, "socio").toUpperCase(),
            transportista: this.transformarDatoMostrar(registro.id_transporte, "transporte").split(" ").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
            conductor: this.transformarDatoMostrar(registro.id_chofer, "chofer").split(" ").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
            patentes: this.transformarDatoMostrar(registro.id_camion, "patentes"),
            establecimiento: this.transformarDatoMostrar(registro.id_origen, "establecimiento").toUpperCase(),
            cultivo: this.transformarDatoMostrar(registro.id_grano, "grano").toUpperCase(),
            trilla_silo: this.transformarDatoMostrar(registro.tipo_origen, "tipo_origen").toUpperCase(),
            tara: this.transformarDatoMostrar(registro.kg_tara, "kilos"),
            bruto: this.transformarDatoMostrar(registro.kg_bruto, "kilos"),
            neto: this.transformarDatoMostrar(registro.kg_neto, "kilos"),
            firma1: this.transformarDatoMostrar(registro.id_chofer, "chofer").split(" ").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
            firma2: 'cargador',
            observaciones: ''
        }

        this.displayOrdenCarga = true
    }
    mostrarModalOrdenCarga(registro:any){
        var ordenCarga:any = this.db_ordenes_carga.find((e:any) => { return e.id_movimiento == registro })

        this.datosOrdenCarga = ordenCarga

        this.displayOrdenCarga = true
    }

    guardarOrdenCargaEnDB(){
        var idd = this.generateUUID()
        if (this.db_ordenes_carga.some((e: any) => { return e.id == idd })) {
            this.guardarOrdenCargaEnDB()
            return
        }

        this.datosOrdenCarga.id = idd

        this.datosOrdenCarga.activo = 1

        this.comunicacionService.createDB("orden_carga", this.datosOrdenCarga).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Creado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.obtenerOrdenesCarga()
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }
    editarOrdenCargaEnDB(){
        this.comunicacionService.updateDB("orden_carga", this.datosOrdenCarga).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Editado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.obtenerOrdenesCarga()
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }

    borrarOrdenCarga(ordenCarga:any){
        if (confirm('Desea eliminar elemento?')) {
            ordenCarga.estado = 0
            this.comunicacionService.updateDB("orden_carga", ordenCarga).subscribe(
                (res: any) => {
                    res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                    this.obtenerOrdenesCarga()
                },
                (err: any) => {
                    console.log(err)
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
                }
            )
        }
    }

    //plantilla
    guardarPlantilla() {
        localStorage.setItem('plantilla', this.objUtf8ToBase64(this.datosMovimiento))
        this.existePlantilla = true
        this.messageService.add({ severity: 'success', summary: 'Guardado!', detail: 'Plantilla Guardada' })
    }
    borrarPlantilla() {
        localStorage.removeItem('plantilla')
        this.existePlantilla = false
        this.messageService.add({ severity: 'info', summary: 'Atencion!', detail: 'Plantilla Borrada' })
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
    generateNumeroOrdenDeCarga() {

        const numeroMasGrande = this.db_ordenes_carga.reduce((acumulado:any, objetoActual:any) => {
            if(parseInt(objetoActual.numero.split("-")[0]) == parseInt(PUNTO_ORDEN_CARGA)){
                const valor = parseInt(objetoActual.numero.split("-")[1])
                return Math.max(acumulado, valor);
            }
            return false
        }, 0);

        const punto = PUNTO_ORDEN_CARGA.toString().padStart(2, '0');
        const numero = (numeroMasGrande+1).toString().padStart(5, '0');
        return punto + "-" + numero;
    }

    transformarDatoMostrar(dato: any, tipo: any) {
        if (tipo == 'condicion_iva') {
            return this.db_condicion_iva.some((e: any) => { return e.codigo == dato }) ? this.db_condicion_iva.find((e: any) => { return e.codigo == dato }).descripcion : '-'
        }

        if (tipo == 'id_origen') {
            return this.db_establecimientos.some((e: any) => { return e.id == dato }) ? this.db_establecimientos.find((e: any) => { return e.id == dato }).descripcion : '-'
        }

        if (tipo == 'kilos') {
            if (dato) {
                var numero = parseInt(dato)
                return numero.toLocaleString("es-ES") ? numero.toLocaleString("es-ES") : null;
            }
        }


        if (tipo == 'socio') {
            return this.db_socios.some((e: any) => { return e.id == dato }) ? this.db_socios.find((e: any) => { return e.id == dato }).razon_social : '-'
        }

        if (tipo == 'transporte') {
            return this.db_transportistas.some((e: any) => { return e.id == dato }) ? this.db_transportistas.find((e: any) => { return e.id == dato }).razon_social : '-'
        }

        if (tipo == 'chofer') {
            return this.db_choferes.some((e: any) => { return e.id == dato }) ? this.db_choferes.find((e: any) => { return e.id == dato }).razon_social : '-'
        }

        if (tipo == 'patentes') {
            if (this.db_camiones.some((e: any) => { return e.id == dato })) {
                var camion = this.db_camiones.find((e: any) => { return e.id == dato })
                var patentes = ""
                camion.patente_chasis ? patentes += camion.patente_chasis : null
                camion.patente_acoplado ? patentes += " / " + camion.patente_acoplado : null
                camion.patente_otro ? patentes += " / " + camion.patente_otro : null

                return patentes
            }
        }

        if (tipo == 'establecimiento') {
            return this.db_establecimientos.some((e: any) => { return e.id == dato }) ? this.db_establecimientos.find((e: any) => { return e.id == dato }).descripcion : '-'
        }

        if (tipo == 'grano') {
            return this.db_granos.some((e: any) => { return e.id == dato }) ? this.db_granos.find((e: any) => { return e.id == dato }).descripcion : '-'
        }

        if (tipo == 'tipo_origen') {
            return this.optionsDe.some((e: any) => { return e.id == dato }) ? this.optionsDe.find((e: any) => { return e.id == dato }).label : '-'
        }

        if (tipo == 'provinciaCPE') {
            return CPE_PROVINCIAS.some((e: any) => { return e.codigo == dato }) ? CPE_PROVINCIAS.find((e: any) => { return e.codigo == dato }).descripcion : dato
        }

        return dato
    }
    transformarDatoMostrarTabla(registro: any, tipo: any) {
        if (tipo == 'fecha') {
            var fecha = new Date(registro.fecha)
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(fecha, 'yyyy-MM-dd');
        }
        if (tipo == 'cultivo') {
            return this.db_granos.some((e: any) => { return e.id == registro.id_grano }) ? this.db_granos.find((e: any) => { return e.id == registro.id_grano }).alias : '-'
        }
        if (tipo == 'benef_orden') {
            return this.db_socios.some((e: any) => { return e.id == registro.id_socio }) ? this.db_socios.find((e: any) => { return e.id == registro.id_socio }).alias : '-'
        }
        if (tipo == 'orden') {
            return ""
        }
        if (tipo == 'ordenNumero') {
            if(this.db_ordenes_carga.some((e:any) => { return e.id_movimiento == registro.id})){
                return this.db_ordenes_carga.find((e:any) => { return e.id_movimiento == registro.id}).numero
            } else {
                return ""
            }
        }
        if (tipo == 'existeOrdenCarga') {
            return this.db_ordenes_carga.some((e:any) => { return e.id_movimiento == registro})
        }
        if (tipo == 'cpe') {
            return '~cpe~'
        }
        if (tipo == 'benef') {
            return '~benef~'
        }
        if (tipo == 'ctg') {
            return '~ctg~'
        }
        if (tipo == 'campo') {
            return this.db_establecimientos.some((e: any) => { return e.id == registro.id_origen }) ? this.db_establecimientos.find((e: any) => { return e.id == registro.id_origen }).alias : '-'
        }
        if (tipo == 'tipo_orig') {
            return this.optionsDe.some((e: any) => { return e.id == registro.tipo_origen }) ? this.optionsDe.find((e: any) => { return e.id == registro.tipo_origen }).label : '-'
        }
        if (tipo == 'pat') {
            return this.db_camiones.some((e: any) => { return e.id == registro.id_camion }) ? this.db_camiones.find((e: any) => { return e.id == registro.id_camion }).patente_chasis : '-'
        }
        if (tipo == 'patAc') {
            return this.db_camiones.some((e: any) => { return e.id == registro.id_camion }) ? this.db_camiones.find((e: any) => { return e.id == registro.id_camion }).patente_acoplado : '-'
        }
        if (tipo == 'transporte') {
            return this.db_transportistas.some((e: any) => { return e.id == registro.id_transporte }) ? this.db_transportistas.find((e: any) => { return e.id == registro.id_transporte }).alias : '-'
        }
        if (tipo == 'cuit_transp') {
            return this.db_transportistas.some((e: any) => { return e.id == registro.id_transporte }) ? this.db_transportistas.find((e: any) => { return e.id == registro.id_transporte }).cuit : '-'
        }
        if (tipo == 'gastos') {
            return '~gastos~'
        }
        if (tipo == 'id_corredor') {
            return this.db_corredores.some((e: any) => { return e.id == registro.id_corredor }) ? this.db_corredores.find((e: any) => { return e.id == registro.id_corredor }).alias : '-'
        }
        if (tipo == 'id_acopio') {
            return this.db_acopios.some((e: any) => { return e.id == registro.id_acopio }) ? this.db_acopios.find((e: any) => { return e.id == registro.id_acopio }).alias : '-'
        }
        if (tipo == 'kg_tara') {
            return registro.kg_tara ? registro.kg_tara.toLocaleString("es-AR") : '-'
        }
        if (tipo == 'kg_bruto') {
            return registro.kg_bruto ? registro.kg_bruto.toLocaleString("es-AR") : '-'
        }
        if (tipo == 'kg_neto') {
            return registro.kg_neto ? registro.kg_neto.toLocaleString("es-AR") : '-'
        }
        if (tipo == 'kg_regulacion') {
            return registro.kg_regulacion ? registro.kg_regulacion.toLocaleString("es-AR") : '-'
        }
        if (tipo == 'kg_neto_final') {
            return registro.kg_neto_final ? registro.kg_neto_final.toLocaleString("es-AR") : '-'
        }
        if (tipo == 'factura') {
            return '~fac~'
        }
        if (tipo == 'pagado') {
            return '~pag~'
        }
        if (tipo == 'observaciones') {
            return registro.observaciones ? registro.observaciones : '-'
        }



        return registro.id
    }

    tiraFun(e: any) {
        console.log(e)
    }

    verVars() {
        console.log(this.transportista)
        console.log(this.chofer)
        console.log(this.camion)
    }

    mostrarOrdenCarga(ver: any) {
        var url = `${ORDEN_CARGA}/orden_carga.php?&o=${this.objUtf8ToBase64(this.datosOrdenCarga)}`
        if (ver == 'descargar') {
            window.open(url + '&D=D');
        } else {
            window.open(url + '&D=I', '_blank', 'location=no,height=800,width=800,scrollbars=yes,status=yes');
        }
    }

    columnsTabla(opc: any) {
        if (opc == 'todo') {
            this.selectedColumns = this.cols
        }
        if (opc == 1) {
            this.selectedColumns = [
                { field: "cultivo", header: "Cultivo" },
                { field: "fecha", header: "Fecha" },
                { field: "benef", header: "Benef C.P." },
                { field: "ctg", header: "C.T.G." },
                { field: "campo", header: "Campo" },
                { field: "pat", header: "Pat." },
                { field: "transporte", header: "Transporte" },
                { field: "gastos", header: "Gastos" },
                { field: "kg_neto_final", header: "Neto Final" },

                { field: "factura", header: "Factura" },
                { field: "pagado", header: "Pagado" },
                { field: "observaciones", header: "Obser" },
            ];
        }

        this.displayVistas = false
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

    mostrar(e: any) {
        console.log(e)
    }

    mostrat(e: any) {
        //console.log(e)
        /* 
        var data = {
            cuit: 30715327720,
            ejecutar: "dummy",
            data: {}
        }
        var data = {
            cuit: 30715327720,
            ejecutar: "provincias",
            data: {}
        }
        var data = {
            cuit: 30715327720,
            ejecutar: "tipos_grano",
            data: {}
        }
        var data = {
            cuit: 30715327720,
            ejecutar: "localidades_por_provincias",
            data: {
                cod_provincia: 16
            }
        } 
        var data = {
            cuit: 30715327720,
            ejecutar: "tipos_grano",
            data: {}
        } 
        data = {
            cuit: 30715327720,
            ejecutar: "localidades_productor",
            data: {
                cuit: 30714518549
            }
        } 
        data = {
            cuit: 30715327720,
            ejecutar: "plantas",
            data: {
                cuit: 3068700023
            }
        }
        data = {
            cuit: 30715327720,
            ejecutar: "consultar_cpe_automotor",
            data: {
                sucursal: 0,
                nro_orden: 1197
            }
        }
        data = {
            cuit: 30715327720,
            ejecutar: "consultar_cpe_automotor",
            data: {
                ctg: 10108738847,
            }
        }
        data = {
            cuit: 30715327720,
            ejecutar: "autorizar_cpe_automotor",
            data: {
                //AGREGAR CABECERA
                tipo_cpe: 74,
                cuit_solicitante: 30715327720,
                sucursal: 1,
                nro_orden:null, //solo
                observaciones: '',

                //AGREGAR ORIGEN
                planta_origen: false,          //no campo -> false
                cod_provincia_operador: false, //no campo -> false
                cod_localidad_operador: false, //no campo -> false
                cod_provincia_productor: 1,
                cod_localidad_productor: 1, //es campo. En caso de no serlo -> false

                //AGREGAR DESTINO
                planta_destino: 1,
                cod_provincia: 1,
                es_destino_campo: false,
                cod_localidad: 1,
                cuit_destino: 123,
                cuit_destinatario: 123,

                //AGREGAR RETIRO PRODUCTOR
                certificado_coe: false, //ret. product.Sino -> false
                cuit_remitente_comercial_productor: 1, //ret. product.
                corresponde_retiro_productor: false,
                es_solicitante_campo: true,

                //AGREGAR INTERVINIENTES
                cuit_corredor_venta_primaria: null,
                cuit_corredor_venta_secundaria: null,
                cuit_mercado_a_termino: null,
                cuit_remitente_comercial_venta_primaria: null,
                cuit_remitente_comercial_venta_secundaria: null,
                cuit_remitente_comercial_venta_secundaria2: null,
                cuit_representante_entregador: null,
                cuit_representante_recibidor: null,

                //AGREGAR DATOS CARGA
                peso_tara: 1,
                peso_bruto: 1,
                cod_grano: 23,
                cosecha: 2223,

                //AGREGAR TRANSPORTE
                cuit_transportista: 20120372913,
                fecha_hora_partida: 1, //ver formato
                codigo_turno: "00",
                dominio: ["AB001ST", "AB001TS"],
                km_recorrer: 500, //obligatorio
                cuit_chofer: 20333333334,
                tarifa_referencia: 100.10,
                tarifa: 100.10,
                cuit_pagador_flete: 20333333334,
                cuit_intermediario_flete: 20333333334,
                mercaderia_fumigada: true,
            }
        }
                var data:any = {
            cuit: 30715327720,
            ejecutar: "anular_cpe",
            data: {
                //AGREGAR CABECERA
                tipo_cpe: 74,
                sucursal: 1,
                nro_orden:null,
            }
        }

        data = {
            cuit: 30715327720,
            ejecutar: "rechazo_cpe",
            data: {
                //AGREGAR CABECERA
                tipo_cpe: 74,
                sucursal: 1,
                nro_orden:null,
            }
        }

        data = {
            cuit: 30715327720,
            ejecutar: "editar_cpe_automotor",
            data: {
                //AGREGAR DESTINO
                planta_destino: 1,
                cod_provincia: 1,
                es_destino_campo: false,
                cod_localidad: 1,
                cuit_destino: 123,
                cuit_destinatario: 123,

                //AGREGAR INTERVINIENTES
                cuit_corredor_venta_primaria: null,
                cuit_corredor_venta_secundaria: null,
                cuit_remitente_comercial_venta_primaria: null,
                cuit_remitente_comercial_venta_secundaria: null,
                cuit_remitente_comercial_venta_secundaria2: null,

                nro_ctg: null,
                cuit_chofer: null,
                cuit_transportista: null,
                peso_bruto: null,
                cod_grano: null,
                dominio: null
            }
        }
        */

        var data = {
            cuit: 20319442473,
            ejecutar: "consultar_cpe_automotor",
            data: {
                sucursal: 0,
                nro_orden: 205
            }
        }


        this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
            (res: any) => {
                console.log(res)
                if(res.mensaje.toString().length == 11){
                    window.open(PDF_CPE_URI + '/' + res.mensaje + '.pdf', '_blank', 'location=no,height=800,width=800,scrollbars=yes,status=yes');
                }
            },
            (err: any) => {
                console.log(err)
            }
        )
    }


    abrirModalCrearCPE(mov: any) {
        this.intervinientesCPE = {
            destinatario: [... this.db_intervinientes.filter((e:any) => { return e.dstro == 1})],
            destino: [... this.db_intervinientes.filter((e:any) => { return e.dstno == 1})],
            corredor_venta_primaria: [... this.db_intervinientes.filter((e:any) => { return e.corvtapri == 1})],
            corredor_venta_secundaria: [... this.db_intervinientes.filter((e:any) => { return e.corvtasec == 1})],
            mercado_a_termino: [... this.db_intervinientes.filter((e:any) => { return e.mertermino == 1})],
            remitente_comercial_venta_primaria: [... this.db_intervinientes.filter((e:any) => { return e.rtecomvtapri == 1})],
            remitente_comercial_venta_secundaria: [... this.db_intervinientes.filter((e:any) => { return e.rtecomvtasec == 1})],
            remitente_comercial_venta_secundaria2: [... this.db_intervinientes.filter((e:any) => { return e.rtecomvtasec2 == 1})],
            representante_entregador: [... this.db_intervinientes.filter((e:any) => { return e.rteent == 1})],
            representante_recibidor: [... this.db_intervinientes.filter((e:any) => { return e.rterec == 1})],
            remitente_comercial_productor: [... this.db_intervinientes.filter((e:any) => { return e.rtecomprod == 1})],
            intermediario_flete: [... this.db_intervinientes.filter((e:any) => { return e.intflet == 1})],
            pagador_flete: [... this.db_intervinientes.filter((e:any) => { return e.pagflet == 1})],
            chofer: [... this.db_choferes],
            transportista: [... this.db_transportistas]
        }



        this.datosCPE = {}

        this.datosCPE.tipo_cpe = 74
        this.datosCPE.sucursal = SUCURSAL
        this.datosCPE.es_solicitante_campo = true
        this.datosCPE.es_destino_campo = false
        this.datosCPE.corresponde_retiro_productor = false
        this.datosCPE.certificado_coe = null
        this.datosCPE.mercaderia_fumigada = true

        if (mov.id_socio) {
            this.datosCPE.cuit_solicitante = this.db_socios.some((e: any) => { return e.id == mov.id_socio }) ? this.db_socios.find((e: any) => { return e.id == mov.id_socio }).cuit : null;
            this.onSelectSolicitante()
        }
        if (mov.id_corredor) {
            //this.datosCPE.cuit_corredor_venta_primaria = this.db_socios.some((e:any) => { return e.id == mov.id_socio }) ? this.db_socios.find((e:any) => { return e.id == mov.id_socio }).cuit : null;
        }
        if (mov.id_acopio) {
            //this.datosCPE.cuit_solicitante = this.db_socios.some((e:any) => { return e.id == mov.id_socio }) ? this.db_socios.find((e:any) => { return e.id == mov.id_socio }).cuit : null;
        }
        if (mov.id_transporte) {
            this.datosCPE.cuit_transportista = this.db_transportistas.some((e: any) => { return e.id == mov.id_transporte }) ? this.db_transportistas.find((e: any) => { return e.id == mov.id_transporte }).cuit : null;
        }
        if (mov.id_chofer) {
            this.datosCPE.cuit_chofer = this.db_choferes.some((e: any) => { return e.id == mov.id_chofer }) ? this.db_choferes.find((e: any) => { return e.id == mov.id_chofer }).cuit : null;
        }
        if (mov.id_camion) {
            var camion = this.db_camiones.some((e: any) => { return e.id == mov.id_socio }) ? this.db_camiones.find((e: any) => { return e.id == mov.id_camion }) : null;
            this.datosCPE.dominio = camion ? (camion.patente_chasis ? camion.patente_chasis : null) : null
            this.datosCPE.dominio2 = camion ? (camion.patente_acoplado ? camion.patente_acoplado : null) : null
            this.datosCPE.dominio3 = camion ? (camion.patente_otro ? camion.patente_otro : null) : null
        }
        if (mov.id_grano) {
            this.datosCPE.cod_grano = this.db_granos.some((e: any) => { return e.id == mov.id_grano }) ? this.db_granos.find((e: any) => { return e.id == mov.id_grano }).codigo : null;
        }
        if (mov.id_campana) {
            this.datosCPE.cosecha = this.db_campanas.some((e: any) => { return e.id == mov.id_campana }) ? this.db_campanas.find((e: any) => { return e.id == mov.id_campana }).codigo : null;
        }
        if (mov.kg_tara) {
            this.datosCPE.peso_tara = mov.kg_tara ? parseInt(mov.kg_tara) : 0;
        }
        if (mov.kg_neto_final) {
            var neto_final = mov.kg_neto_final ? parseInt(mov.kg_neto_final) : 0;
            var tara = mov.kg_tara ? parseInt(mov.kg_tara) : 0;
            this.datosCPE.peso_bruto = neto_final + tara
        }


        this.displayCPE = true
    }

    selectEsSolicitanteCampo() {
        this.datosCPE.es_solicitante_campo = true
        this.datosCPE.corresponde_retiro_productor = false
        this.datosCPE.certificado_coe = null
    }
    selectEsDestinoCampo(estado: any) {
        this.datosCPE.es_destino_campo = estado

        var data: any = {}

        this.cpePlantasDestino = []
        this.cpeCamposDestino = []

        if (this.datosCPE.es_destino_campo) {
            data = {
                cuit: 30715327720,
                ejecutar: "localidades_productor",
                data: {
                    cuit: this.datosCPE.cuit_destino
                }
            }

            this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
                (res: any) => {

                    for (let i = 0; i < res.length; i++) {
                        let descripcion = res[i].descripcion;
                        let idProvincia = descripcion.match(/ID Provincia: (\d+)/)[1];

                        this.cpeCamposDestino.push({
                            descripcion: descripcion,
                            codProvincia: idProvincia,
                            codLocalidad: res[i].codigo
                        });
                    }

                },
                (err: any) => {
                    console.log(err)
                }
            )
        } else {
            data = {
                cuit: 30715327720,
                ejecutar: "plantas",
                data: {
                    cuit: this.datosCPE.cuit_destino
                }
            }

            this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
                (res: any) => {
                    this.cpePlantasDestino = res
                },
                (err: any) => {
                    console.log(err)
                }
            )
        }



    }
    onSelectSolicitante(){
        this.cpeCamposOrigen = []

        var data = {
            cuit: 30715327720,
            ejecutar: "localidades_productor",
            data: {
                cuit: this.datosCPE.cuit_solicitante
            }
        }

        this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
            (res: any) => {

                for (let i = 0; i < res.length; i++) {
                    let descripcion = res[i].descripcion;
                    let idProvincia = descripcion.match(/ID Provincia: (\d+)/)[1];

                    this.cpeCamposOrigen.push({
                        descripcion: descripcion,
                        codProvincia: idProvincia,
                        codLocalidad: res[i].codigo
                    });
                }

            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    autorizarGuardarCPE(){
        var data:any = {
            cuit: 0,
            ejecutar: "autorizar_cpe_automotor",
            data: {}
        }
        var errores = []

        //CABECERA
        if(this.datosCPE.cuit_solicitante){
            data.cuit = this.datosCPE.cuit_solicitante
            data.data.cuit_solicitante = this.datosCPE.cuit_solicitante
        } else {
            errores.push('No existe CUIT Solicitante')
        }

        if(this.datosCPE.tipo_cpe){
            data.data.tipo_cpe = this.datosCPE.tipo_cpe
        } else {
            errores.push('No existe Tipo Cpe')
        }
        data.data.observaciones = this.datosCPE.observaciones ? this.datosCPE.observaciones : ''


        //ORIGEN
        if(this.datosCPE.es_solicitante_campo){
            data.data.es_solicitante_campo = true

            if(this.datosCPE.cod_localidad_productor){
                data.data.planta_origen= false
                data.data.cod_provincia_operador= false
                data.data.cod_localidad_operador= false
    
                data.data.cod_provincia_productor= this.cpeCamposOrigen.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }) ? this.cpeCamposOrigen.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }).codProvincia : null
                data.data.cod_localidad_productor= this.datosCPE.cod_localidad_productor
            } else {
                errores.push('Solicitante: Campo - no se selecciono Localidad de solicitante')
            }

        } else {
            data.data.es_solicitante_campo = false

            data.data.cod_provincia_productor= false
            data.data.cod_localidad_productor= false

            if(this.datosCPE.corresponde_retiro_productor){
                data.data.corresponde_retiro_productor = true
                data.data.certificado_coe = this.datosCPE.certificado_coe
                data.data.cuit_remitente_comercial_productor = this.datosCPE.cuit_remitente_comercial_productor ? this.datosCPE.cuit_remitente_comercial_productor : null
            } else {
                data.data.corresponde_retiro_productor = false
                data.data.certificado_coe = false
                data.data.cuit_remitente_comercial_productor = null
            }
            data.data.planta_origen= ""
            data.data.cod_provincia_operador= ""
            data.data.cod_localidad_operador= ""
        }


        //DESTINO
        data.data.cuit_destino = this.datosCPE.cuit_destino ? this.datosCPE.cuit_destino : null
        data.data.cuit_destinatario = this.datosCPE.cuit_destinatario ? this.datosCPE.cuit_destinatario : null

        if(this.datosCPE.es_destino_campo){
            data.data.es_destino_campo = true

            data.data.cod_localidad = this.cpeCamposDestino.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}) ? this.cpeCamposDestino.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}).codLocalidad : null
            data.data.cod_provincia = this.cpeCamposDestino.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}) ? this.cpeCamposDestino.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}).codProvincia : null
            data.data.planta_destino = 1

        } else {
            data.data.es_destino_campo = false

            data.data.cod_localidad = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? this.cpePlantasDestino.find((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}).codLocalidad : null
            data.data.cod_provincia = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? this.cpePlantasDestino.find((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}).codProvincia : null
            data.data.planta_destino = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? this.datosCPE.cod_destino : null
        }

        //INTERVINIENTES
        data.data.cuit_corredor_venta_primaria = this.datosCPE.cuit_corredor_venta_primaria ? this.datosCPE.cuit_corredor_venta_primaria : null
        data.data.cuit_corredor_venta_secundaria = this.datosCPE.cuit_corredor_venta_secundaria ? this.datosCPE.cuit_corredor_venta_secundaria : null
        data.data.cuit_mercado_a_termino = this.datosCPE.cuit_mercado_a_termino ? this.datosCPE.cuit_mercado_a_termino : null
        data.data.cuit_remitente_comercial_venta_primaria = this.datosCPE.cuit_remitente_comercial_venta_primaria ? this.datosCPE.cuit_remitente_comercial_venta_primaria : null
        data.data.cuit_remitente_comercial_venta_secundaria = this.datosCPE.cuit_remitente_comercial_venta_secundaria ? this.datosCPE.cuit_remitente_comercial_venta_secundaria : null
        data.data.cuit_remitente_comercial_venta_secundaria2 = this.datosCPE.cuit_remitente_comercial_venta_secundaria2 ? this.datosCPE.cuit_remitente_comercial_venta_secundaria2 : null
        data.data.cuit_representante_entregador = this.datosCPE.cuit_representante_entregador ? this.datosCPE.cuit_representante_entregador : null
        data.data.cuit_representante_recibidor = this.datosCPE.cuit_representante_recibidor ? this.datosCPE.cuit_representante_recibidor : null

        //DATOS CARGA
        data.data.peso_tara = this.datosCPE.peso_tara ? this.datosCPE.peso_tara : null
        data.data.peso_bruto = this.datosCPE.peso_bruto ? this.datosCPE.peso_bruto : null
        data.data.cod_grano = this.datosCPE.cod_grano ? this.datosCPE.cod_grano : null
        data.data.cosecha = this.datosCPE.cosecha ? this.datosCPE.cosecha : null

        //AGREGAR TRANSPORTE
        data.data.cuit_transportista = this.datosCPE.cuit_transportista ? this.datosCPE.cuit_transportista : null
        data.data.cuit_pagador_flete = this.datosCPE.cuit_pagador_flete ? this.datosCPE.cuit_pagador_flete : null
        data.data.cuit_intermediario_flete = this.datosCPE.cuit_intermediario_flete ? this.datosCPE.cuit_intermediario_flete : null
        data.data.cuit_chofer = this.datosCPE.cuit_chofer ? this.datosCPE.cuit_chofer : null

        data.data.mercaderia_fumigada = this.datosCPE.mercaderia_fumigada ? true : false
        data.data.km_recorrer = this.datosCPE.km_recorrer ? parseFloat(this.datosCPE.km_recorrer) : null
        data.data.tarifa_referencia = this.datosCPE.tarifa_referencia ? parseFloat(this.datosCPE.tarifa_referencia) : null
        data.data.tarifa = this.datosCPE.tarifa ? parseFloat(this.datosCPE.tarifa) : null
        data.data.codigo_turno = this.datosCPE.codigo_turno ? this.datosCPE.codigo_turno : null
        data.data.fecha_hora_partida = this.datosCPE.fecha_hora_partida ? this.datosCPE.fecha_hora_partida : null

        data.data.dominio = []

        this.datosCPE.dominio ? data.data.dominio.push(this.datosCPE.dominio) : null
        this.datosCPE.dominio2 ? data.data.dominio.push(this.datosCPE.dominio2) : null
        this.datosCPE.dominio3 ? data.data.dominio.push(this.datosCPE.dominio3) : null


        if(errores.length){
            console.log('Error!')
            alert('Error!, ver consola')
            errores.forEach(element => {
                console.log(element)
            });
        } else {
            if(confirm("Desea realizar CPE?")){
                console.log(data['data'])
/* 
                this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
                    (res: any) => {
                        console.log(res)
                    },
                    (err: any) => {
                        console.log(err)
                    }
                )
 */
            }
        }

        
    }

    buscarCUIT(cuit: any, razon_social: any) {
        this.datosCPE[razon_social] = 'buscando...'

        this.padronService.padronCUIT(cuit).subscribe(
            (res: any) => {
                if (!res) {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Verifique los datos ingresados' })
                    this.datosCPE[razon_social] = ''
                }
                var razonSocial = ''
                if (res.tipoPersona == 'FISICA') {
                    razonSocial = res.apellido + ' ' + res.nombre
                } else {
                    razonSocial = res.razonSocial
                }
                this.datosCPE[razon_social] = razonSocial

                if (razon_social == 'destino') {
                    this.selectEsDestinoCampo(false)
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error conectando a Backend (AFIP)' })
                this.datosCPE[razon_social] = ''
            }
        )
    }
}

//["id", "fecha", "id_campana", "id_socio", "id_origen", "id_grano", "id_transporte", "id_chofer", "id_camion", "id_corredor", "id_acopio", "id_deposito", "kg_bruto", "kg_tara", "kg_neto", "kg_regulacion", "kg_neto_final", "observaciones", "tipo_origen", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]

/*
CPE DB:
"creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado", "data"
nro_cpe
nro_ctg
id_movimiento
cuit_solicitante
tipo_cpe
observaciones
es_solicitante_campo
cod_localidad_productor
planta_origen
cod_provincia_operador
cod_localidad_operador
cod_provincia_productor
cod_localidad_productor
corresponde_retiro_productor
certificado_coe
cuit_remitente_comercial_productor
cuit_destino
cuit_destinatario
es_destino_campo
cod_localidad
cod_provincia
planta_destino
cuit_corredor_venta_primaria
cuit_corredor_venta_secundaria
cuit_mercado_a_termino
cuit_remitente_comercial_venta_primaria
cuit_remitente_comercial_venta_secundaria
cuit_remitente_comercial_venta_secundaria2
cuit_representante_entregador
cuit_representante_recibidor
peso_tara
peso_bruto
cod_grano
cosecha
cuit_transportista
cuit_pagador_flete
cuit_intermediario_flete
cuit_chofer
mercaderia_fumigada
km_recorrer
tarifa_referencia
tarifa
codigo_turno
fecha_hora_partida
dominio

{
    "contingencia": [
        {
            "concepto": "B", 
            "concepto_desactivacion": "B", 
            "cuit_transportista": 20333333334, 
            "descripcion": "Desctrucci\u00f3n carga", 
            "nro_operativo": 1111111111
        }
    ], 
    "": "20267565393", 
    "datos_carga": [
        {
            "cod_grano": 23, 
            "cosecha": 2021, 
            "peso_bruto": 110, 
            "peso_tara": 10
        }
    ],
    "destino": [
        {
            "cod_localidad": 14310, 
            "cod_provincia": 12, 
            "cuit_destinatario": "20267565393", 
            "cuit_destino": "20267565393", 
            "es_destino_campo": "true", 
            "planta": 1938
        }
    ], 
    "intervinientes": [
        {
            "cuit_corredor_venta_primaria": null, 
            "cuit_corredor_venta_secundaria": null, 
            "cuit_mercado_a_termino": null, 
            "cuit_remitente_comercial_venta_primaria": 27000000014, 
            "cuit_remitente_comercial_venta_secundaria": null, 
            "cuit_remitente_comercial_venta_secundaria2": 20400000000, 
            "cuit_representante_entregador": null, 
            "cuit_representante_recibidor": null
        }
    ], 
    "nro_orden": 28, 
    "observaciones": "Notas del transporte", 
    "origen": [
        {
            "cod_localidad_productor": 14310, 
            "cod_provincia_productor": 1
        }
    ],
    "retiro_productor": [
        {
            "certificado_coe": null, 
            "corresponde_retiro_productor": "false", 
            "cuit_remitente_comercial_productor": null, 
            "es_solicitante_campo": "true"
        }
    ],
    "sucursal": 222,
    "": 74,
    "transporte": [
        {
            "codigo_turno": null, 
            "cuit_chofer": "20333333334", 
            "cuit_intermediario_flete": null, 
            "cuit_pagador_flete": null, 
            "cuit_transportista": 20120372913, 
            "dominio": "AB000ST", 
            "fecha_hora_partida": "2023-04-13T16:41:26", 
            "km_recorrer": 500, 
            "mercaderia_fumigada": "true", 
            "tarifa": null, 
            "tarifa_referencia": 1234.5
        },
        {
            "dominio": "AC001ST"
        }
    ]
}



//todos
{
    "contingencia": [
        {
            "concepto": "B", 
            "concepto_desactivacion": "B", 
            "cuit_transportista": 20333333334, 
            "descripcion": "Desctrucci\u00f3n carga", 
            "nro_operativo": 1111111111
        }
    ], 
    "cuit_solicitante": "20267565393", 
    "datos_carga": [
        {
            "cod_grano": 23, 
            "cosecha": 2021, 
            "peso_bruto": 110, 
            "peso_tara": 10
        }
    ],
    "destino": [
        {
            "cod_localidad": 14310, 
            "cod_provincia": 12, 
            "cuit_destinatario": "20267565393", 
            "cuit_destino": "20267565393", 
            "es_destino_campo": "true", 
            "planta": 1938
        }
    ], 
    "intervinientes": [
        {
            "cuit_corredor_venta_primaria": null, 
            "cuit_corredor_venta_secundaria": null, 
            "cuit_mercado_a_termino": null, 
            "cuit_remitente_comercial_venta_primaria": 27000000014, 
            "cuit_remitente_comercial_venta_secundaria": null, 
            "cuit_remitente_comercial_venta_secundaria2": 20400000000, 
            "cuit_representante_entregador": null, 
            "cuit_representante_recibidor": null
        }
    ], 
    "nro_orden": 28, 
    "observaciones": "Notas del transporte", 
    "origen": [
        {
            "cod_localidad_productor": 14310, 
            "cod_provincia_productor": 1
        }
    ], 
    "retiro_productor": [
        {
            "certificado_coe": null, 
            "corresponde_retiro_productor": "false", 
            "cuit_remitente_comercial_productor": null, 
            "es_solicitante_campo": "true"
        }
    ], 
    "sucursal": 222, 
    "tipo_cpe": 74, 
    "transporte": [
        {
            "codigo_turno": null, 
            "cuit_chofer": "20333333334", 
            "cuit_intermediario_flete": null, 
            "cuit_pagador_flete": null, 
            "cuit_transportista": 20120372913, 
            "dominio": "AB000ST", 
            "fecha_hora_partida": "2023-04-13T16:41:26", 
            "km_recorrer": 500, 
            "mercaderia_fumigada": "true", 
            "tarifa": null, 
            "tarifa_referencia": 1234.5
        }, 
        {
            "dominio": "AC001ST"
        }
    ]

    {
        "tabla": "orden_carga",
        "columnas": ["id", "id_movimiento", "numero", "fecha", "beneficiario", "transportista", "conductor", "patentes", "establecimiento", "cultivo", "trilla_silo", "tara", "bruto", "neto", "firma1", "firma2", "observaciones", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    },
}
 */