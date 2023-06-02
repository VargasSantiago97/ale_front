import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { DatePipe } from '@angular/common';
import { PadronService } from 'src/app/services/padron.service';
import { CpeService } from 'src/app/services/cpe/cpe.service';
import * as XLSX from 'xlsx';

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
    @ViewChild('myCargador') uploader: any;
    @ViewChild('iframeVisor', { static: true }) iframeVisor: any;

    API_URI_UPLOAD = vars.API_URI_UPLOAD;

    cols: any = [];
    selectedColumns: any = [];
    tamanoCols: any = {};

    dataParaMostrarTabla: any = []
    dataParaMostrarTablaTotales: any = []

    displayFiltros: Boolean = false;
    displayNuevoMovimiento: Boolean = false;
    displayObservacion: Boolean = false;
    displayBanderas: Boolean = false;
    displayBanderasDis: Boolean = false;
    displayOrdenCarga: Boolean = false;
    displayVistas: Boolean = false;
    displayCPE: Boolean = false;
    displayVerCPE: Boolean = false;
    displayEditarCPE: Boolean = false;
    
    spinnerActualizarCPE: Boolean = false;

    accordeonVer = [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false]
    optionsDe: any = [{ label: 'Silo', id: 'S' }, { label: 'Trilla', id: 'T' }, { label: 'Otro', id: 'O' }]

    //DATA-VARIABLES DE DB:
    db_camiones: any = []
    db_choferes: any = []
    db_condicion_iva: any = []
    db_socios: any = []
    db_transportistas: any = []
    db_transportistas_all: any = []
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
    db_carta_porte: any = []
    db_asientos: any = []
    db_ordenes_pago: any = []


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
    load_carta_porte: any = true
    load_asientos: any = true
    load_ordenes_pago: any = true
    load_transportistas_all: any = true


    datosRegistro: any;
    datosObservacion: any = '';

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

    datosVerCPE: any = [];
    datosEditarCPE: any = {};
    cambiosDetectadosCPE: any = [];
    datosParaActualizarCPE: any = {};

    existePlantilla = false;

    intervinientesCPE: any = {};

    cpeCamposOrigen: any = [];
    cpePlantasDestino: any = [];
    cpeCamposDestino: any = [];

    datosFiltro:any = {
        fechaDesde: new Date('01/01/2023'),
        fechaHasta: new Date('12/31/2023'),
        granos: ['vacios', 'todos'],
        socios: ['vacios', 'todos'],
        establecimientos: ['vacios', 'todos'],
        transportistas: ['vacios', 'todos'],
        corredores: ['vacios', 'todos'],
        acopios: ['vacios', 'todos'],
        id_bandera: []
    };
    datos_filtrar_granos : any = []
    datos_filtrar_socios : any = []
    datos_filtrar_establecimientos : any = []
    datos_filtrar_transportistas : any = []
    datos_filtrar_corredores : any = []
    datos_filtrar_acopios : any = []

    filtroRapido: any = {}

    selectedTablaInicio:any

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
            { field: "chofer", header: "Chofer" },
            { field: "cuit_transp", header: "CUIT Transp" },
            { field: "id_corredor", header: "Corredor" },
            { field: "id_acopio", header: "Acopio" },
            
            { field: "kg_tara", header: "Tara" },
            { field: "kg_bruto", header: "Bruto" },
            { field: "kg_neto", header: "Neto" },
            { field: "kg_regulacion", header: "Carga/Desc" },
            { field: "kg_neto_final", header: "Neto Final" },
            { field: "kg_campo", header: "Neto Campo" },
            
            { field: "factura", header: "Facturas" },
            { field: "gastos", header: "Gastos" },
            { field: "pagado", header: "Pagado" },
            { field: "observaciones", header: "Obser" },
            
            { field: "banderas", header: "" },
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
            { field: "chofer", header: "Chofer" },
            { field: "cuit_transp", header: "CUIT Transp" },
            { field: "id_corredor", header: "Corredor" },
            { field: "id_acopio", header: "Acopio" },

            { field: "kg_tara", header: "Tara" },
            { field: "kg_bruto", header: "Bruto" },
            { field: "kg_neto", header: "Neto" },
            { field: "kg_regulacion", header: "Carga/Desc" },
            { field: "kg_neto_final", header: "Neto Final" },
            { field: "kg_campo", header: "Neto Campo" },
            
            { field: "factura", header: "Facturas" },
            { field: "gastos", header: "Gastos" },
            { field: "pagado", header: "Pagado" },
            { field: "observaciones", header: "Obser" },

            { field: "banderas", header: "" },
        ];
        this.tamanoCols = {
            cultivo: '50px',
            fecha: '90px',
            orden: '90px',
            benef_orden: '80px',
            cpe: '100px',
            benef: '80px',
            ctg: '110px',
            campo: '100px',
            tipo_orig: '100px',
            pat: '100px',
            patAc: '100px',
            transporte: '230px',
            chofer: '230px',
            cuit_transp: '100px',
            id_corredor: '100px',
            id_acopio: '100px',
            kg_tara: '100px',
            kg_bruto: '100px',
            kg_neto: '100px',
            kg_regulacion: '100px',
            kg_neto_final: '100px',
            kg_campo: '100px',
            factura: '100px',
            gastos: '100px',
            pagado: '100px',
            observaciones: '200px',
            banderas: '80px'
        }

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
        this.obtenerCartasPorte()
        this.obtenerAsientos()
        this.obtenerOrdenesPago()
        this.obtenerTransportistasAll()

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
            kg_campo: null,
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

                this.datos_filtrar_socios = [ {id:'todos', alias: '[TODOS]'}, {id:'vacios', alias:'[Vacios]'} , ... this.db_socios ]

                res.forEach((e:any) => {
                    this.datosFiltro.socios.push(e.id)
                })

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
    obtenerTransportistasAll() {
        this.comunicacionService.getDBAll('transportistas').subscribe(
            (res: any) => {
                this.db_transportistas_all = res;
                this.load_transportistas_all = false;

                this.datos_filtrar_transportistas  = [ {id:'todos', alias: '[TODOS]'}, {id:'vacios', alias:'[Vacios]'} , ... this.db_transportistas_all ]

                res.forEach((e:any) => {
                    this.datosFiltro.transportistas.push(e.id)
                })

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

                this.datos_filtrar_establecimientos  = [ {id:'todos', alias: '[TODOS]'}, {id:'vacios', alias:'[Vacios]'} , ... this.db_establecimientos ]

                res.forEach((e:any) => {
                    this.datosFiltro.establecimientos.push(e.id)
                })

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
                this.datos_filtrar_granos = [ {id:'todos', alias: '[TODOS]'}, {id:'vacios', alias:'[Vacios]'} , ... this.db_granos ]

                res.forEach((e:any) => {
                    this.datosFiltro.granos.push(e.id)
                })
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

                this.db_banderas.forEach((band:any) => {
                    this.datosFiltro.id_bandera.push(band.id)                    
                });

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
                this.db_intervinientes = res;
                this.db_acopios = [... res.filter((e:any) => { return e.dstno == 1})]
                this.db_corredores = [... res.filter((e:any) => { return e.corvtapri == 1})]

                this.db_intervinientes.forEach((e:any) => {
                    this.datosFiltro.acopios.push(e.id)
                    this.datosFiltro.corredores.push(e.id)
                })

                this.datos_filtrar_corredores = [ {id:'todos', alias: '[TODOS]'}, {id:'vacios', alias:'[Vacios]'} , ... this.db_intervinientes ]
                this.datos_filtrar_acopios = [ {id:'todos', alias: '[TODOS]'}, {id:'vacios', alias:'[Vacios]'} , ... this.db_intervinientes ]

                this.intervinientesCPE = {
                    destinatario: [... res.filter((e:any) => { return e.dstro == 1})],
                    destino: [... res.filter((e:any) => { return e.dstno == 1})],
                    corredor_venta_primaria: [... res.filter((e:any) => { return e.corvtapri == 1})],
                    corredor_venta_secundaria: [... res.filter((e:any) => { return e.corvtasec == 1})],
                    mercado_a_termino: [... res.filter((e:any) => { return e.mertermino == 1})],
                    remitente_comercial_venta_primaria: [... res.filter((e:any) => { return e.rtecomvtapri == 1})],
                    remitente_comercial_venta_secundaria: [... res.filter((e:any) => { return e.rtecomvtasec == 1})],
                    remitente_comercial_venta_secundaria2: [... res.filter((e:any) => { return e.rtecomvtasec2 == 1})],
                    representante_entregador: [... res.filter((e:any) => { return e.rteent == 1})],
                    representante_recibidor: [... res.filter((e:any) => { return e.rterec == 1})],
                    remitente_comercial_productor: [... res.filter((e:any) => { return e.rtecomprod == 1})],
                    intermediario_flete: [... res.filter((e:any) => { return e.intflet == 1})],
                    pagador_flete: [... res.filter((e:any) => { return e.pagflet == 1})],
                    chofer: [... this.db_choferes],
                    transportista: [... this.db_transportistas]
                }

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
    obtenerAsientos(){
        this.comunicacionService.getDB('asientos').subscribe(
            (res: any) => {
                this.db_asientos = res;
                this.load_asientos = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerOrdenesPago(){
        this.comunicacionService.getDB('orden_pago').subscribe(
            (res: any) => {
                this.db_ordenes_pago = res;
                this.load_ordenes_pago = false;
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

    datosParaTabla(mantenerFiltro:any = false, permiteFiltrosRapidos:any = null) {
        if (!(this.load_transportistas_all || this.load_ordenes_pago || this.load_asientos || this.load_carta_porte || this.load_camiones || this.load_choferes || this.load_condicion_iva || this.load_socios || this.load_transportistas || this.load_campanas || this.load_depositos || this.load_establecimientos || this.load_gastos || this.load_granos || this.load_banderas || this.load_movimientos || this.load_ordenes_carga || this.load_intervinientes)) {
            this.dataParaMostrarTabla = []

            var kg_tara = 0.0;
            var kg_bruto = 0.0;
            var kg_neto = 0.0;
            var kg_regulacion = 0.0;
            var kg_neto_final = 0.0;
            var kg_campo = 0.0;

            //FILTROS RAPIDOS (DATOS PARA FILTRAR)
            var ordenesPermitidas:any = []
            var cartaPortePermitidas:any = []
            var cartaPortePermitidas:any = []
            var camionesPermitidos:any = []

            if(permiteFiltrosRapidos){
                if(this.filtroRapido.orden){
                    ordenesPermitidas = this.db_ordenes_carga.filter((odc:any) => { return odc.numero.includes(this.filtroRapido.orden) })
                }
                if(this.filtroRapido.cpe){
                    cartaPortePermitidas = this.db_carta_porte.filter((cdp:any) => { return cdp.nro_cpe.includes(this.filtroRapido.cpe) })
                }
                if(this.filtroRapido.ctg){
                    cartaPortePermitidas = this.db_carta_porte.filter((cdp:any) => { return cdp.nro_ctg.includes(this.filtroRapido.ctg) })
                }
                if(this.filtroRapido.patente){
                    camionesPermitidos = this.db_camiones.filter((camion:any) => { return camion.patente_chasis.includes(this.filtroRapido.patente.toUpperCase()) || camion.patente_acoplado.includes(this.filtroRapido.patente.toUpperCase()) })
                }
            } else {
                this.filtroRapido = {}
            }

            this.db_movimientos.forEach((e: any) => {

                const vacio_grano = this.datosFiltro.granos.includes('vacios')
                const vacio_socio = this.datosFiltro.socios.includes('vacios')
                const vacio_establecimiento = this.datosFiltro.establecimientos.includes('vacios')
                const vacio_transportista = this.datosFiltro.transportistas.includes('vacios')
                const vacio_corredor = this.datosFiltro.corredores.includes('vacios')
                const vacio_acopio = this.datosFiltro.acopios.includes('vacios')

                const todos_grano = this.datosFiltro.granos.includes('todos')
                const todos_socio = this.datosFiltro.socios.includes('todos')
                const todos_establecimiento = this.datosFiltro.establecimientos.includes('todos')
                const todos_transportista = this.datosFiltro.transportistas.includes('todos')
                const todos_corredor = this.datosFiltro.corredores.includes('todos')
                const todos_acopio = this.datosFiltro.acopios.includes('todos')

                const ok_grano = todos_grano ? true : (e.id_grano ? this.datosFiltro.granos.includes(e.id_grano) : vacio_grano)
                const ok_socio = todos_socio ? true : (e.id_socio ? this.datosFiltro.socios.includes(e.id_socio) : vacio_socio)
                const ok_establecimiento = todos_establecimiento ? true : (e.id_origen ? this.datosFiltro.establecimientos.includes(e.id_origen) : vacio_establecimiento)
                const ok_transportista = todos_transportista ? true : (e.id_transporte ? this.datosFiltro.transportistas.includes(e.id_transporte) : vacio_transportista)
                const ok_fechaDesde = e.fecha ? (new Date(e.fecha) >= new Date(this.datosFiltro.fechaDesde)) : true
                const ok_fechaHasta = e.fecha ? (new Date(e.fecha) <= new Date(this.datosFiltro.fechaHasta)) : true
                const ok_corredor = todos_corredor ? true : (e.id_corredor ? this.datosFiltro.corredores.includes(e.id_corredor) : vacio_corredor)
                const ok_acopio = todos_acopio ? true : (e.id_acopio ? this.datosFiltro.acopios.includes(e.id_acopio) : vacio_acopio)
                
                var ok_bandera = this.datosFiltro.id_bandera.length == this.db_banderas.length
                if(e.id_bandera){
                    var banderas = typeof e.id_bandera == 'string' ? JSON.parse(e.id_bandera) : e.id_bandera
                    if(banderas.length){
                        ok_bandera = banderas.some((bandera:any) => this.datosFiltro.id_bandera.includes(bandera))
                    }
                }

                //FILTROS RAPIDOS
                var ok_filtrosRapidos = true
                if(permiteFiltrosRapidos){
                    if(this.filtroRapido.orden){
                        ok_filtrosRapidos = ordenesPermitidas.some((odc:any) => { return odc.id_movimiento == e.id })
                    }
                    if(this.filtroRapido.cpe && ok_filtrosRapidos){
                        ok_filtrosRapidos = cartaPortePermitidas.some((cdp:any) => { return cdp.id_movimiento == e.id })
                    }
                    if(this.filtroRapido.ctg && ok_filtrosRapidos){
                        ok_filtrosRapidos = cartaPortePermitidas.some((cdp:any) => { return cdp.id_movimiento == e.id })
                    }
                    if(this.filtroRapido.patente && ok_filtrosRapidos){
                        ok_filtrosRapidos = camionesPermitidos.some((camion:any) => { return camion.id == e.id_camion })
                    }
                }


                if(ok_filtrosRapidos && ok_acopio && ok_corredor && ok_grano && ok_socio && ok_establecimiento && ok_transportista && ok_fechaDesde && ok_fechaHasta && ok_bandera){
                    this.dataParaMostrarTabla.push(this.movimientoToMostrarTabla(e))

                    //totales
                    kg_tara += e.kg_tara ? parseInt(e.kg_tara) : 0;
                    kg_bruto += e.kg_bruto ? parseInt(e.kg_bruto) : 0;
                    kg_neto += e.kg_neto ? parseInt(e.kg_neto) : 0;
                    kg_regulacion += e.kg_regulacion ? parseInt(e.kg_regulacion) : 0;
                    kg_neto_final += e.kg_neto_final ? parseInt(e.kg_neto_final) : 0;
                    kg_campo += e.kg_campo ? parseInt(e.kg_campo) : 0;
                }
            });

            this.dataParaMostrarTablaTotales = {
                kg_tara: kg_tara,
                kg_bruto: kg_bruto,
                kg_neto: kg_neto,
                kg_regulacion: kg_regulacion,
                kg_neto_final: kg_neto_final,
                kg_campo: kg_campo,
            }


            if(mantenerFiltro){
                this.displayFiltros = false
            }
        }
    }
    movimientoToMostrarTabla(mov:any){
        var dato:any = {
            id: mov.id,
            cultivo: mov.id_grano ? this.transformDatoTabla(mov.id_grano,"grano") : "-",
            fecha: mov.fecha ? this.transformDatoTabla(mov.fecha,"fecha") : "-",
            orden: this.transformDatoTabla(mov.id,"ordenNumero"),
            benef_orden: mov.id_socio ? this.transformDatoTabla(mov.id_socio,"socio") : "-",
            campo: mov.id_origen ? this.transformDatoTabla(mov.id_origen,"campo") : "-",
            tipo_orig: mov.tipo_origen ? this.transformDatoTabla(mov.tipo_origen,"tipo_orig") : "-",
            pat: mov.id_camion ? this.transformDatoTabla(mov.id_camion,"pat") : "-",
            patAc: mov.id_camion ? this.transformDatoTabla(mov.id_camion,"patAc") : "-",
            transporte: mov.id_transporte ? this.transformDatoTabla(mov.id_transporte,"transporte") : "-",
            cuit_transp: mov.id_transporte ? this.transformDatoTabla(mov.id_transporte,"cuit_transp") : "-",
            chofer: mov.id_chofer ? this.transformDatoTabla(mov.id_chofer,"chofer") : "-",
            id_corredor: mov.id_corredor ? this.transformDatoTabla(mov.id_corredor,"intervinientes") : "-",
            id_acopio: mov.id_acopio ? this.transformDatoTabla(mov.id_acopio,"intervinientes") : "-",

            kg_tara: mov.kg_tara ? this.transformDatoTabla(mov.kg_tara,"kg") : "-",
            kg_bruto: mov.kg_bruto ? this.transformDatoTabla(mov.kg_bruto,"kg") : "-",
            kg_neto: mov.kg_neto ? this.transformDatoTabla(mov.kg_neto,"kg") : "-",
            kg_regulacion: mov.kg_regulacion ? this.transformDatoTabla(mov.kg_regulacion,"kg") : "-",
            kg_neto_final: mov.kg_neto_final ? this.transformDatoTabla(mov.kg_neto_final,"kg") : "-",
            kg_campo: mov.kg_campo ? this.transformDatoTabla(mov.kg_campo,"kg") : "-",

            observaciones:  mov.observaciones ? mov.observaciones.substring(0, 40) + (mov.observaciones.length > 40 ? " (...)" : "") : "",
            observacionesCompleta: mov.observaciones ? mov.observaciones : "",

            permiteCrearCTG: true,
            existeOrdenDeCarga: this.db_ordenes_carga.some((e:any) => { return e.id_movimiento == mov.id}),
            
            gastos: '',
            factura: '',
            pagado: 'NO',

            cpe: '',
            benef: '',
            ctg: '',

            banderas: []

        }

        var haber = 0.0
        var debe = 0.0

        if(this.db_carta_porte.some((e:any) => { return e.id_movimiento == mov.id})){
            const carta_porte = this.db_carta_porte.filter((e:any) => { return e.id_movimiento == mov.id})
            if(carta_porte.length == 1){
                var sucursal:any = carta_porte[0].sucursal ? carta_porte[0].sucursal.toString().padStart(2, '0') : ''
                var cpe:any = carta_porte[0].nro_cpe ? carta_porte[0].nro_cpe.toString().padStart(5, '0') : ''

                dato.cpe= sucursal + "-" + cpe
                dato.benef= carta_porte[0].cuit_solicitante ? this.transformDatoTabla(carta_porte[0].cuit_solicitante,"socioCuit") : "-"
                dato.ctg= carta_porte[0].nro_ctg ? carta_porte[0].nro_ctg : ''
                dato.permiteCrearCTG = false
            } else {
                var cpe:any = ""
                var benef:any = ""
                var ctg:any = ""
                carta_porte.forEach((e:any) => {
                    cpe += (e.sucursal ? e.sucursal.toString().padStart(2, '0') : '') + "-" + (e.nro_cpe ? e.nro_cpe.toString().padStart(5, '0') : '') + " "
                    ctg += (e.nro_ctg ? e.nro_ctg.toString() : '') + " "
                    benef = e.cuit_solicitante ? this.transformDatoTabla(e.cuit_solicitante,"socioCuit") : "-"
                })

                dato.cpe= cpe
                dato.benef= benef
                dato.ctg= ctg
                dato.permiteCrearCTG = false
            }
        }

        var asientosAfectados:any = []
        if(this.db_asientos.some((e:any) => { return e.afecta ? (JSON.parse(e.afecta).length ? (JSON.parse(e.afecta).includes(mov.id)) : false) : false})){
            const asientos = this.db_asientos.filter((e:any) => { return e.afecta ? (JSON.parse(e.afecta).length ? (JSON.parse(e.afecta).includes(mov.id)) : false) : false})
            asientos.forEach((e:any) => {

                if(e.haber){
                    asientosAfectados.push(e.id)
                    haber += parseFloat(e.haber)
                }
                if(e.debe){
                    debe += parseFloat(e.debe)
                }
            })
            dato.gastos = this.transformDatoTabla(debe,"moneda")
            dato.factura = this.transformDatoTabla(haber,"moneda")
        }

        for (let i = 0; i < asientosAfectados.length; i++) {
            if(this.db_ordenes_pago.some((e:any) => { return e.afecta ? (JSON.parse(e.afecta).length ? (JSON.parse(e.afecta).includes(asientosAfectados[i])) : false) : false })){
                dato.pagado = "SI"
            }
        }


        var banderas = mov.id_bandera ? (typeof mov.id_bandera == 'string' ? JSON.parse(mov.id_bandera) : mov.id_bandera) : []
        banderas.forEach((e:any) => {
            dato.banderas.push(this.db_banderas.find((f:any) => { return f.id == e }))
        })

        return dato
    }
    transformDatoTabla(dato: any, tipo: any, registro:any=0) {
        if (tipo == 'grano') {
            return this.db_granos.some((e: any) => { return e.id == dato }) ? this.db_granos.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'fecha') {
            var fecha = new Date(dato)
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(fecha, 'yyyy-MM-dd');
        }
        if (tipo == 'campo') {
            return this.db_establecimientos.some((e: any) => { return e.id == dato }) ? this.db_establecimientos.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'tipo_orig') {
            return this.optionsDe.some((e: any) => { return e.id == dato }) ? this.optionsDe.find((e: any) => { return e.id == dato }).label : '-'
        }
        if (tipo == 'pat') {
            return this.db_camiones.some((e: any) => { return e.id == dato }) ? this.db_camiones.find((e: any) => { return e.id == dato }).patente_chasis : '-'
        }
        if (tipo == 'patAc') {
            return this.db_camiones.some((e: any) => { return e.id == dato }) ? this.db_camiones.find((e: any) => { return e.id == dato }).patente_acoplado : '-'
        }
        if (tipo == 'transporte') {
            return this.db_transportistas.some((e: any) => { return e.id == dato }) ? this.db_transportistas.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'cuit_transp') {
            return this.db_transportistas.some((e: any) => { return e.id == dato }) ? this.db_transportistas.find((e: any) => { return e.id == dato }).cuit : '-'
        }
        if (tipo == 'chofer') {
            return this.db_choferes.some((e: any) => { return e.id == dato }) ? this.db_choferes.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'intervinientes') {
            return this.db_intervinientes.some((e: any) => { return e.id == dato }) ? this.db_intervinientes.find((e: any) => { return e.id == dato}).alias : '-'
        }
        if (tipo == 'kg') {
            return dato ? dato.toLocaleString("es-AR") : '-'
        }
        if (tipo == 'socio') {
            return this.db_socios.some((e: any) => { return e.id == dato }) ? this.db_socios.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'socioCuit') {
            return this.db_socios.some((e: any) => { return e.cuit.toString() == dato.toString() }) ? this.db_socios.find((e: any) => { return e.cuit.toString() == dato.toString() }).alias : '-'
        }
        if (tipo == 'ordenNumero') {
            if(this.db_ordenes_carga.some((e:any) => { return e.id_movimiento == dato})){
                return this.db_ordenes_carga.find((e:any) => { return e.id_movimiento == dato}).numero
            } else {
                return ""
            }
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
        return registro.id
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

        //kg_bruto
        //kg_tara
        //kg_neto
        //kg_regulacion
        //id_deposito
        //kg_neto_final

        this.datosMovimiento

        if (ingresa == 'kilos_bruto') {
            this.datosMovimiento.kg_bruto = parseInt(event)
            this.datosMovimiento.kg_neto = this.datosMovimiento.kg_bruto - (this.datosMovimiento.kg_tara ? parseInt(this.datosMovimiento.kg_tara) : 0)
        }
        if (ingresa == 'kilos_tara' && this.datosMovimiento.kg_bruto) {
            this.datosMovimiento.kg_tara = parseInt(event)
            this.datosMovimiento.kg_neto = parseInt(this.datosMovimiento.kg_bruto) - this.datosMovimiento.kg_tara
        }
        if (ingresa == 'kilos_neto') {
            this.datosMovimiento.kg_neto = parseInt(event)
            this.datosMovimiento.kg_bruto = this.datosMovimiento.kg_neto + parseInt(this.datosMovimiento.kg_tara)
        }


        if (ingresa == 'kilos_carga_descarga') {
            this.datosMovimiento.kg_regulacion = parseInt(event)
        }
        if (this.datosMovimiento.kg_neto) {
            this.datosMovimiento.kg_neto_final = parseInt(this.datosMovimiento.kg_neto) + (this.datosMovimiento.kg_regulacion ? parseInt(this.datosMovimiento.kg_regulacion) : 0)
        }

        if (ingresa == 'kilos_neto_final') {
            this.datosMovimiento.kg_neto_final = parseInt(event)
            this.datosMovimiento.kg_neto = this.datosMovimiento.kg_neto_final - (this.datosMovimiento.kg_regulacion ? parseInt(this.datosMovimiento.kg_regulacion) : 0)
            this.datosMovimiento.kg_bruto = this.datosMovimiento.kg_neto + (this.datosMovimiento.kg_tara ? parseInt(this.datosMovimiento.kg_tara) : 0)
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
            id_bandera: [],
            kg_bruto: null,
            kg_tara: null,
            kg_neto: null,
            kg_regulacion: null,
            kg_neto_final: null,
            kg_campo: null,
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

        if (typeof this.datosMovimiento.id_bandera == 'string'){
            this.datosMovimiento.id_bandera = JSON.parse(this.datosMovimiento.id_bandera)
        }

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

        if(this.datosMovimiento.id_bandera){
            if(typeof this.datosMovimiento.id_bandera != 'string'){
                this.datosMovimiento.id_bandera = JSON.stringify(this.datosMovimiento.id_bandera)
            }
        }

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

        if(this.datosMovimiento.id_bandera){
            if(typeof this.datosMovimiento.id_bandera != 'string'){
                this.datosMovimiento.id_bandera = JSON.stringify(this.datosMovimiento.id_bandera)
            }
        }

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

            if(this.datosMovimiento.id_bandera){
                if(typeof this.datosMovimiento.id_bandera != 'string'){
                    this.datosMovimiento.id_bandera = JSON.stringify(this.datosMovimiento.id_bandera)
                }
            }

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
    mostrarMovimiento(mov_id: any) {
        this.datosMovimiento = { ... this.db_movimientos.find((e:any) => { return e.id == mov_id}) }

        const fecha = new Date(this.datosMovimiento.fecha);

        const yyyy = fecha.getFullYear().toString().padStart(4, '0');
        const MM = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dd = fecha.getDate().toString().padStart(2, '0');     

        const fechaMov = `${yyyy}-${MM}-${dd}`;

        this.datosMovimiento.fecha = fechaMov;

        if(this.datosMovimiento.id_bandera){
            if (typeof this.datosMovimiento.id_bandera == 'string'){
                this.datosMovimiento.id_bandera = JSON.parse(this.datosMovimiento.id_bandera)
            }
        } else {
            this.datosMovimiento.id_bandera = []
        }


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
            if(this.chofer){
                this.cod_chofer = this.chofer.codigo
            }
        } else {
            this.chofer = {}
            this.cod_chofer = ''
        }
        if (this.datosMovimiento.id_camion) {
            this.camion = this.db_camiones.find((e: any) => { return e.id == this.datosMovimiento.id_camion })
            if(this.camion){
                this.cod_camion = this.camion.codigo
            }
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

    agregarOrdenCargaRegistro(registro_id:any){
        const registro = this.db_movimientos.find((e:any) => { return e.id == registro_id })

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
    mostrarModalOrdenCarga(registro:any, event:any = false){
        if(event){
            event.preventDefault()
        }

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
        this.comunicacionService.getDB('orden_carga').subscribe(
            (res: any) => {
                var ordenes_carga:any = res.filter((e:any) => { 
                    const num = parseInt(e.numero.split("-")[0]) ? parseInt(e.numero.split("-")[0]) : 0
                    return num == parseInt(PUNTO_ORDEN_CARGA)
                })
        
                const numeroMasGrande = ordenes_carga.reduce((acumulado:any, objetoActual:any) => {
                    const valor = parseInt(objetoActual.numero.split("-")[1])
                    return Math.max(acumulado, valor);
                }, 0);
        
                const punto = PUNTO_ORDEN_CARGA.toString().padStart(2, '0');
                const numero = (numeroMasGrande+1).toString().padStart(5, '0');

                this.datosOrdenCarga.numero = punto + "-" + numero;
            },
            (err: any) => {
                console.log(err)
                return 'Error'
            }
        )
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

    mostrarOrdenCarga(ver: any = 'ver') {
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
            cuit: 30714518549,
            ejecutar: "consultar_cpe_automotor",
            data: {
                sucursal: 0,
                nro_orden: 851
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


    abrirModalCrearCPE(mov_id: any) {

        const idd = this.generateUUID()
        if (this.db_carta_porte.some((e: any) => { return e.id == idd })) {
            this.abrirModalCrearCPE(mov_id)
            return
        }

        const mov = this.db_movimientos.find((e:any) => { return e.id == mov_id })

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

        this.datosCPE = {
            id: idd,
            sucursal: SUCURSAL,
            nro_cpe: null,
            nro_ctg: null,
            tipo_cpe: 74,
            id_movimiento: mov_id,
            es_solicitante_campo: true,
            es_destino_campo: false,
            corresponde_retiro_productor: false,
            certificado_coe: null,
            mercaderia_fumigada: true,

            cuit_solicitante: null,
            observaciones: null,
            planta_origen: null,
            cod_provincia_operador: null,
            cod_localidad_operador: null,
            cod_provincia_productor: null,
            cod_localidad_productor: null,
            cuit_remitente_comercial_productor: null,
            cuit_destino: null,
            cuit_destinatario: null,
            cod_localidad: null,
            cod_provincia: null,
            planta_destino: null,
            cuit_corredor_venta_primaria: null,
            cuit_corredor_venta_secundaria: null,
            cuit_mercado_a_termino: null,
            cuit_remitente_comercial_venta_primaria: null,
            cuit_remitente_comercial_venta_secundaria: null,
            cuit_remitente_comercial_venta_secundaria2: null,
            cuit_representante_entregador: null,
            cuit_representante_recibidor: null,
            peso_tara: null,
            peso_bruto: null,
            cod_grano: null,
            cosecha: null,
            cuit_transportista: null,
            cuit_pagador_flete: null,
            cuit_intermediario_flete: null,
            cuit_chofer: null,
            km_recorrer: null,
            tarifa_referencia: null,
            tarifa: null,
            codigo_turno: null,
            fecha_hora_partida: null,
            dominio: null,
            dominio1:null,
            dominio2:null,
            dominio3:null,
            datos: null,
            creado_por: null,
            creado_el: null,
            editado_por: null,
            editado_el: null,
            activo: null,
            estado: null,
            terminada: null,
            controlada: null,
            controlada_final: null,
            sistema: null, //1 si la carta de porte se hace desde el sistema
            observaciones_sistema: null,
            data: null,
        }

        if (mov.id_socio) {
            this.datosCPE.cuit_solicitante = this.db_socios.some((e: any) => { return e.id == mov.id_socio }) ? this.db_socios.find((e: any) => { return e.id == mov.id_socio }).cuit : null;
            this.onSelectSolicitante()
        }
        if (mov.id_corredor) {
            this.datosCPE.cuit_corredor_venta_primaria = this.db_intervinientes.some((e:any) => { return e.id == mov.id_corredor }) ? this.db_intervinientes.find((e:any) => { return e.id == mov.id_corredor }).cuit : null;
        }
        if (mov.id_acopio) {
            this.datosCPE.cuit_destino = this.db_intervinientes.some((e:any) => { return e.id == mov.id_acopio }) ? this.db_intervinientes.find((e:any) => { return e.id == mov.id_acopio }).cuit : null;
        }
        if (mov.id_transporte) {
            this.datosCPE.cuit_transportista = this.db_transportistas.some((e: any) => { return e.id == mov.id_transporte }) ? this.db_transportistas.find((e: any) => { return e.id == mov.id_transporte }).cuit : null;
        }
        if (mov.id_chofer) {
            this.datosCPE.cuit_chofer = this.db_choferes.some((e: any) => { return e.id == mov.id_chofer }) ? this.db_choferes.find((e: any) => { return e.id == mov.id_chofer }).cuit : null;
        }
        if (mov.id_camion) {
            var camion = this.db_camiones.some((e: any) => { return e.id == mov.id_camion }) ? this.db_camiones.find((e: any) => { return e.id == mov.id_camion }) : null;
            this.datosCPE.dominio1 = camion ? (camion.patente_chasis ? camion.patente_chasis : null) : null
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
    abrirModalVerCPE(mov_id:any, borrarCambiosDetectados=true, event:any = false){
        if(event){
            event.preventDefault();
        }

        this.datosVerCPE = [];

        if(borrarCambiosDetectados){
            this.cambiosDetectadosCPE = []
        }

        this.datosVerCPE = [ ... this.db_carta_porte.filter((e:any) => { return e.id_movimiento == mov_id })]

        this.datosVerCPE.forEach((e:any) => {
            if(e.data){
                if(typeof(e.data) == 'string'){
                    e.data = JSON.parse(e.data)
                } else {
                    const datoJson = JSON.stringify(e.data)
                    e.data = JSON.parse(datoJson)
                }
            }

            this.comunicacionService.getDir(e.nro_ctg).subscribe(
                (res: any) => {
                    console.log(res)
                    if (res.mensaje) {
                        e.archivos = res.ruta
                    }
                },
                (err: any) => {
                    console.log(err)
                }
            )
        })

        this.displayVerCPE = true
        this.iframeVisor.nativeElement.src = ''
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

    dummy(cuit:any){
        var data = {
            cuit: cuit,
            ejecutar: "dummy",
            data: {}
        }
        this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
            (res: any) => {
                if(res){
                    res.app == 'Ok' ? this.messageService.add({ severity: 'success', summary: 'OK', detail: 'APP -> Ok'}) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error: APP'})
                    res.db == 'Ok' ? this.messageService.add({ severity: 'success', summary: 'OK', detail: 'DB -> Ok'}) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error: DB'})
                    res.auth == 'Ok' ? this.messageService.add({ severity: 'success', summary: 'OK', detail: 'AUTH -> Ok'}) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error: AUTH'})
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error en la peticion'})
                }

                //app: 'Ok', db: 'Ok', auth: 'Ok'}
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
        data.data.sucursal = parseInt(SUCURSAL)


        //CABECERA
        if(this.datosCPE.cuit_solicitante){
            data.cuit = parseInt(this.datosCPE.cuit_solicitante)
            data.data.cuit_solicitante = parseInt(this.datosCPE.cuit_solicitante)
        } else {
            errores.push('No existe CUIT Solicitante')
        }

        if(this.datosCPE.tipo_cpe){
            data.data.tipo_cpe = parseInt(this.datosCPE.tipo_cpe)
        } else {
            errores.push('No existe Tipo Cpe')
        }
        data.data.observaciones = this.datosCPE.observaciones ? this.datosCPE.observaciones : ''


        //ORIGEN
        if(this.datosCPE.es_solicitante_campo){

            if(this.datosCPE.cod_localidad_productor){
                data.data.cod_provincia_productor= this.cpeCamposOrigen.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }) ? parseInt(this.cpeCamposOrigen.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }).codProvincia) : null
                data.data.cod_localidad_productor= parseInt(this.datosCPE.cod_localidad_productor)
            } else {
                errores.push('Solicitante: Campo - no se selecciono Localidad de solicitante')
            }
        } else {
            errores.push('Solicitante: Por el sistema solo se puede hacer CPE cuando el solicitante es un Campo.')
        }


        //DESTINO
        data.data.cuit_destino = this.datosCPE.cuit_destino ? parseInt(this.datosCPE.cuit_destino) : false
        data.data.cuit_destinatario = this.datosCPE.cuit_destinatario ? parseInt(this.datosCPE.cuit_destinatario) : false

        if(this.datosCPE.es_destino_campo){
            data.data.es_destino_campo = true

            data.data.cod_localidad = this.cpeCamposDestino.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}) ? parseInt(this.cpeCamposDestino.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}).codLocalidad) : false
            data.data.cod_provincia = this.cpeCamposDestino.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}) ? parseInt(this.cpeCamposDestino.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}).codProvincia) : false
            data.data.planta_destino = false

        } else {
            data.data.es_destino_campo = false

            data.data.cod_localidad = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? parseInt(this.cpePlantasDestino.find((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}).codLocalidad) : false
            data.data.cod_provincia = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? parseInt(this.cpePlantasDestino.find((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}).codProvincia) : false
            data.data.planta_destino = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? parseInt(this.datosCPE.cod_destino) : false
        }

        //INTERVINIENTES
        data.data.cuit_corredor_venta_primaria = this.datosCPE.cuit_corredor_venta_primaria ? parseInt(this.datosCPE.cuit_corredor_venta_primaria) : false
        data.data.cuit_corredor_venta_secundaria = this.datosCPE.cuit_corredor_venta_secundaria ? parseInt(this.datosCPE.cuit_corredor_venta_secundaria) : false
        data.data.cuit_mercado_a_termino = this.datosCPE.cuit_mercado_a_termino ? parseInt(this.datosCPE.cuit_mercado_a_termino) : false
        data.data.cuit_remitente_comercial_venta_primaria = this.datosCPE.cuit_remitente_comercial_venta_primaria ? parseInt(this.datosCPE.cuit_remitente_comercial_venta_primaria) : false
        data.data.cuit_remitente_comercial_venta_secundaria = this.datosCPE.cuit_remitente_comercial_venta_secundaria ? parseInt(this.datosCPE.cuit_remitente_comercial_venta_secundaria) : false
        data.data.cuit_remitente_comercial_venta_secundaria2 = this.datosCPE.cuit_remitente_comercial_venta_secundaria2 ? parseInt(this.datosCPE.cuit_remitente_comercial_venta_secundaria2) : false
        data.data.cuit_representante_entregador = this.datosCPE.cuit_representante_entregador ? parseInt(this.datosCPE.cuit_representante_entregador) : false
        data.data.cuit_representante_recibidor = this.datosCPE.cuit_representante_recibidor ? parseInt(this.datosCPE.cuit_representante_recibidor) : false


        //DATOS CARGA
        data.data.peso_tara = this.datosCPE.peso_tara ? parseInt(this.datosCPE.peso_tara) : 0
        data.data.peso_bruto = this.datosCPE.peso_bruto ? parseInt(this.datosCPE.peso_bruto) : 0
        data.data.cod_grano = this.datosCPE.cod_grano ? parseInt(this.datosCPE.cod_grano) : 0
        data.data.cosecha = this.datosCPE.cosecha ? parseInt(this.datosCPE.cosecha) : 0

        //AGREGAR TRANSPORTE
        data.data.cuit_transportista = this.datosCPE.cuit_transportista ? parseInt(this.datosCPE.cuit_transportista) : false
        data.data.cuit_pagador_flete = this.datosCPE.cuit_pagador_flete ? parseInt(this.datosCPE.cuit_pagador_flete) : false
        data.data.cuit_intermediario_flete = this.datosCPE.cuit_intermediario_flete ? parseInt(this.datosCPE.cuit_intermediario_flete) : false
        data.data.cuit_chofer = this.datosCPE.cuit_chofer ? parseInt(this.datosCPE.cuit_chofer) : false

        data.data.mercaderia_fumigada = this.datosCPE.mercaderia_fumigada ? true : false
        data.data.km_recorrer = this.datosCPE.km_recorrer ? parseFloat(this.datosCPE.km_recorrer) : 0
        data.data.tarifa_referencia = this.datosCPE.tarifa_referencia ? parseFloat(this.datosCPE.tarifa_referencia) : false
        data.data.tarifa = this.datosCPE.tarifa ? parseFloat(this.datosCPE.tarifa) : false
        data.data.codigo_turno = this.datosCPE.codigo_turno ? this.datosCPE.codigo_turno : false

        data.data.fecha_hora_partida = this.datosCPE.fecha_hora_partida ? this.datosCPE.fecha_hora_partida : null
        if(this.datosCPE.fecha_hora_partida){
    
            let fecha = this.datosCPE.fecha_hora_partida.split("T")[0];
            let hora = this.datosCPE.fecha_hora_partida.split("T")[1];
    
            let ano = parseInt(fecha.split("-")[0]);
            let mes = parseInt(fecha.split("-")[1]);
            let dia = parseInt(fecha.split("-")[2]);
    
            let horaNum = parseInt(hora.split(":")[0]);
            let minuto = parseInt(hora.split(":")[1]);

            data.data.fecha_hora_partida_ano = ano
            data.data.fecha_hora_partida_mes = mes
            data.data.fecha_hora_partida_dia = dia
            data.data.fecha_hora_partida_hora = horaNum
            data.data.fecha_hora_partida_minuto = minuto
        } else {
            errores.push('Transporte: Fecha/Hora partida')
        }

        data.data.dominio = []

        this.datosCPE.dominio1 ? data.data.dominio.push(this.datosCPE.dominio1) : null
        this.datosCPE.dominio2 ? data.data.dominio.push(this.datosCPE.dominio2) : null
        this.datosCPE.dominio3 ? data.data.dominio.push(this.datosCPE.dominio3) : null


        if(errores.length){
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al crear CPE: ' + errores.join(" - ")})
        } else {
            if(confirm("Desea realizar CPE?")){

                this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
                    (res: any) => {
                        if(res){
                            if(res.mensaje){
                                if(res.datos){
                                    const nro_ctg = res.datos.nro_ctg ? res.datos.nro_ctg : ''
                                    const nro_cpe = res.datos.nro_cpe ? res.datos.nro_cpe : ''
                                    const nro_cpe_completo = data.data.sucursal.toString().padStart(2, '0') + "-" + nro_cpe.toString().padStart(5, '0')

                                    this.messageService.add({ severity: 'success', summary: 'CREADO CORRECTAMENTE!', detail: 'Se creo la CPE: ' + nro_cpe_completo + ' con CTG: ' + nro_ctg})

                                    this.datosCPE.nro_ctg = nro_ctg
                                    this.datosCPE.nro_cpe = nro_cpe
                                    this.datosCPE.sistema = 1 //la carta de porse se hace desde el sistema
                                    this.datosCPE.data = '{"kg_descarga":0,"estado":"AC"}'

                                    //mover archivo
                                    this.cpeService.moverArchivo(nro_ctg.toString(), "AC", nro_cpe_completo).subscribe(
                                        (resp: any) => {
                                            if(resp){
                                                if(resp.mensaje){
                                                    this.abrirModalVerCPE(this.datosCPE.id_movimiento, false)

                                                    const setear = {nro_ctg: nro_ctg}
                                                    const nombreArch = "CPE " + nro_cpe_completo + " - CTG " + nro_ctg + " - " + "AC" + ".pdf"
                                                    this.setearUrl(setear, nombreArch)

                                                    this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Archivo creado con exito' })
                                                } else {
                                                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar mover el archivo. respuesta.mensaje = FALSO' })
                                                }
                                            } else {
                                                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar mover el archivo. No hay respuesta' })
                                            }
                                        },
                                        (errr: any) => {
                                            console.log(errr)
                                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar mover el archivo. (conectando con backend)' })
                                        },
                                    )

                                    this.CPE_guardarDB()

                                } else {
                                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar hacer CPE. El Servidor no envio respuesta.datos' })
                                }
                            } else {
                                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar hacer CPE. El Servidor envio respuesta.mensaje = "FALSO"' })
                            }
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al intentar hacer CPE. El Servidor no envio respuesta' })
                        }
                    },
                    (err: any) => {
                        console.log(err)
                    }
                )
            }
        }

        
    }
    anularCPE(datoCPE:any){
        const nrpCPE = (datoCPE.sucursal ? datoCPE.sucursal.toString().padStart(2,'0') : '') + "-" + (datoCPE.nro_cpe ? datoCPE.nro_cpe.toString().padStart(8, '0') : '')
        if(confirm(`Desea ANULAR esta CARTA DE PORTE?\nCTG: ${datoCPE.nro_ctg}\nCPE: ${nrpCPE}`)){
            console.log(datoCPE)

            var data:any = {
                cuit: datoCPE.cuit_solicitante,
                ejecutar: "anular_cpe",
                data: {
                    cuit: datoCPE.cuit_solicitante,
                    tipo_cpe: datoCPE.tipo_cpe,
                    sucursal: datoCPE.sucursal,
                    nro_orden: datoCPE.nro_cpe
                }
            }

            this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
                (res: any) => {
                    console.log(res)
                    if(res){
                        if(res.mensaje){
                            this.messageService.add({ severity: 'success', summary: 'ANULADO CORRECTAMENTE!', detail: 'Se anulo la CPE: ' + nrpCPE + " - CTG: " + datoCPE.nro_ctg})

                            this.cambiosDetectadosCPE = []
                            if(!datoCPE.data){
                                datoCPE.data = {
                                    kg_descarga: 0,
                                    estado: "AN"
                                }
                            }
                            this.datosParaActualizarCPE = datoCPE
                            this.actualizarCPE()
                        }
                    }
                },
                (err: any) => {
                    console.log(err)
                }
            )
        }
    }
    editarCPE(datoCPE:any){

        this.displayEditarCPE = true

        this.datosEditarCPE = {
            id_movimiento: datoCPE.id_movimiento,
            cuit_solicitante: datoCPE.cuit_solicitante,
            nro_ctg: datoCPE.nro_ctg,
            planta_destino: datoCPE.planta_destino,
            cod_provincia: datoCPE.cod_provincia,
            cod_localidad: datoCPE.cod_localidad,
            cuit_destinatario: datoCPE.cuit_destinatario,
            cuit_destino: datoCPE.cuit_destino,
            es_destino_campo: false,
            cuit_remitente_comercial_venta_primaria: datoCPE.cuit_remitente_comercial_venta_primaria,
            cuit_remitente_comercial_venta_secundaria: datoCPE.cuit_remitente_comercial_venta_secundaria,
            cuit_remitente_comercial_venta_secundaria2: datoCPE.cuit_remitente_comercial_venta_secundaria2,
            cuit_corredor_venta_primaria: datoCPE.cuit_corredor_venta_primaria,
            cuit_corredor_venta_secundaria: datoCPE.cuit_corredor_venta_secundaria,
            cuit_chofer: datoCPE.cuit_chofer,
            cuit_transportista: datoCPE.cuit_transportista,
            cod_grano: datoCPE.cod_grano,
            peso_bruto: datoCPE.peso_bruto,
            peso_tara: datoCPE.peso_tara,
        }

        if(datoCPE.dominio){
            const dominios = (typeof datoCPE.dominio == 'string') ? JSON.parse(datoCPE.dominio) : datoCPE.dominio
            this.datosEditarCPE.dominio1 = dominios[0] ? dominios[0] : ''
            this.datosEditarCPE.dominio2 = dominios[1] ? dominios[1] : ''
            this.datosEditarCPE.dominio3 = dominios[2] ? dominios[2] : ''
        }
    }
    autorizarEditarCPE(){

        var data:any = {
            cuit: this.datosEditarCPE.cuit_solicitante,
            ejecutar: "editar_cpe_automotor",
            data: {
                //AGREGAR DESTINO
                planta_destino: this.datosEditarCPE.planta_destino,
                cod_provincia: this.datosEditarCPE.cod_provincia,
                es_destino_campo: this.datosEditarCPE.es_destino_campo,
                cod_localidad: this.datosEditarCPE.cod_localidad,
                cuit_destino: this.datosEditarCPE.cuit_destino,
                cuit_destinatario: this.datosEditarCPE.cuit_destinatario,

                //AGREGAR INTERVINIENTES
                cuit_corredor_venta_primaria: this.datosEditarCPE.cuit_corredor_venta_primaria,
                cuit_corredor_venta_secundaria: this.datosEditarCPE.cuit_corredor_venta_secundaria,
                cuit_remitente_comercial_venta_primaria: this.datosEditarCPE.cuit_remitente_comercial_venta_primaria,
                cuit_remitente_comercial_venta_secundaria: this.datosEditarCPE.cuit_remitente_comercial_venta_secundaria,
                cuit_remitente_comercial_venta_secundaria2: this.datosEditarCPE.cuit_remitente_comercial_venta_secundaria2,

                nro_ctg: this.datosEditarCPE.nro_ctg,
                cuit_chofer: this.datosEditarCPE.cuit_chofer,
                cuit_transportista: this.datosEditarCPE.cuit_transportista,
                peso_bruto: this.datosEditarCPE.peso_bruto,
                cod_grano: this.datosEditarCPE.cod_grano,
                dominio: []
            }
        }
        if(this.datosEditarCPE.dominio1){
            data.data.dominio.push(this.datosEditarCPE.dominio1)
        }
        if(this.datosEditarCPE.dominio2){
            data.data.dominio.push(this.datosEditarCPE.dominio2)
        }
        if(this.datosEditarCPE.dominio3){
            data.data.dominio.push(this.datosEditarCPE.dominio3)
        }

        if(confirm("Desea EDITAR CPE?")){
            this.cpeService.ejecutar(this.objUtf8ToBase64(data)).subscribe(
                (res: any) => {
                    console.log(res)

                    if(res){
                        if(res.mensaje){
                            this.messageService.add({ severity: 'success', summary: 'EDITADO CORRECTAMENTE!', detail: 'Se edito la CPE con CTG: ' + data.data.nro_ctg})
                            this.displayEditarCPE = false
                            this.abrirModalVerCPE(this.datosEditarCPE.id_movimiento)
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al editar CPE'})
                        }
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al editar CPE'})
                    }
                },
                (err: any) => {
                    console.log(err)
                    this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al editar CPE'})
                }
            )
        }
    }
    CPE_buscar_y_guardar(){
        if(this.datosCPE.nro_ctg){
            if(this.db_carta_porte.some((e:any) => { return e.nro_ctg == this.datosCPE.nro_ctg})){
                if(confirm('ATENCION! Ya existe cargada una CPE con ese numero de CTG. Desea continuar?')){
                    this.CPE_guardarDB()
                }
            } else {
                this.CPE_guardarDB()
            }
        } else {
            this.CPE_guardarDB()
        }
    }
    CPE_guardarDB(){
        this.datosCPE.activo = 1
        this.datosCPE.estado = 1

        //DOMINIOS
        var dominios = []
        this.datosCPE.dominio1 ? dominios.push(this.datosCPE.dominio1) : null
        this.datosCPE.dominio2 ? dominios.push(this.datosCPE.dominio2) : null
        this.datosCPE.dominio3 ? dominios.push(this.datosCPE.dominio3) : null
        this.datosCPE.dominio = JSON.stringify(dominios)

        //DESTINO
        if(this.datosCPE.es_destino_campo){
            this.datosCPE.cod_localidad = this.cpeCamposDestino.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}) ? this.cpeCamposDestino.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}).codLocalidad : null
            this.datosCPE.cod_provincia = this.cpeCamposDestino.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}) ? this.cpeCamposDestino.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_destino}).codProvincia : null
            this.datosCPE.planta_destino = 1
        } else {
            this.datosCPE.cod_localidad = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? this.cpePlantasDestino.find((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}).codLocalidad : null
            this.datosCPE.cod_provincia = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? this.cpePlantasDestino.find((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}).codProvincia : null
            this.datosCPE.planta_destino = this.cpePlantasDestino.some((e:any) => { return e.nroPlanta == this.datosCPE.cod_destino}) ? this.datosCPE.cod_destino : null
        }

        //ORIGEN
        if(this.datosCPE.es_solicitante_campo){
            if(this.datosCPE.cod_localidad_productor){
                this.datosCPE.planta_origen= false
                this.datosCPE.cod_provincia_operador= false
                this.datosCPE.cod_localidad_operador= false
                this.datosCPE.cod_provincia_productor= this.cpeCamposOrigen.some((e:any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }) ? this.cpeCamposOrigen.find((e:any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }).codProvincia : null
            }
        } else {
            this.datosCPE.cod_provincia_productor= false
            this.datosCPE.cod_localidad_productor= false
            this.datosCPE.planta_origen= ""
            this.datosCPE.cod_provincia_operador= ""
            this.datosCPE.cod_localidad_operador= ""
        }

        this.comunicacionService.createDB("carta_porte", this.datosCPE).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Creado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })

                this.obtenerCartasPorte()
                this.displayCPE = false

                //subir archivos
                if(this.datosCPE.nro_ctg){
                    this.uploader.upload()
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )

    }

    cpeActualizarPDF(datoVerCPE:any){
        this.spinnerActualizarCPE = true

        if(!datoVerCPE.cuit_solicitante){
            return
        }

        var data:any = {
            cuit: parseInt(datoVerCPE.cuit_solicitante),
            ejecutar: "consultar_cpe_automotor",
            data: {}
        }

        if(datoVerCPE.nro_ctg){
            data.data.ctg = parseInt(datoVerCPE.nro_ctg)
        } else if (datoVerCPE.nro_cpe && datoVerCPE.sucursal){
            data.data.nro_orden = parseInt(datoVerCPE.nro_cpe)
            data.data.sucursal = parseInt(datoVerCPE.sucursal)
        } else {
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
                                                    this.abrirModalVerCPE(datoVerCPE.id_movimiento, false)

                                                    const setear = {nro_ctg: res.mensaje.nroCTG}
                                                    const nombreArch = "CPE " + nro_cpe + " - CTG " + res.mensaje.nroCTG + " - " + res.mensaje.estado + ".pdf"
                                                    this.setearUrl(setear, nombreArch)

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

    compararDatosCPE(ant:any, act:any){
        this.cambiosDetectadosCPE = []
        this.datosParaActualizarCPE = ant

        if(act.nroCTG != ant.nro_ctg){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'nro_ctg',
                tipoDato: 'NRO CTG',
                valorAnt: ant.nro_ctg,
                valor: act.nroCTG
            })
        }
        if(act.sucursal != ant.sucursal){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'sucursal',
                tipoDato: 'SUCURSAL',
                valorAnt: ant.sucursal,
                valor: act.sucursal
            })
        }
        if(act.nroOrden != ant.nro_cpe){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'nro_cpe',
                tipoDato: 'NRO CPE',
                valorAnt: ant.nro_cpe,
                valor: act.nroOrden
            })
        }
        if(act.datosCarga.codGrano != ant.cod_grano){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cod_grano',
                tipoDato: 'Cod. GRANO',
                valorAnt: ant.cod_grano,
                valor: act.datosCarga.codGrano
            })
        }
        if(act.destinatario.cuit != ant.cuit_destinatario){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_destinatario',
                tipoDato: 'CUIT DESTINATARIO',
                valorAnt: ant.cuit_destinatario,
                valor: act.destinatario.cuit
            })
        }
        
        if(act.transporte.codigoTurno != ant.codigo_turno){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'codigo_turno',
                tipoDato: 'CODIGO TURNO',
                valorAnt: ant.codigo_turno,
                valor: act.transporte.codigoTurno
            })
        }
        if(act.transporte.cuitTransportista != ant.cuit_transportista){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_transportista',
                tipoDato: 'CUIT TRANSPORTISTA',
                valorAnt: ant.cuit_transportista,
                valor: act.transporte.cuitTransportista
            })
        }
        if(act.transporte.cuitChofer != ant.cuit_chofer){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_chofer',
                tipoDato: 'CUIT CHOFER',
                valorAnt: ant.cuit_chofer,
                valor: act.transporte.cuitChofer
            })
        }
        if(act.transporte.tarifa != ant.tarifa){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'tarifa',
                tipoDato: 'TARIFA',
                valorAnt: ant.tarifa,
                valor: act.transporte.tarifa
            })
        }
        if(act.transporte.kmRecorrer != ant.km_recorrer){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'km_recorrer',
                tipoDato: 'KM A RECORRER',
                valorAnt: ant.km_recorrer,
                valor: act.transporte.kmRecorrer
            })
        }

        if(act.destino.planta != ant.planta_destino){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'planta_destino',
                tipoDato: 'COD PLANTA DESTINO',
                valorAnt: ant.planta_destino,
                valor: act.destino.planta
            })
        }
        if(act.destino.codProvincia != ant.cod_provincia){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cod_provincia',
                tipoDato: 'COD PROVINCIA',
                valorAnt: ant.cod_provincia,
                valor: act.destino.codProvincia
            })
        }
        if(act.destino.codLocalidad != ant.cod_localidad){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cod_localidad',
                tipoDato: 'COD LOCALIDAD',
                valorAnt: ant.cod_localidad,
                valor: act.destino.codLocalidad
            })
        }
        if(act.destino.cuit != ant.cuit_destino){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'cuit_destino',
                tipoDato: 'CUIT DESTINO',
                valorAnt: ant.cuit_destino,
                valor: act.destino.cuit
            })
        }

        if(act.codACTUAL != ant.codVIEJO){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'codVIEJO',
                tipoDato: 'codVIEJO',
                valorAnt: ant.codVIEJO,
                valor: act.codACTUAL
            })
        }

        if(!ant.data){
            ant.data = {
                kg_descarga: 0,
                estado: ""
            }
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
        }
        if(bruto != ant.peso_bruto){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'peso_bruto',
                tipoDato: 'KGS BRUTO',
                valorAnt: ant.peso_bruto,
                valor: bruto
            })
        }
        if(tara != ant.peso_tara){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'peso_tara',
                tipoDato: 'KGS TARA',
                valorAnt: ant.peso_tara,
                valor: tara
            })
        }
        if(act.estado != ant.data.estado){
            this.cambiosDetectadosCPE.push({
                modificar: true,
                tipo: 'estado',
                tipoDato: 'ESTADO',
                valorAnt: ant.data.estado,
                valor: act.estado
            })
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
                }
            }
        }
    }
    actualizarCPE(){
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
                this.abrirModalVerCPE(this.datosParaActualizarCPE.id_movimiento)
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }
    eliminarCPE(dato:any){
        if(confirm('Desea elimar el registro de la carta de porte? \nLos archivos que se hayan subido quedarán guardados')){
            dato.data = JSON.stringify(dato.data)
            delete dato.archivos;

            dato.estado = 0;
    
            this.comunicacionService.updateDB("carta_porte", dato).subscribe(
                (res: any) => {
                    res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })

                    this.comunicacionService.getDB('carta_porte').subscribe(
                        (resp: any) => {
                            this.db_carta_porte = resp;
                            this.abrirModalVerCPE(dato.id_movimiento);
                        },
                        (errr: any) => {
                            console.log(errr)
                        }
                    )
                },
                (err: any) => {
                    console.log(err)
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
                }
            )
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

    onUpload(event:any) {
        if (event.originalEvent.body.mensaje) {
            this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Archivos cargados con exito' })
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al cargar archivos' })
        }
    }

    irAURL(dato:any, archivo:any, descargar:any){
        if(descargar){
            const uri = this.API_URI_UPLOAD + '/download.php?folder=' + dato.nro_ctg + '&file=' + archivo
            window.open(uri);
        } else {
            const uri = this.API_URI_UPLOAD + '/view.php?folder=' + dato.nro_ctg + '&file=' + archivo
            window.open(uri, '_blank', 'location=no,height=800,width=800,scrollbars=yes,status=yes');
        }
    }
    setearUrl(dato:any, archivo:any){
        this.iframeVisor.nativeElement.src = this.API_URI_UPLOAD + '/view.php?folder=' + dato.nro_ctg + '&file=' + archivo + '#zoom=125'
    }

    exportToExcel() {
        /* Crear un libro de trabajo */
        const workbook = XLSX.utils.book_new();
      
        /* Crear una hoja de cálculo */
        const worksheet = XLSX.utils.json_to_sheet(this.dataParaMostrarTabla);
      
        /* Agregar la hoja de cálculo al libro de trabajo */
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      
        /* Descargar el archivo */
        XLSX.writeFile(workbook, 'movimientos.xlsx');
    }
}

