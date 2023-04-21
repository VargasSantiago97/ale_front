import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

declare var vars: any;


@Component({
    selector: 'app-cuentas-corrientes',
    templateUrl: './cuentas-corrientes.component.html',
    styleUrls: ['./cuentas-corrientes.component.css']
})
export class CuentasCorrientesComponent {

    API_URI = vars.API_URI_CONAGRO;

    db_camiones: any = []
    db_choferes: any = []
    db_transportistas: any = []
    db_condicion_iva: any = []
    db_socios: any = []
    db_movimientos: any = []
    db_granos: any = []
    db_ordenes_carga: any = []

    dataMovimientosASeleccionar: any = []
    dataMovimientosSeleccionados: any = []

    datosAsiento: any = {}

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
    load_ordenes_carga: any = true

    displayNuevoViaje: any = false

    cols: any = []
    selectedColumns: any = []

    constructor(
        private messageService: MessageService,
        private comunicacionService: ComunicacionService,
    ){}

    ngOnInit(){
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
        this.obtenerOrdenesCarga()
    }

    //CONEXION A BASE DE DATOS
    obtenerCamiones(){
        this.comunicacionService.getDB("camiones").subscribe(
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
        this.comunicacionService.getDB("choferes").subscribe(
            (res:any) => {
                this.db_choferes = res;
                this.load_choferes = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerTransportistas(){
        this.comunicacionService.getDB("transportistas").subscribe(
            (res:any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerCondicion_iva(){
        this.comunicacionService.getDB("condicion_iva").subscribe(
            (res:any) => {
                this.db_condicion_iva = res;
                this.load_condicion_iva = false
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerSocios(){
        this.comunicacionService.getDB("socios").subscribe(
            (res:any) => {
                this.db_socios = res;
            },
            (err:any) => {
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
    obtenerOrdenesCarga(){
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

    onSelectTransporte(){
        this.buscarDatosTransportista()
    }

    onSelectSocio(){
        if(this.transportista){
            this.buscarDatosTransportista()
        }
    }

    buscarDatosTransportista(){
        this.dataMovimientosASeleccionar = []

        this.db_movimientos.filter((e:any) => { return (( e.id_socio == this.socio.id) && (e.id_transporte==this.transportista.id)) }).map((e:any) => {

            const dateObj = new Date(e.fecha);
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const dateString = `${year}/${month}/${day}`;

            const patentes = this.db_camiones.some((f:any) => {return f.id == e.id_camion}) ? this.db_camiones.find((f:any) => {return f.id == e.id_camion}).patente_chasis +' / '+ this.db_camiones.find((f:any) => {return f.id == e.id_camion}).patente_acoplado : ''

            this.dataMovimientosASeleccionar.push({
                id: e.id,
                fecha : dateString,
                cultivo : this.db_granos.some((f:any) => {return f.id == e.id_grano}) ? this.db_granos.find((f:any) => {return f.id == e.id_grano}).alias : '-',
                orden : this.db_ordenes_carga.some((f:any) => {return f.id_movimiento == e.id}) ? this.db_ordenes_carga.find((f:any) => {return f.id_movimiento == e.id}).numero : '',
                ctg : '10105050505',
                cpe : '001-5555',
                campo : e.campo,
                pat : patentes,
                kg_neto_final : e.kg_neto_final,
                tarifa : 7000,
                kg_descarga : 35.20,
                monto_final : 246400
            })
        })
    }

    transformarDatoMostrarTabla(dato:any, tipo:any){
        return dato
    }

    agregarMovimiento(mov:any){
        this.dataMovimientosSeleccionados.push(mov)

        var valorSuma = 0
        this.dataMovimientosSeleccionados.forEach((e:any) => {
            const valorActual = parseFloat(e.monto_final) ? parseFloat(e.monto_final) : 0
            valorSuma = valorSuma + valorActual
        });

        this.datosAsiento.montoTotal = valorSuma.toFixed(2)
        this.datosAsiento.montoFactura = valorSuma.toFixed(2)
        this.datosAsiento.descripcion = 'FLETE'
    }

    onUpload(event: any) {
        alert('Cargado 🫶')
    }

    verVars(){
        console.log(this.datosAsiento)
    }

    nuevoAsientoViaje(){
        this.displayNuevoViaje = true

        const fecha = new Date().toISOString().slice(0, 10);

        this.datosAsiento = {
            montoTotal: 0,
            letra: 'A',
            punto: null,
            numero: null,
            montoFactura: 0,
            fecha: fecha,
            descripcion: null,
            observaciones: null
        }
    }

}
