import { Component } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-pagos-emitidos',
    templateUrl: './pagos-emitidos.component.html',
    styleUrls: ['./pagos-emitidos.component.css']
})
export class PagosEmitidosComponent {

    db_transportistas: any = []
    db_ordenes_pago: any = []
    db_medios_pago: any = []
    db_socios: any = []


    load_transportistas: boolean = true
    load_ordenes_pago: boolean = true
    load_medios_pago: boolean = true
    load_socios: boolean = true

    socioSeleccionado:any = ''
    fechaDesde: any
    fechaHasta: any

    ordenesDePago: any = []
    totalPagos: any = 0

    datosParaExportar:any = []


    constructor(
        private comunicacionService: ComunicacionService
    ){}

    ngOnInit() {
        this.obtenerTransportistas()
        this.obtenerOrdenesPago()
        this.obtenerMediosPago()
        this.obtenerSocios()

        this.fechaDesde =  new Date().toLocaleDateString('en-CA');
        this.fechaHasta = new Date().toLocaleDateString('en-CA');
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
    obtenerSocios() {
        this.comunicacionService.getDB("socios").subscribe(
            (res: any) => {
                this.db_socios = res;
                this.load_socios = false
            },
            (err: any) => {
                console.log(err)
            }
        )
    }


    buscarPagosEmitidos(){
        this.ordenesDePago = []
        this.datosParaExportar = []

        var fechaDesde = new Date(this.fechaDesde)
        fechaDesde.setHours(fechaDesde.getHours() + 3)

        var fechaHasta = new Date(this.fechaHasta)
        fechaHasta.setHours(fechaHasta.getHours() + 27)
        fechaHasta.setSeconds(fechaHasta.getSeconds() - 1)

        this.totalPagos = 0

        this.db_ordenes_pago.forEach((e: any) => {

            const ok_socio = e.id_socio == this.socioSeleccionado
            const ok_fechaDesde = (new Date(e.fecha)) >= fechaDesde
            const ok_fechaHasta = (new Date(e.fecha)) <= fechaHasta

            if(ok_socio && ok_fechaDesde && ok_fechaHasta){
                e.medios_pago = this.db_medios_pago.filter((f:any) => { return f.id_orden == e.id })

                //total orden
                var total = 0
                e.medios_pago.forEach((f:any) => { 
                    total += parseFloat(f.valor) ? parseFloat(f.valor) : 0

                    this.datosParaExportar.push({
                        socio: this.transformarDatoMostrarTabla(e.id_socio, "socio"),
                        fecha: this.transformarDatoMostrarTabla(e.fecha, "fecha"),
                        transportista: this.transformarDatoMostrarTabla(e.id_transportista, "transportista"),
                        ordenPunto: e.punto,
                        ordenNumero: e.numero,
                        tipo: f.tipo,
                        descripcion: f.descripcion,
                        fechaVto: this.transformarDatoMostrarTabla(f.fecha, "fecha"),
                        monto: f.valor
                    })
                });

                e.total = total

                this.ordenesDePago.push(e)

                //totales
                this.totalPagos += total
            }
        });

    }

    transformarDatoMostrarTabla(dato: any, tipo: any) {
        if (tipo == 'moneda') {
            const number = parseFloat(dato);
            if (number == 0) {
                return '$ 0'
            }
            if (number == null || !number) {
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
        if (tipo=='socio'){
            return this.db_socios.some((e:any) => { return e.id == dato }) ? this.db_socios.find((e:any) => { return e.id == dato }).razon_social : ''
        }
        if (tipo=='fecha'){
            var fecha = new Date(dato)
            fecha.setHours(fecha.getHours() + 3)
            return fecha.toLocaleDateString('es-AR')
        }

        
        if (tipo=='punto'){
            return dato.toString().padStart(2, '0')
        }
        if (tipo=='numero'){
            return dato.toString().padStart(5, '0')
        }
        if (tipo=='transportista'){
            return this.db_transportistas.some((e:any) => { return e.id == dato }) ? this.db_transportistas.find((e:any) => { return e.id == dato }).razon_social : ''
        }
        if (tipo=='transportistaCuit'){
            return this.db_transportistas.some((e:any) => { return e.id == dato }) ? this.db_transportistas.find((e:any) => { return e.id == dato }).cuit : ''
        }


        return dato
    }

    exportToExcel() {
        /* Crear un libro de trabajo */
        const workbook = XLSX.utils.book_new();
      
        /* Crear una hoja de cálculo */
        const worksheet = XLSX.utils.json_to_sheet(this.datosParaExportar);
      
        /* Agregar la hoja de cálculo al libro de trabajo */
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      
        /* Descargar el archivo */
        XLSX.writeFile(workbook, 'Pagos emitidos.xlsx');
      }

}