//["id", "fecha", "id_campana", "id_socio", "id_origen", "id_grano", "id_transporte", "id_chofer", "id_camion", "id_corredor", "id_acopio", "id_deposito", "kg_bruto", "kg_tara", "kg_neto", "kg_regulacion", "kg_neto_final", "observaciones", "tipo_origen", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]

/*
CPE
ret:
'cabecera': {
    'fechaEmision': datetime.datetime(2023, 4, 28, 17, 43, 47), 
    'nroCTG': 10109471135L, 
    'sucursal': 0, 
    'tipoCartaPorte': 74, 
    'fechaInicioEstado': datetime.datetime(2023, 5, 1, 13, 56, 52), 
    'nroOrden': 1209L, 
    'estado': u'CN', 
    'fechaVencimiento': datetime.datetime(2023, 5, 4, 11, 5)}, 
    'origen': {'codProvincia': 16, 'codLocalidad': 10583, 'cuit': 30715327720L}, 
    'destinatario': {'cuit': 30715118773L}, 
    'intervinientes': {
        'cuitCorredorVentaPrimaria': 23220029379L, 
        'cuitRepresentanteEntregador': 30707386076L, 
        'cuitCorredorVentaSecundaria': 23220029379L
    }
'datosCarga': {
    'codGrano': 23, 
    'pesoTaraDescarga': 14000, 
    'pesoBruto': 44100, 
    'pesoTara': 14200, 
    'cosecha': 2223, 
    'pesoBrutoDescarga': 44200
}
'transporte': [
    {
        'codigoTurno': u'MOL0721/01052023', 
        'tarifaReferencia': Decimal('13847.91'), 
        'cuitTransportista': 23136003119L, 
        'dominio': u'FFZ879', 
        'mercaderiaFumigada': True, 
        'fechaHoraPartida': datetime.datetime(2023, 4, 28, 17, 45), 
        'cuitChofer': 20378287031L, 
        'tarifa': Decimal('9500'), 
        'kmRecorrer': 850
    }
], 
'errores': [], 
'correspondeRetiroProductor': False, 
'metadata': {'servidor': u'santiago', 'fechaHora': datetime.datetime(2023, 5, 4, 9, 2, 31)}, 
'destino': {
    'planta': 408411, 
    'codProvincia': 12, 
    'codLocalidad': 18794, 
    'cuit': 30715118773L
}, 
'retiroProductor': None,



CPE DB:

    `id` VARCHAR(12) NOT NULL,
    `sucursal` VARCHAR(5) NOT NULL,
    `nro_cpe` VARCHAR(15) NOT NULL,
    `nro_ctg` VARCHAR(15) NOT NULL,
    `id_movimiento` VARCHAR(12) NOT NULL,
    `cuit_solicitante` VARCHAR(12) NOT NULL,
    `tipo_cpe` VARCHAR(10) NOT NULL,
    `observaciones` VARCHAR(100) NOT NULL,
    `es_solicitante_campo` VARCHAR(10) NOT NULL,
    `planta_origen` VARCHAR(10) NOT NULL,
    `cod_provincia_operador` VARCHAR(10) NOT NULL,
    `cod_localidad_operador` VARCHAR(10) NOT NULL,
    `cod_provincia_productor` VARCHAR(10) NOT NULL,
    `cod_localidad_productor` VARCHAR(10) NOT NULL,
    `corresponde_retiro_productor` VARCHAR(10) NOT NULL,
    `certificado_coe` VARCHAR(30) NOT NULL,
    `cuit_remitente_comercial_productor` VARCHAR(12) NOT NULL,
    `cuit_destino` VARCHAR(12) NOT NULL,
    `cuit_destinatario` VARCHAR(12) NOT NULL,
    `es_destino_campo` VARCHAR(10) NOT NULL,
    `cod_localidad` VARCHAR(10) NOT NULL,
    `cod_provincia` VARCHAR(10) NOT NULL,
    `planta_destino` VARCHAR(10) NOT NULL,
    `cuit_corredor_venta_primaria` VARCHAR(12) NOT NULL,
    `cuit_corredor_venta_secundaria` VARCHAR(12) NOT NULL,
    `cuit_mercado_a_termino` VARCHAR(12) NOT NULL,
    `cuit_remitente_comercial_venta_primaria` VARCHAR(12) NOT NULL,
    `cuit_remitente_comercial_venta_secundaria` VARCHAR(12) NOT NULL,
    `cuit_remitente_comercial_venta_secundaria2` VARCHAR(12) NOT NULL,
    `cuit_representante_entregador` VARCHAR(12) NOT NULL,
    `cuit_representante_recibidor` VARCHAR(12) NOT NULL,
    `peso_tara` FLOAT NOT NULL,
    `peso_bruto` FLOAT NOT NULL,
    `cod_grano` VARCHAR(10) NOT NULL,
    `cosecha` VARCHAR(10) NOT NULL,
    `cuit_transportista` VARCHAR(12) NOT NULL,
    `cuit_pagador_flete` VARCHAR(12) NOT NULL,
    `cuit_intermediario_flete` VARCHAR(12) NOT NULL,
    `cuit_chofer` VARCHAR(12) NOT NULL,
    `mercaderia_fumigada` VARCHAR(10) NOT NULL,
    `km_recorrer` FLOAT NOT NULL,
    `tarifa_referencia` FLOAT NOT NULL,
    `tarifa` FLOAT NOT NULL,
    `codigo_turno` VARCHAR(30) NOT NULL,
    `fecha_hora_partida` VARCHAR(30) NOT NULL,
    `dominio` VARCHAR(50) NOT NULL,
    `datos` TEXT NOT NULL,
    `creado_por` VARCHAR(12) NULL DEFAULT NULL,
    `creado_el` DATETIME NULL DEFAULT NULL,
    `editado_por`VARCHAR(12) NULL DEFAULT NULL,
    `editado_el` DATETIME NULL DEFAULT NULL,
    `activo` INT(11) NULL DEFAULT NULL,
    `estado` INT(11) NULL DEFAULT NULL,
    `terminada` INT(11) NULL DEFAULT NULL,
    `controlada` INT(11) NULL DEFAULT NULL,
    `controlada_final` INT(11) NULL DEFAULT NULL,
    `sistema` INT(11) NULL DEFAULT NULL,
    `observaciones_sistema` TEXT NULL DEFAULT NULL,
    `data` TEXT NULL DEFAULT NULL,

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
    "": 222,
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





DATOS DE CARTA DE PORTE QUE TRAE WSCPE
    "mensaje":
    nroCTG
    datosCarga.codGrano
    datosCarga.pesoTaraDescarga
    datosCarga.pesoBruto
    datosCarga.pesoTara
    datosCarga.cosecha
    datosCarga.pesoBrutoDescarga
    sucursal
    correspondeRetiroProductor
    nroOrden
    estado
    retiroProductor

    destinatario.cuit

    transporte.codigoTurno
    transporte.tarifaReferencia
    transporte.cuitTransportista
    transporte.dominio
    transporte.mercaderiaFumigada
    transporte.cuitChofer
    transporte.tarifa
    transporte.kmRecorrer

    destino.planta
    destino.codProvincia
    destino.codLocalidad
    destino.cuit

    intervinientes.cuitCorredorVentaPrimaria
    intervinientes.cuitRepresentanteEntregador
    intervinientes.cuitCorredorVentaSecundaria

    }
}

DATOS DE CPE QUE SE ARMA CON LA DB
{
    "id": "846bdfcc03d7",
    "sucursal": "0",
    "nro_cpe": "1207",
    "nro_ctg": "10109399145",
    "id_movimiento": "756ff81d8192",
    "cuit_solicitante": "30715327720",
    "tipo_cpe": "74",
    "observaciones": null,
    "es_solicitante_campo": "1",
    "planta_origen": null,
    "cod_provincia_operador": null,
    "cod_localidad_operador": null,
    "cod_provincia_productor": null,
    "cod_localidad_productor": null,
    "corresponde_retiro_productor": "",
    "certificado_coe": null,
    "cuit_remitente_comercial_productor": null,
    "cuit_destino": "30709590894",
    "cuit_destinatario": "33502232229",
    "es_destino_campo": "",
    "cod_localidad": null,
    "cod_provincia": null,
    "planta_destino": null,
    "cuit_corredor_venta_primaria": "23220029379",
    "cuit_corredor_venta_secundaria": "23220029379",
    "cuit_mercado_a_termino": null,
    "cuit_remitente_comercial_venta_primaria": null,
    "cuit_remitente_comercial_venta_secundaria": null,
    "cuit_remitente_comercial_venta_secundaria2": null,
    "cuit_representante_entregador": "30707386076",
    "cuit_representante_recibidor": null,
    "peso_tara": "15000",
    "peso_bruto": "45000",
    "cod_grano": "23",
    "cosecha": "2223",
    "cuit_transportista": "23136003119",
    "cuit_pagador_flete": null,
    "cuit_intermediario_flete": null,
    "cuit_chofer": "20144129076",
    "mercaderia_fumigada": "1",
    "km_recorrer": "850",
    "tarifa_referencia": "13847.9",
    "tarifa": "9500",
    "codigo_turno": "RTSO2304276556687",
    "fecha_hora_partida": "2023-04-26T11:02",
    "dominio": "[\"GTD444\",\"ELV966\"]",
    "datos": null,
    "creado_por": "10",
    "creado_el": "2023-04-28 11:09:40",
    "editado_por": "10",
    "editado_el": "2023-04-28 11:09:45",
    "activo": "1",
    "estado": "1",
    "terminada": null,
    "controlada": null,
    "controlada_final": null,
    "sistema": null,
    "observaciones_sistema": null,
    "data": {
        "kg_descarga": 30340,
        "estado": "CN",
        "kg_mermas": 0
    },
    "archivos": [
        "CPE 00-01207 - CTG 10109399145 - CN.pdf",
        "cpe-00000-00001207 FRANCOVIG DOMINGO.pdf"
    ]
}
 */