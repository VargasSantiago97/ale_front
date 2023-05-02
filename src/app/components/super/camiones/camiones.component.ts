import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';

declare var vars: any;

const API_URI = vars.API_URI;
const ORDEN_CARGA = vars.ORDEN_CARGA;
const CPE_PROVINCIAS: any = vars.CPE_PROVINCIAS;
const SUCURSAL = vars.SUCURSAL;
const PDF_CPE_URI = vars.PDF_CPE_URI;
const PUNTO_ORDEN_CARGA = vars.PUNTO_ORDEN_CARGA;
@Component({
    selector: 'app-camiones',
    templateUrl: './camiones.component.html',
    styleUrls: ['./camiones.component.css']
})
export class CamionesComponent {
    @ViewChild('myCargador') uploader: any;

    API_URI_UPLOAD = vars.API_URI_UPLOAD;

    cols: any = [];

    dataParaMostrarTabla: any = []

    displayFiltros: Boolean = false;
    displayDatos: Boolean = false;

    datosParaMostrarRegistro: any = {}


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

    datosVerCPE: any = {};

    existePlantilla = false;

    intervinientesCPE: any = {};

    cpeCamposOrigen: any = [];
    cpePlantasDestino: any = [];
    cpeCamposDestino: any = [];

    datosFiltro: any = {
        fechaDesde: new Date('01/01/2023'),
        fechaHasta: new Date('12/31/2023'),
        granos: [],
        socios: [],
        establecimientos: [],
        transportistas: [],
    };
    ordenarPor: any = "fecha"

    constructor(
        private comunicacionService: ComunicacionService,
        private messageService: MessageService,
        private loginService: LoginService
    ) { }

