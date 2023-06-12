import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { DatePipe } from '@angular/common';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

declare var vars: any;

@Component({
    selector: 'app-kilos-campo',
    templateUrl: './kilos-campo.component.html',
    styleUrls: ['./kilos-campo.component.css']
})
export class KilosCampoComponent {

    API_URI_UPLOAD = vars.API_URI_UPLOAD;

    cols: any = [];
    selectedColumns: any = [];
    tamanoCols: any = {};

    dataParaMostrarTabla: any = []

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

    db_locales: any = []

    load_camiones: any = true
    load_choferes: any = true
    load_socios: any = true
    load_transportistas_all: any = true
    load_depositos: any = true
    load_establecimientos: any = true
    load_granos: any = true
    load_ordenes_carga: any = true
    load_intervinientes: any = true
    load_movimientos: any = true
    load_carta_porte: any = true
    load_ordenes_pago: any = true


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

    datosFiltro: any = {
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
    datos_filtrar_granos: any = []
    datos_filtrar_socios: any = []
    datos_filtrar_establecimientos: any = []
    datos_filtrar_transportistas: any = []
    datos_filtrar_corredores: any = []
    datos_filtrar_acopios: any = []

    filtroRapido: any = {}

    selectedTablaInicio: any

    faltan_kg_bruto = true
    faltan_kg_tara = true
    faltan_kg_neto = true
    faltan_kg_neto_final = true
    faltan_kg_campo = false

    establecimiento_seleccionado: any = []
    grano_seleccionado: any = []

    movimientoLocal: any = {}

    loteSelecc: any = ''
    loteSeleccionar: any = []

    constructor(
        private comunicacionService: ComunicacionService,
        private messageService: MessageService,
        private sqlite: SqliteService
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
            { field: "id_origen", header: "Campo" },
            { field: "tipo_orig", header: "Desde" },
            { field: "pat", header: "Pat." },
            { field: "patAc", header: "Pat. Ac." },
            { field: "transporte", header: "Transporte" },
            { field: "chofer", header: "Chofer" },
            { field: "id_corredor", header: "Corredor" },
            { field: "id_acopio", header: "Acopio" },

            { field: "kg_tara", header: "Tara" },
            { field: "kg_bruto", header: "Bruto" },
            { field: "kg_neto", header: "Neto" },
            { field: "kg_regulacion", header: "Carga/Desc" },
            { field: "id_deposito", header: "Dep." },
            { field: "kg_neto_final", header: "Neto Final" },
            { field: "kg_campo", header: "Neto Campo" },


            { field: "observaciones", header: "Obs" },
        ];
        this.selectedColumns = [
            { field: "cultivo", header: "Cultivo" },
            { field: "fecha", header: "Fecha" },
            { field: "orden", header: "O.C." },
            { field: "benef_orden", header: "Benef Orden" },
            { field: "cpe", header: "N° C.P." },
            { field: "benef", header: "Benef C.P." },
            { field: "ctg", header: "C.T.G." },
            { field: "id_origen", header: "Campo" },
            { field: "tipo_orig", header: "Desde" },
            { field: "pat", header: "Pat." },

            { field: "kg_tara", header: "Tara" },
            { field: "kg_bruto", header: "Bruto" },
            { field: "kg_neto", header: "Neto" },
            { field: "kg_regulacion", header: "Carga/Desc" },
            { field: "id_deposito", header: "Dep." },
            { field: "kg_neto_final", header: "Neto Final" },
            { field: "kg_campo", header: "Neto Campo" },


            { field: "local_origen", header: "Origen" },
            { field: "local_kilos", header: "Kilos" },
            { field: "local_origen2", header: "Origen" },
            { field: "local_kilos2", header: "Kilos" },

            { field: "observaciones", header: "Obs" },
        ];
        this.tamanoCols = {
            cultivo: '40px',
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
            id_corredor: '150px',
            id_acopio: '150px',
            kg_tara: '100px',
            kg_bruto: '100px',
            kg_neto: '100px',
            kg_regulacion: '100px',
            kg_neto_final: '100px',
            kg_campo: '100px',
            factura: '100px',
            gastos: '100px',
            pagado: '100px',
            observaciones: '30px',
            banderas: '80px'
        }


        this.getDB('movimientos')
        this.getDB('movimiento_origen')
        this.getDB('lotes')
        this.getDB('silos')


        this.obtenerCamiones()
        this.obtenerChoferes()
        this.obtenerSocios()
        this.obtenerDepositos()
        this.obtenerEstablecimientos()
        this.obtenerGranos()
        this.obtenerOrdenesCarga()
        this.obtenerIntervinientes()
        this.obtenerMovimientos()
        this.obtenerCartasPorte()
        this.obtenerOrdenesPago()
        this.obtenerTransportistasAll()
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
    obtenerSocios() {
        this.comunicacionService.getDB('socios').subscribe(
            (res: any) => {
                this.db_socios = res;
                this.load_socios = false;

                this.datos_filtrar_socios = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_socios]

                res.forEach((e: any) => {
                    this.datosFiltro.socios.push(e.id)
                })

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

                this.datos_filtrar_transportistas = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_transportistas_all]

                res.forEach((e: any) => {
                    this.datosFiltro.transportistas.push(e.id)
                })

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

                this.datos_filtrar_establecimientos = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_establecimientos]

                res.forEach((e: any) => {
                    this.datosFiltro.establecimientos.push(e.id)
                })

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
                this.datos_filtrar_granos = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_granos]

