import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

declare var vars: any;
const API_URI = vars.API_URI;
const ORDEN_CARGA = vars.ORDEN_CARGA;

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

    cols: any = [];
    selectedColumns: any = [];

    dataParaMostrarTabla: any = []

    displayFiltros: Boolean = false;
    displayNuevoMovimiento: Boolean = false;
    displayBanderas: Boolean = false;
    displayBanderasDis: Boolean = false;
    displayOrdenCarga: Boolean = false;

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
    db_movimientos: any = []


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
    load_corredores: any = true
    load_acopios: any = true
    load_movimientos: any = true


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

    disFlag: any = {icono:null, fondo:null, color:null};
    fondosFlag: any = ['info', 'success', 'warning', 'danger'];
    iconsFlag: any = ['pi-flag-fill', 'pi-bookmark-fill', 'pi-calendar', 'pi-check-square', 'pi-circle-fill', 'pi-cog', 'pi-dollar', 'pi-file-edit', 'pi-info-circle', 'pi-sync', 'pi-thumbs-up-fill', 'pi-thumbs-down-fill', 'pi-user', 'pi-exclamation-triangle', 'pi-exclamation-circle'];

    datosMovimiento: any;
    datosOrdenCarga: any = {};

    existePlantilla = false;

    constructor(
        private comunicacionService: ComunicacionService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {

        this.cols = [
            { field: "cultivo", header: "cultivo" },
            { field: "fecha", header: "fecha" },
            { field: "orden", header: "orden" },
            { field: "benef_orden", header: "benef_orden" },
            { field: "cpe", header: "cpe" },
            { field: "benef", header: "benef" },
            { field: "ctg", header: "ctg" },
            { field: "campo", header: "campo" },
            { field: "tipo_orig", header: "tipo_orig" },
            { field: "pat", header: "pat" },
            { field: "patAc", header: "patAc" },
            { field: "transporte", header: "transporte" },
            { field: "cuit", header: "cuit" },
            { field: "gasoil", header: "gasoil" },
            { field: "rem", header: "rem" },
            { field: "corre", header: "corre" },
            { field: "acop", header: "acop" },
            { field: "kg_tara", header: "tara" },
            { field: "kg_bruto", header: "bruto" },
            { field: "kg_neto", header: "neto" },
            { field: "kg_regulacion", header: "carga" },
            { field: "kg_regulacion", header: "descarga" },
            { field: "kg_neto_final", header: "netofin" },
            { field: "factura", header: "factura" },
            { field: "pagado", header: "pagado" },
            { field: "observaciones", header: "observaciones" },
            { field: "id_origen", header: "origen" },
        ];
        this.selectedColumns = [
            { field: "cultivo", header: "cultivo" },
            { field: "fecha", header: "fecha" },
            { field: "campo", header: "campo" },
            { field: "tipo_orig", header: "tipo_orig" },
            { field: "pat", header: "pat" },
            { field: "patAc", header: "patAc" },
            { field: "transporte", header: "transporte" },
            { field: "kg_neto_final", header: "netofin" },
            { field: "factura", header: "factura" },
            { field: "pagado", header: "pagado" },
            { field: "observaciones", header: "observaciones" },
            { field: "id_origen", header: "origen" },

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
        this.obtenerCorredores()
        this.obtenerAcopios()
        this.obtenerMovimientos()

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
            activo: null,
            estado: null
        }
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

                console.log(res)
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
    obtenerCorredores() {
        this.comunicacionService.getDB('corredores').subscribe(
            (res: any) => {
                this.db_corredores = res;
                this.load_corredores = false;
                this.datosParaTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerAcopios() {
        this.comunicacionService.getDB('acopios').subscribe(
            (res: any) => {
                this.db_acopios = res;
                this.load_acopios = false;
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

    datosParaTabla() {
        if (!(this.load_camiones || this.load_choferes || this.load_condicion_iva || this.load_socios || this.load_transportistas || this.load_campanas || this.load_depositos || this.load_establecimientos || this.load_gastos || this.load_granos || this.load_banderas || this.load_corredores || this.load_acopios || this.load_movimientos)) {
            this.dataParaMostrarTabla = []

            this.db_movimientos.forEach((e: any) => {
                this.dataParaMostrarTabla.push(e)
                console.log(e)
            });
        }
    }


    buscarTransporte() {
        if (this.db_transportistas.some((e: any) => { return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase() })) {
            this.transportista = { ... this.db_transportistas.find((e: any) => { return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase() }) }
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
        }
    }

    onSelectCamion() {
        if (this.datosMovimiento.id_camion) {
            this.camion = this.db_camiones.find((e: any) => { return e.id == this.datosMovimiento.id_camion })
            this.cod_camion = this.camion.codigo
            this.datosMovimiento.kg_tara = this.camion.kg_tara
        }
    }

    buscarChoferesCamiones() {
        this.select_choferes = this.db_choferes.filter((e: any) => { return e.id_transportista == this.transportista.id })
        this.select_camiones = this.db_camiones.filter((e: any) => { return e.id_transportista == this.transportista.id })

        this.datosMovimiento.id_chofer = { ... this.select_choferes[0].id }
        this.onSelectChofer()
        this.datosMovimiento.id_camion = { ... this.select_camiones[0].id }
        this.onSelectCamion()

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
            this.datosMovimiento.kg_bruto = event.value
            this.datosMovimiento.kg_neto = this.datosMovimiento.kg_bruto - this.datosMovimiento.kg_tara
        }
        if (ingresa == 'kilos_tara' && this.datosMovimiento.kg_bruto) {
            this.datosMovimiento.kg_tara = event.value
            this.datosMovimiento.kg_neto = this.datosMovimiento.kg_bruto - this.datosMovimiento.kg_tara
        }
        if (ingresa == 'kilos_neto') {
            this.datosMovimiento.kg_neto = event.value
            this.datosMovimiento.kg_bruto = this.datosMovimiento.kg_neto + this.datosMovimiento.kg_tara
        }


        if (ingresa == 'kilos_carga_descarga') {
            this.datosMovimiento.kg_regulacion = event.value
        }
        if (this.datosMovimiento.kg_neto) {
            this.datosMovimiento.kg_neto_final = this.datosMovimiento.kg_neto + this.datosMovimiento.kg_regulacion
        }

        if (ingresa == 'kilos_neto_final') {
            this.datosMovimiento.kg_neto_final = event.value
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

        if(localStorage.getItem('plantilla')){
            this.datosMovimiento = this.base64toObjUtf8(localStorage.getItem('plantilla'))
            this.existePlantilla = true;
        }

        this.datosMovimiento.fecha = fecha


        //esto iria para EDITAR:
        if (this.datosMovimiento.id_transporte) {
            //this.onSelectTransporte()
        }
        if (this.datosMovimiento.id_chofer) {
            //this.onSelectChofer()
        }
        if (this.datosMovimiento.id_camion) {
            //this.onSelectChofer()
        }


        this.displayNuevoMovimiento = true
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
    disenarFlag(bandera:any){
        this.disFlag = bandera
        this.displayBanderasDis = true
    }

    guardarMovimiento(){
        var idd = this.generateUUID()
        if (this.db_movimientos.some((e: any) => { return e.id == idd })) {
            this.guardarMovimiento()
            return
        }

        this.datosMovimiento.id = idd
        this.datosMovimiento.fecha = this.datosMovimiento.fecha.toISOString().slice(0, 19).replace('T', ' ');

        this.comunicacionService.createDB("movimientos", this.datosMovimiento).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                this.displayNuevoMovimiento = false
                this.obtenerMovimientos()
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }
    mostrarMovimiento(mov:any){
        this.datosMovimiento = { ... mov }
        this.displayNuevoMovimiento = true
    }

    //ORDEN CARGA
    nuevaOrdenCarga(){
        var fecha = new Date(this.datosMovimiento.fecha);
        const fechaFormateada = fecha.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, "/");

        this.datosOrdenCarga = {
        numero: '00-0001',
        fecha: fechaFormateada,
        beneficiario: this.transformarDatoMostrar(this.datosMovimiento.id_socio, "socio").toUpperCase(),
        transportista: this.transformarDatoMostrar(this.datosMovimiento.id_transporte, "transporte").split(" ").map((word:any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
        conductor: this.transformarDatoMostrar(this.datosMovimiento.id_chofer, "chofer").split(" ").map((word:any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
        patentes: this.transformarDatoMostrar(this.datosMovimiento.id_camion, "patentes"),
        establecimiento: this.transformarDatoMostrar(this.datosMovimiento.id_socio, "establecimiento").toUpperCase(),
        cultivo: this.transformarDatoMostrar(this.datosMovimiento.id_socio, "grano").toUpperCase(),
        trilla_silo: this.transformarDatoMostrar(this.datosMovimiento.tipo_origen, "tipo_origen").toUpperCase(),
        tara: this.transformarDatoMostrar(this.datosMovimiento.kg_tara, "kilos"),
        bruto: this.transformarDatoMostrar(this.datosMovimiento.kg_bruto, "kilos"),
        neto: this.transformarDatoMostrar(this.datosMovimiento.kg_neto, "kilos"),
        firma1: this.transformarDatoMostrar(this.datosMovimiento.id_chofer, "chofer").split(" ").map((word:any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
        firma2: 'cargador',
        observaciones: ''
        }

        this.displayOrdenCarga = true
    }

    guardarOrdenCarga(accion:any){
        if(accion == 'guardar_ver'){
            this.mostrarOrdenCarga('ver')
        }
        if(accion == 'guardar_descargar'){
            this.mostrarOrdenCarga('descargar')
        }

        this.displayOrdenCarga = false

    }

    //plantilla
    guardarPlantilla(){
        localStorage.setItem('plantilla', this.objUtf8ToBase64(this.datosMovimiento))
        this.existePlantilla = true
        this.messageService.add({ severity: 'success', summary: 'Guardado!', detail: 'Plantilla Guardada' })
    }
    borrarPlantilla(){
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

    transformarDatoMostrar(dato: any, tipo: any) {
        if (tipo == 'condicion_iva') {
            return this.db_condicion_iva.some((e: any) => { return e.codigo == dato }) ? this.db_condicion_iva.find((e: any) => { return e.codigo == dato }).descripcion : '-'
        }

        if (tipo == 'id_origen') {
            return this.db_establecimientos.some((e: any) => { return e.id == dato }) ? this.db_establecimientos.find((e: any) => { return e.id == dato }).descripcion : '-'
        }
        
        if (tipo == 'kilos') {
            return this.db_establecimientos.some((e: any) => { return e.id == dato }) ? this.db_establecimientos.find((e: any) => { return e.id == dato }).descripcion : '-'
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
            if(this.db_camiones.some((e: any) => { return e.id == dato })){
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
        
        return dato
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

    objUtf8ToBase64(ent:any) {
        let str = JSON.stringify(ent)
        let bytes = new TextEncoder().encode(str);
        let base64 = btoa(String.fromCharCode(...new Uint8Array(bytes.buffer)));
        return base64;
    }
    base64toObjUtf8(ent:any) {
        let json = atob(ent);
        let utf8String = decodeURIComponent(escape(json));
        let obj = JSON.parse(utf8String)
        return obj;
    }

}

//["id", "fecha", "id_campana", "id_socio", "id_origen", "id_grano", "id_transporte", "id_chofer", "id_camion", "id_corredor", "id_acopio", "id_deposito", "kg_bruto", "kg_tara", "kg_neto", "kg_regulacion", "kg_neto_final", "observaciones", "tipo_origen", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]