    ngOnInit() {
        this.loginService.verificarSessionSuperUsuario();

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
            { field: "kg_neto_final", header: "Neto Salida" },
            { field: "kg_campo", header: "Neto Campo" },
            { field: "dif_balanza_tolva", header: "Balanza-Tolva" },
            { field: "kg_neto_descarga", header: "Neto Descarga" },
            { field: "kg_mermas", header: "Mermas" },
            { field: "kg_final", header: "Neto FINAL" },

            { field: "factura", header: "Facturas" },
            { field: "pagado", header: "Pagado" },

            { field: "creado", header: "Creado" },
            { field: "modificado", header: "Modificado" },

            { field: "observaciones", header: "Obser" },

            { field: "kg_s", header: "Obsers" },
            { field: "observacioness", header: "Obsers" },
            { field: "observacioness", header: "Obsers" },
            { field: "observacioness", header: "Obsers" },
            { field: "observacioness", header: "Obsers" },
            { field: "observacioness", header: "Obsers" },
            { field: "observacioness", header: "Obsers" },
            { field: "observacioness", header: "Obsers" },
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
        this.obtenerCartasPorte()
        this.obtenerAsientos()
        this.obtenerOrdenesPago()
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
    obtenerTransportistas() {
        this.comunicacionService.getDB('transportistas').subscribe(
            (res: any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;

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
    obtenerAsientos() {
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


    datosParaTabla(mantenerFiltro: any = false) {
        if (!(this.load_ordenes_pago || this.load_asientos || this.load_carta_porte || this.load_camiones || this.load_choferes || this.load_condicion_iva || this.load_socios || this.load_transportistas || this.load_campanas || this.load_depositos || this.load_establecimientos || this.load_gastos || this.load_granos || this.load_banderas || this.load_movimientos || this.load_ordenes_carga || this.load_intervinientes)) {
            this.dataParaMostrarTabla = []

            this.db_movimientos.forEach((e: any) => {

                const ok_grano = e.id_grano ? this.datosFiltro.granos.includes(e.id_grano) : true
                const ok_socio = e.id_socio ? this.datosFiltro.socios.includes(e.id_socio) : true
                const ok_establecimiento = e.id_origen ? this.datosFiltro.establecimientos.includes(e.id_origen) : true
                const ok_transportista = e.id_transporte ? this.datosFiltro.transportistas.includes(e.id_transporte) : true
                const ok_fechaDesde = e.fecha ? (new Date(e.fecha) >= new Date(this.datosFiltro.fechaDesde)) : true
                const ok_fechaHasta = e.fecha ? (new Date(e.fecha) <= new Date(this.datosFiltro.fechaHasta)) : true

                if (ok_grano && ok_socio && ok_establecimiento && ok_transportista && ok_fechaDesde && ok_fechaHasta) {
                    this.dataParaMostrarTabla.push(this.movimientoToMostrarTabla(e))
                }
            });

            //ordenamos
            this.dataParaMostrarTabla.sort((a:any, b:any) => {
                if (a[this.ordenarPor] < b[this.ordenarPor]) return -1;
                if (a[this.ordenarPor] > b[this.ordenarPor]) return 1;
                return 0;
            });

            if (mantenerFiltro) {
                this.displayFiltros = false
            }
        }
    }
    movimientoToMostrarTabla(mov: any) {
        var dato: any = {
            id: mov.id,
            cultivo: mov.id_grano ? this.transformDatoTabla(mov.id_grano, "grano") : "-",
            fecha: mov.fecha ? this.transformDatoTabla(mov.fecha, "fecha") : "-",
            orden: this.transformDatoTabla(mov.id, "ordenNumero"),
            benef_orden: mov.id_socio ? this.transformDatoTabla(mov.id_socio, "socio") : "-",
            campo: mov.id_origen ? this.transformDatoTabla(mov.id_origen, "campo") : "-",
            tipo_orig: mov.tipo_origen ? this.transformDatoTabla(mov.tipo_origen, "tipo_orig") : "-",
            pat: mov.id_camion ? this.transformDatoTabla(mov.id_camion, "pat") : "-",
            patAc: mov.id_camion ? this.transformDatoTabla(mov.id_camion, "patAc") : "-",
            transporte: mov.id_transporte ? this.transformDatoTabla(mov.id_transporte, "transporte") : "-",
            cuit_transp: mov.id_transporte ? this.transformDatoTabla(mov.id_transporte, "cuit_transp") : "-",
            id_corredor: mov.id_corredor ? this.transformDatoTabla(mov.id_corredor, "intervinientes") : "-",
            id_acopio: mov.id_acopio ? this.transformDatoTabla(mov.id_acopio, "intervinientes") : "-",

            kg_tara: mov.kg_tara ? this.transformDatoTabla(mov.kg_tara, "kg") : "-",
            kg_bruto: mov.kg_bruto ? this.transformDatoTabla(mov.kg_bruto, "kg") : "-",
            kg_neto: mov.kg_neto ? this.transformDatoTabla(mov.kg_neto, "kg") : "-",
            kg_regulacion: mov.kg_regulacion ? this.transformDatoTabla(mov.kg_regulacion, "kg") : "-",
            kg_neto_final: mov.kg_neto_final ? this.transformDatoTabla(mov.kg_neto_final, "kg") : "-",
            kg_campo: mov.kg_campo ? this.transformDatoTabla(mov.kg_campo, "kg") : "NO",
            dif_balanza_tolva: (mov.kg_neto && mov.kg_campo) ? parseInt(mov.kg_neto) - parseInt(mov.kg_campo) : "",
            dif_balanza_tolva_pintar: Math.abs((mov.kg_neto && mov.kg_campo) ? parseInt(mov.kg_neto) - parseInt(mov.kg_campo) : 0) > 200,

            kg_neto_descarga: 0,
            kg_mermas: 0,
            kg_final: 0,

            observaciones: mov.observaciones ? mov.observaciones : "-",

            permiteCrearCTG: true,
            existeOrdenDeCarga: this.db_ordenes_carga.some((e: any) => { return e.id_movimiento == mov.id }),

            gastos: '',
            factura: '',
            pagado: 'NO',

            cpe: '',
            benef: '',
            ctg: '',

            creado: this.transformDatoTabla(mov.creado_por, "user"),
            modificado: this.transformDatoTabla(mov.editado_por, "user"),

        }

        var haber = 0.0
        var debe = 0.0

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
                    cpe += e.sucursal.toString().padStart(2, '0') + "-" + e.nro_cpe.toString().padStart(5, '0') + " "
                    ctg += e.nro_ctg.toString() + " "
                    benef = e.cuit_solicitante ? this.transformDatoTabla(e.cuit_solicitante, "socioCuit") : "-"
                })

                dato.cpe = cpe
                dato.benef = benef
                dato.ctg = ctg
                dato.permiteCrearCTG = false
            }
        }

        var asientosAfectados: any = []
        if (this.db_asientos.some((e: any) => { return e.afecta ? (JSON.parse(e.afecta).length ? (JSON.parse(e.afecta).includes(mov.id)) : false) : false })) {
            const asientos = this.db_asientos.filter((e: any) => { return e.afecta ? (JSON.parse(e.afecta).length ? (JSON.parse(e.afecta).includes(mov.id)) : false) : false })
            asientos.forEach((e: any) => {

                if (e.haber) {
                    asientosAfectados.push(e.id)
                    haber += parseFloat(e.haber)
                }
                if (e.debe) {
                    debe += parseFloat(e.debe)
                }
            })
            dato.gastos = this.transformDatoTabla(debe, "moneda")
            dato.factura = this.transformDatoTabla(haber, "moneda")
        }

        for (let i = 0; i < asientosAfectados.length; i++) {
            if (this.db_ordenes_pago.some((e: any) => { return e.afecta ? (JSON.parse(e.afecta).length ? (JSON.parse(e.afecta).includes(asientosAfectados[i])) : false) : false })) {
                dato.pagado = "SI"
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
            return this.db_transportistas.some((e: any) => { return e.id == dato }) ? this.db_transportistas.find((e: any) => { return e.id == dato }).alias : '-'
        }
        if (tipo == 'cuit_transp') {
            return this.db_transportistas.some((e: any) => { return e.id == dato }) ? this.db_transportistas.find((e: any) => { return e.id == dato }).cuit : '-'
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
        if (tipo == 'user') {
            const user:any = {
                1: "SANTI",
                4: "CRISTIAN",
                5: "MONI",
                10: "ALE"
            }
            return user[dato] ? user[dato] : 'Otro'
        }
        return registro.id
    }


    verDatosRegistro(mov_id:any){
        let movimiento = this.db_movimientos.find((e:any) => { return e.id == mov_id})
        this.displayDatos = true

        console.log(this.movimientoToMostrarTabla(movimiento))

        this.datosParaMostrarRegistro = this.movimientoToMostrarTabla(movimiento)
    }













    //Plantillas Filtros
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
            if (this.db_ordenes_carga.some((e: any) => { return e.id_movimiento == registro.id })) {
                return this.db_ordenes_carga.find((e: any) => { return e.id_movimiento == registro.id }).numero
            } else {
                return ""
            }
        }
        if (tipo == 'existeOrdenCarga') {
            return this.db_ordenes_carga.some((e: any) => { return e.id_movimiento == registro })
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

    CPE_guardarDB() {
        this.datosCPE.activo = 1
        this.datosCPE.estado = 1

        //DOMINIOS
        var dominios = []
        this.datosCPE.dominio ? dominios.push(this.datosCPE.dominio) : null
        this.datosCPE.dominio2 ? dominios.push(this.datosCPE.dominio2) : null
        this.datosCPE.dominio3 ? dominios.push(this.datosCPE.dominio3) : null
        this.datosCPE.dominio = JSON.stringify(dominios)

        //DESTINO
        if (this.datosCPE.es_destino_campo) {
            this.datosCPE.cod_localidad = this.cpeCamposDestino.some((e: any) => { return e.codLocalidad == this.datosCPE.cod_destino }) ? this.cpeCamposDestino.find((e: any) => { return e.codLocalidad == this.datosCPE.cod_destino }).codLocalidad : null
            this.datosCPE.cod_provincia = this.cpeCamposDestino.some((e: any) => { return e.codLocalidad == this.datosCPE.cod_destino }) ? this.cpeCamposDestino.find((e: any) => { return e.codLocalidad == this.datosCPE.cod_destino }).codProvincia : null
            this.datosCPE.planta_destino = 1
        } else {
            this.datosCPE.cod_localidad = this.cpePlantasDestino.some((e: any) => { return e.nroPlanta == this.datosCPE.cod_destino }) ? this.cpePlantasDestino.find((e: any) => { return e.nroPlanta == this.datosCPE.cod_destino }).codLocalidad : null
            this.datosCPE.cod_provincia = this.cpePlantasDestino.some((e: any) => { return e.nroPlanta == this.datosCPE.cod_destino }) ? this.cpePlantasDestino.find((e: any) => { return e.nroPlanta == this.datosCPE.cod_destino }).codProvincia : null
            this.datosCPE.planta_destino = this.cpePlantasDestino.some((e: any) => { return e.nroPlanta == this.datosCPE.cod_destino }) ? this.datosCPE.cod_destino : null
        }

        //ORIGEN
        if (this.datosCPE.es_solicitante_campo) {
            if (this.datosCPE.cod_localidad_productor) {
                this.datosCPE.planta_origen = false
                this.datosCPE.cod_provincia_operador = false
                this.datosCPE.cod_localidad_operador = false
                this.datosCPE.cod_provincia_productor = this.cpeCamposOrigen.some((e: any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }) ? this.cpeCamposOrigen.find((e: any) => { return e.codLocalidad == this.datosCPE.cod_localidad_productor }).codProvincia : null
            }
        } else {
            this.datosCPE.cod_provincia_productor = false
            this.datosCPE.cod_localidad_productor = false
            this.datosCPE.planta_origen = ""
            this.datosCPE.cod_provincia_operador = ""
            this.datosCPE.cod_localidad_operador = ""
        }

        this.comunicacionService.createDB("carta_porte", this.datosCPE).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Creado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })

                this.obtenerCartasPorte()

                //subir archivos
                if (this.datosCPE.nro_ctg) {
                    this.uploader.upload()
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )

    }
}