                res.forEach((e: any) => {
                    this.datosFiltro.granos.push(e.id)
                })
                this.datosParaTabla()
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
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerIntervinientes() {
        this.comunicacionService.getDB('intervinientes').subscribe(
            (res: any) => {
                this.db_intervinientes = res;
                this.db_acopios = [...res.filter((e: any) => { return e.dstno == 1 })]
                this.db_corredores = [...res.filter((e: any) => { return e.corvtapri == 1 })]

                this.db_intervinientes.forEach((e: any) => {
                    this.datosFiltro.acopios.push(e.id)
                    this.datosFiltro.corredores.push(e.id)
                })

                this.datos_filtrar_corredores = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_intervinientes]
                this.datos_filtrar_acopios = [{ id: 'todos', alias: '[TODOS]' }, { id: 'vacios', alias: '[Vacios]' }, ... this.db_intervinientes]

                this.intervinientesCPE = {
                    destinatario: [...res.filter((e: any) => { return e.dstro == 1 })],
                    destino: [...res.filter((e: any) => { return e.dstno == 1 })],
                    corredor_venta_primaria: [...res.filter((e: any) => { return e.corvtapri == 1 })],
                    corredor_venta_secundaria: [...res.filter((e: any) => { return e.corvtasec == 1 })],
                    mercado_a_termino: [...res.filter((e: any) => { return e.mertermino == 1 })],
                    remitente_comercial_venta_primaria: [...res.filter((e: any) => { return e.rtecomvtapri == 1 })],
                    remitente_comercial_venta_secundaria: [...res.filter((e: any) => { return e.rtecomvtasec == 1 })],
                    remitente_comercial_venta_secundaria2: [...res.filter((e: any) => { return e.rtecomvtasec2 == 1 })],
                    representante_entregador: [...res.filter((e: any) => { return e.rteent == 1 })],
                    representante_recibidor: [...res.filter((e: any) => { return e.rterec == 1 })],
                    remitente_comercial_productor: [...res.filter((e: any) => { return e.rtecomprod == 1 })],
                    intermediario_flete: [...res.filter((e: any) => { return e.intflet == 1 })],
                    pagador_flete: [...res.filter((e: any) => { return e.pagflet == 1 })],
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
    obtenerOrdenesPago() {
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
    datosParaTabla(){}
    datosParaTablaBuscar() {

        this.dataParaMostrarTabla = []

        if (!(this.load_camiones || this.load_choferes || this.load_socios || this.load_transportistas_all || this.load_depositos || this.load_establecimientos || this.load_granos || this.load_ordenes_carga || this.load_intervinientes || this.load_movimientos || this.load_carta_porte || this.load_ordenes_pago)) {

            this.buscarLotes()

            this.db_movimientos.filter((e:any) => { return (e.id_origen == this.establecimiento_seleccionado) && (e.id_grano == this.grano_seleccionado) }).forEach((e: any) => {

                //FILTROS RAPIDOS
                var ok_filtrosRapidos = true

                if (ok_filtrosRapidos) {
                    this.dataParaMostrarTabla.push(this.movimientoToMostrarTabla(e))
                }
            });
        }
    }
    movimientoToMostrarTabla(mov: any) {
        var dato: any = {
            id: mov.id,
            cultivo: mov.id_grano ? this.transformDatoTabla(mov.id_grano, "grano") : "-",
            fecha: mov.fecha ? this.transformDatoTabla(mov.fecha, "fecha") : "-",
            orden: this.transformDatoTabla(mov.id, "ordenNumero"),
            benef_orden: mov.id_socio ? this.transformDatoTabla(mov.id_socio, "socio") : "-",
            id_origen: mov.id_origen ? this.transformDatoTabla(mov.id_origen, "campo") : null,
            id_establecimiento: mov.id_origen ? mov.id_origen : null,
            tipo_orig: mov.tipo_origen ? this.transformDatoTabla(mov.tipo_origen, "tipo_orig") : "-",
            pat: mov.id_camion ? this.transformDatoTabla(mov.id_camion, "pat") : "-",
            patAc: mov.id_camion ? this.transformDatoTabla(mov.id_camion, "patAc") : "-",
            transporte: mov.id_transporte ? this.transformDatoTabla(mov.id_transporte, "transporte") : "-",
            chofer: mov.id_chofer ? this.transformDatoTabla(mov.id_chofer, "chofer") : "-",
            id_corredor: mov.id_corredor ? this.transformDatoTabla(mov.id_corredor, "intervinientes") : "-",
            id_acopio: mov.id_acopio ? this.transformDatoTabla(mov.id_acopio, "intervinientes") : "-",
            id_deposito: mov.id_deposito ? this.transformDatoTabla(mov.id_deposito, "deposito") : null,

            kg_tara: mov.kg_tara ? parseInt(mov.kg_tara) : null,
            kg_bruto: mov.kg_bruto ? parseInt(mov.kg_bruto) : null,
            kg_neto: mov.kg_neto ? parseInt(mov.kg_neto) : null,
            kg_regulacion: mov.kg_regulacion ? parseInt(mov.kg_regulacion) : null,
            kg_neto_final: mov.kg_neto_final ? parseInt(mov.kg_neto_final) : null,
            kg_campo: mov.kg_campo ? parseInt(mov.kg_campo) : null,

            observaciones: mov.observaciones ? mov.observaciones : "",

            permiteCrearCTG: true,
            existeOrdenDeCarga: this.db_ordenes_carga.some((e: any) => { return e.id_movimiento == mov.id }),

            cpe: '',
            benef: '',
            ctg: '',

            ok_mov: 0,
            ok_origen: 0,
            ok_balanza: 0,
            ok_acondicionadora: 0,
            ok_descarga: 0,
            ok_contratos: 0,
        }


        if (this.db_carta_porte.some((e: any) => { return e.id_movimiento == mov.id })) {
            const carta_porte = this.db_carta_porte.filter((e: any) => { return e.id_movimiento == mov.id })
            if (carta_porte.length == 1) {
                var sucursal: any = carta_porte[0].sucursal ? carta_porte[0].sucursal.toString().padStart(2, '0') : ''
                var cpe: any = carta_porte[0].nro_cpe ? carta_porte[0].nro_cpe.toString().padStart(5, '0') : ''

                dato.cpe = sucursal + "-" + cpe
                dato.benef = carta_porte[0].cuit_solicitante ? this.transformDatoTabla(carta_porte[0].cuit_solicitante, "socioCuit") : "-"
                dato.ctg = carta_porte[0].nro_ctg ? carta_porte[0].nro_ctg : ''
                dato.permiteCrearCTG = false
            } else {
                var cpe: any = ""
                var benef: any = ""
                var ctg: any = ""
                carta_porte.forEach((e: any) => {
                    cpe += (e.sucursal ? e.sucursal.toString().padStart(2, '0') : '') + "-" + (e.nro_cpe ? e.nro_cpe.toString().padStart(5, '0') : '') + " "
                    ctg += (e.nro_ctg ? e.nro_ctg.toString() : '') + " "
                    benef = e.cuit_solicitante ? this.transformDatoTabla(e.cuit_solicitante, "socioCuit") : "-"
                })

                dato.cpe = cpe
                dato.benef = benef
                dato.ctg = ctg
                dato.permiteCrearCTG = false
            }
        }

        //DATOS LOCALES
        if(this.db_locales['movimientos'].some((m:any) => { return m.id_movimiento == mov.id })){
            const movLocal = this.db_locales['movimientos'].find((m:any) => { return m.id_movimiento == mov.id })

            dato.ok_mov = 1

            dato.ok_origen = movLocal.ok_origen == 1
            dato.ok_balanza = movLocal.ok_balanza == 1
            dato.ok_acondicionadora = movLocal.ok_acondicionadora == 1
            dato.ok_descarga = movLocal.ok_descarga == 1
            dato.ok_contratos = movLocal.ok_contratos == 1
        }

        if(dato.ok_origen){
            const movs_orgs = this.db_locales['movimiento_origen'].filter((mov_orig:any) => { return mov_orig.id_movimiento == mov.id })
            if(movs_orgs[0]){
                dato.local_origen = movs_orgs[0].id_origen
                dato.local_kilos = movs_orgs[0].kilos
            }
            if(movs_orgs[1]){
                dato.local_origen2 = movs_orgs[1].id_origen
                dato.local_kilos2 = movs_orgs[1].kilos
            }

        }



        return dato
    }

    transformDatoTabla(dato: any, tipo: any, registro: any = 0) {
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
            return this.db_transportistas_all.some((e: any) => { return e.id == dato }) ? this.db_transportistas_all.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'cuit_transp') {
            return this.db_transportistas_all.some((e: any) => { return e.id == dato }) ? this.db_transportistas_all.find((e: any) => { return e.id == dato }).cuit : '-'
        }
        if (tipo == 'chofer') {
            return this.db_choferes.some((e: any) => { return e.id == dato }) ? this.db_choferes.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'intervinientes') {
            return this.db_intervinientes.some((e: any) => { return e.id == dato }) ? this.db_intervinientes.find((e: any) => { return e.id == dato }).alias : '-'
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
        if (tipo == 'deposito') {
            return this.db_depositos.some((e: any) => { return e.id == dato }) ? this.db_depositos.find((e: any) => { return e.id == dato }).alias : dato
        }

        if (tipo == 'ordenNumero') {
            if (this.db_ordenes_carga.some((e: any) => { return e.id_movimiento == dato })) {
                return this.db_ordenes_carga.find((e: any) => { return e.id_movimiento == dato }).numero
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

    calcularKilos(field: any, idd: any) {
        setTimeout(() => {
            var movimiento = this.dataParaMostrarTabla.find((e: any) => { return e.id == idd })

            var kg_bruto: any = movimiento.kg_bruto ? parseInt(movimiento.kg_bruto) : 0
            var kg_tara: any = movimiento.kg_tara ? parseInt(movimiento.kg_tara) : 0
            var kg_neto: any = movimiento.kg_neto ? parseInt(movimiento.kg_neto) : 0
            var kg_regulacion: any = movimiento.kg_regulacion ? parseInt(movimiento.kg_regulacion) : 0

            if (field == 'kg_bruto') {
                if (kg_tara) {
                    movimiento.kg_neto = kg_bruto - kg_tara
                } else if (kg_neto) {
                    movimiento.kg_tara = kg_bruto - kg_neto
                }
            }
            if (field == 'kg_tara') {
                if (kg_bruto) {
                    movimiento.kg_neto = kg_bruto - kg_tara
                } else {
                    movimiento.kg_neto = null
                }
            }
            if (field == 'kg_neto') {
                if (kg_tara) {
                    movimiento.kg_bruto = kg_tara + kg_neto
                }
            }

            if (movimiento.kg_neto) {
                movimiento.kg_neto_final = movimiento.kg_neto + kg_regulacion
            } else {
                movimiento.kg_neto_final = null
            }

        }, 5)
    }





    //MOVIMIENTOS LOCALES
    crearMovimientoLocal(id:any){
        let movimiento = this.db_movimientos.find((e:any) => { return e.id == id })
        console.log(movimiento)
        const idd = this.generarID('movimientos')

        this.movimientoLocal = {
            id: idd,
            id_movimiento: movimiento.id,
            id_socio: movimiento.id_socio,
            id_establecimiento: movimiento.id_origen,
            kg_campo: movimiento.kg_campo,
            kg_balanza: movimiento.kg_neto,
            kg_regulacion: movimiento.kg_regulacion,
            kg_salida: movimiento.kg_neto_final,
            kg_acondicionadora_entrada: '',
            kg_acondicionadora_diferencia: '',
            kg_acondicionadora_salida: '',
            kg_descarga: 0,
            kg_mermas: 0,
            kg_final: 0,
            observaciones_origen: '',
            observaciones_balanza: movimiento.observaciones,
            observaciones_acondicionadora: '',
            observaciones_descarga: '',
            observaciones_contratos: '',
            ok_origen: 0,
	        ok_balanza: 0,
	        ok_acondicionadora: 0,
	        ok_descarga: 0,
	        ok_contratos: 0,
        }

        this.crearDatoDB('movimientos', this.movimientoLocal, () => { 
            this.getDB('movimientos', () => { this.datosParaTablaBuscar() })
        })
    }

    crearMovimientoOrigen(registro:any){
        if(registro.local_kilos && registro.local_origen){
            var data:any = {
                id: 0,
                id_movimiento: registro.id,
                id_establecimiento: registro.id_establecimiento,
                id_origen: registro.local_origen,
                tipo_origen: registro.tipo_orig == 'Trilla' ? 'lote' : 'silo', //lote silo
                kilos: registro.local_kilos,
            }
            var movLocal:any = this.db_locales['movimientos'].find((m:any) => { return m.id_movimiento == registro.id })
            movLocal.ok_origen = 1

            data.id = this.generarID('movimiento_origen')

            this.crearDatoDB('movimiento_origen', data, ()=>{
                this.editarDB('movimientos', movLocal)
            })
        }
    }
    borrarMovimientoLocal(idd:any){
        if(confirm('Borrar MOVIMIENTO LOCAL ?')){
            const mov = this.db_locales['movimientos'].find((e:any) => { return e.id_movimiento == idd })
            if(mov){
                this.borrarDB('movimientos', mov.id, ()=>{ this.getDB('movimientos', () => { this.datosParaTablaBuscar() }) })
            }
        }
    }
    borrarLotesLocal(idd:any){
        if(confirm('Borrar MOVIMIENTOS-LOTE ?')){
            const mov = this.db_locales['movimientos'].find((e:any) => { return e.id_movimiento == idd })
            
            if(mov){
                const movs_lotes = this.db_locales['movimiento_origen'].filter((e:any) => { return e.id_movimiento == mov.id_movimiento })
                
                console.log(movs_lotes)

                movs_lotes.forEach((mov_lote:any) => {
                    this.borrarDB('movimiento_origen', mov_lote.id)
                });

                setTimeout(() => {
                    var movLocal:any = this.db_locales['movimientos'].find((m:any) => { return m.id_movimiento == mov.id_movimiento })
                    movLocal.ok_origen = 0
    
                    this.editarDB('movimientos', movLocal, ()=>{
                        this.getDB('movimientos', () => { this.datosParaTablaBuscar() })
                    })
                }, 100);
            }
        }
    }

    mostrar(){
        console.log(this.selectedTablaInicio)
    }

    buscarLotes(){
        this.loteSeleccionar = []

        this.db_establecimientos.forEach((est:any) => {
            this.db_locales['lotes'].filter((e:any) => { return e.id_establecimiento == est.id }).forEach((lote:any) => {
                this.loteSeleccionar.push({
                    id: lote.id,
                    alias: est.alias + ' - ' + lote.alias + ' (' + this.transformDatoTabla(lote.id_grano, 'grano') + ')'
                })
            })
            this.db_locales['silos'].filter((e:any) => { return e.id_establecimiento == est.id }).forEach((silo:any) => {
                this.loteSeleccionar.push({
                    id: silo.id,
                    alias: est.alias + ' - ' + silo.alias + ' (' + this.transformDatoTabla(silo.id_grano, 'grano') + ')'
                })
            })
        })
    }

    setearLotes(){
        if(this.selectedTablaInicio){
            this.selectedTablaInicio.forEach((registro:any) => {
                registro.local_origen = this.loteSelecc
            })
        }
    }
    setearKilos(){
        if(this.selectedTablaInicio){
            this.selectedTablaInicio.forEach((registro:any) => {
                registro.local_kilos = registro.kg_campo
            })
        }
    }
    
    getDB(tabla:any, func:any = false){
        this.sqlite.getDB(tabla).subscribe(
            (res:any) => {
                if(res){
                    this.db_locales[tabla] = res

                    if(func){
                        func()
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    crearDatoDB(tabla:any, data:any, func:any = false){
        this.sqlite.createDB(tabla,data).subscribe(
            (res:any) => {
                if(res){
                    if(res.mensaje){
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Creado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }
                    if(func){
                        func()
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    editarDB(tabla:any, data:any, func:any = false) {
        this.sqlite.updateDB(tabla, data).subscribe(
            (res:any) => {
                if(res){
                    if(res.mensaje){
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Modificado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }
                    if(func){
                        func()
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    borrarDB(tabla:any, idd:any, func:any = false) {
        this.sqlite.deleteDB(tabla,idd).subscribe(
            (res:any) => {
                if(res){
                    if(res.mensaje){
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Borrado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }

                    if(func){
                        func()
                    }

                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    generarID(tabla:any){
        var idd:any = this.generateUUID()
        if(!this.db_locales[tabla].some((e:any) => { return e.id == idd})){
            return idd
        }
        idd = this.generateUUID()
        if(!this.db_locales[tabla].some((e:any) => { return e.id == idd})){
            return idd
        }
        idd = this.generateUUID()
        if(!this.db_locales[tabla].some((e:any) => { return e.id == idd})){
            return idd
        }
        idd = this.generateUUID()
        return idd
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
}