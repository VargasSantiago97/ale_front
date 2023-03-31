import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

declare var vars: any;
const API_URI = vars.API_URI;

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

    accordeonVer = [false , false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false]
    optionsDe = [{label: 'Silo', id:'S'},{label: 'Trilla', id:'T'},{label: 'Otro', id:'O'}]

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

    kilos_bruto: any = null;
    kilos_tara: any = null;
    kilos_neto: any = null;
    kilos_carga_descarga: any = null;
    kilos_neto_final: any = null;

    datosMovimiento: any;

    constructor(
        private comunicacionService: ComunicacionService,
        private messageService: MessageService,
    ){}

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
            { field: "tara", header: "tara" },
            { field: "bruto", header: "bruto" },
            { field: "neto", header: "neto" },
            { field: "carga", header: "carga" },
            { field: "descarga", header: "descarga" },
            { field: "netofin", header: "netofin" },
            { field: "factura", header: "factura" },
            { field: "pagado", header: "pagado" },
            { field: "obs", header: "obs" },
        ];
        this.selectedColumns = [
            { field: "cultivo", header: "cultivo" },
            { field: "fecha", header: "fecha" },
            { field: "campo", header: "campo" },
            { field: "tipo_orig", header: "tipo_orig" },
            { field: "pat", header: "pat" },
            { field: "patAc", header: "patAc" },
            { field: "transporte", header: "transporte" },
            { field: "netofin", header: "netofin" },
            { field: "factura", header: "factura" },
            { field: "pagado", header: "pagado" },
            { field: "obs", header: "obs" },

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

    obtenerCamiones(){
        this.comunicacionService.get_camiones().subscribe(
            (res:any) => {
                this.db_camiones = res;
                this.load_camiones = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerChoferes(){
        this.comunicacionService.get_choferes().subscribe(
            (res:any) => {
                this.db_choferes = res;
                this.load_choferes = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerCondicion_iva(){
        this.comunicacionService.get_condicion_iva().subscribe(
            (res:any) => {
                this.db_condicion_iva = res;
                this.load_condicion_iva = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerSocios(){
        this.comunicacionService.get_socios().subscribe(
            (res:any) => {
                this.db_socios = res;
                this.load_socios = false;

                console.log(res)
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerTransportistas(){
        this.comunicacionService.get_transportistas().subscribe(
            (res:any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerCampanas(){
        this.comunicacionService.get_campanas().subscribe(
            (res:any) => {
                this.db_campanas = res;
                this.load_campanas = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerDepositos(){
        this.comunicacionService.get_depositos().subscribe(
            (res:any) => {
                this.db_depositos = res;
                this.load_depositos = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerEstablecimientos(){
        this.comunicacionService.get_establecimientos().subscribe(
            (res:any) => {
                this.db_establecimientos = res;
                this.load_establecimientos = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerGastos(){
        this.comunicacionService.get_gastos().subscribe(
            (res:any) => {
                this.db_gastos = res;
                this.load_gastos = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerGranos(){
        this.comunicacionService.get_granos().subscribe(
            (res:any) => {
                this.db_granos = res;
                this.load_granos = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }


    buscarTransporte(){
        if(this.db_transportistas.some((e:any) => {return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase()})){
            this.transportista = { ... this.db_transportistas.find((e:any) => {return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase()}) }
            this.buscarChoferesCamiones()
        } else {
            this.transportista = null
            this.messageService.add({severity:'error', summary:'Error!', detail:'TRANSPORTISTA no encontrado'})
        }
        
    }

    buscarChofer(){
        if(this.select_choferes.some((e:any) => {return e.codigo.toUpperCase() == this.cod_chofer.toUpperCase()})){
            this.chofer = { ... this.select_choferes.find((e:any) => {return e.codigo.toUpperCase() == this.cod_chofer.toUpperCase()}) }
        } else {
            this.chofer = null
            this.messageService.add({severity:'error', summary:'Error!', detail:'CHOFER no encontrado'})
        }  
    }

    buscarCamion(){
        if(this.select_camiones.some((e:any) => {return e.codigo.toUpperCase() == this.cod_camion.toUpperCase()})){
            this.camion = { ... this.select_camiones.find((e:any) => {return e.codigo.toUpperCase() == this.cod_camion.toUpperCase()}) }
        } else {
            this.camion = null
            this.messageService.add({severity:'error', summary:'Error!', detail:'CAMION no encontrado'})
        }  
    }

    
    onSelectTransporte(){
        if(this.datosMovimiento.id_transporte){
            this.transportista = this.db_transportistas.find((e:any) => { return e.id == this.datosMovimiento.id_transporte})
            this.cod_transporte = this.transportista.codigo
            this.buscarChoferesCamiones()
        }
    }

    onSelectChofer(){
        if(this.datosMovimiento.id_chofer){
            this.chofer = this.db_choferes.find((e:any) => { return e.id == this.datosMovimiento.id_chofer})
            this.cod_chofer = this.chofer.codigo
        }
    }

    onSelectCamion(){
        if(this.datosMovimiento.id_camion){
            this.camion = this.db_camiones.find((e:any) => { return e.id == this.datosMovimiento.id_camion})
            this.cod_camion = this.camion.codigo
            this.kilos_tara = this.camion.kg_tara
        }
    }

    buscarChoferesCamiones(){
        this.select_choferes = this.db_choferes.filter((e:any) => { return e.id_transportista == this.transportista.id})
        this.select_camiones = this.db_camiones.filter((e:any) => { return e.id_transportista == this.transportista.id})

        this.datosMovimiento.id_chofer = { ... this.select_choferes[0].id }
        this.onSelectChofer()
        this.datosMovimiento.id_camion = { ... this.select_camiones[0].id }
        this.onSelectCamion()

    }

    verTodosChoferes(){
        this.select_choferes = [ ...this.db_choferes ]
    }
    verTodosCamiones(){
        this.select_camiones = [ ...this.db_camiones ]
    }


    calcularKilos(event:any, ingresa:any){

        if(ingresa == 'kilos_bruto'){
            this.kilos_bruto = event.value
            this.kilos_neto = this.kilos_bruto - this.kilos_tara
        }
        if(ingresa == 'kilos_tara' && this.kilos_bruto){
            this.kilos_tara = event.value
            this.kilos_neto = this.kilos_bruto - this.kilos_tara
        }
        if(ingresa == 'kilos_neto'){
            this.kilos_neto = event.value
            this.kilos_bruto = this.kilos_neto + this.kilos_tara
        }


        if(ingresa == 'kilos_carga_descarga'){
            this.kilos_carga_descarga = event.value
        }
        if(this.kilos_neto){
            this.kilos_neto_final = this.kilos_neto + this.kilos_carga_descarga
        }
    
        if(ingresa == 'kilos_neto_final'){
            this.kilos_neto_final = event.value
            this.kilos_neto = this.kilos_neto_final - this.kilos_carga_descarga
            this.kilos_bruto = this.kilos_neto + this.kilos_tara
        }

    }

    save(event:any) {
        console.log("You entered: ", event.target.value);
    }

    nuevoMovimiento(){
        var fecha = new Date()

        this.datosMovimiento = {
            id: null,
            fecha: fecha,
            id_campana: "23b3f4f21c28",
            id_socio: "4",
            id_origen: "1",
            id_grano: "1",
            id_transporte: "f0d0249ad9d0",
            id_chofer: "18e305302f41",
            id_camion: null,
            id_corredor: null,
            id_acopio: null,
            id_deposito: null,
            kg_bruto: null,
            kg_tara: null,
            kg_neto: null,
            kg_regulacion: null,
            kg_neto_final: null,
            observaciones: null,
            tipo_origen: "T",
            creado_por: null,
            creado_el: null,
            editado_por: null,
            editado_el: null,
            activo: null,
            estado: null
        }
        this.datosMovimiento = {
            id: null,
            fecha: fecha,
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

        //esto iria para EDITAR:
        if(this.datosMovimiento.id_transporte){
            this.onSelectTransporte()
        }
        if(this.datosMovimiento.id_chofer){
            this.onSelectChofer()
        }
        if(this.datosMovimiento.id_camion){
            this.onSelectChofer()
        }


        this.displayNuevoMovimiento = true
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
        if(tipo == 'condicion_iva'){
            return this.db_condicion_iva.some((e:any) => { return e.codigo == dato}) ? this.db_condicion_iva.find((e:any) => { return e.codigo == dato}).descripcion : '-'
        }

        if(tipo == 'id_origen'){
            return this.db_establecimientos.some((e:any) => { return e.id == dato}) ? this.db_establecimientos.find((e:any) => { return e.id == dato}).descripcion : '-'
        }

        return dato
    }

    tiraFun(e:any){
        console.log(this.datosMovimiento)
    }

    verVars(){
        console.log(this.transportista)
        console.log(this.chofer)
        console.log(this.camion)
    }
}