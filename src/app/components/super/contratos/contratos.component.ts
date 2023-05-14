import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-contratos',
    templateUrl: './contratos.component.html',
    styleUrls: ['./contratos.component.css']
})
export class ContratosComponent {

    spinnerSocios:any = true
    spinnerContratos:any = true
    spinnerGranos:any = true
    spinnerIntervinientes:any = true

    displayContrato: Boolean = false

    db_socios: any = []
    db_granos:any = []
    db_intervinientes:any = []

    db_locales: any = {}

    contratoMostrar: any = {}

    //tabla
    cols: any = []

    dataParaMostrarTabla: any = []

    ordenarPor:any = 'socio'



    monedas:any = [
        {field:'pesos', header:'ARS'},
        {field:'dolares', header:'U$D'}
    ]
    tipos_contrato:any = [
        {field:'0', header:'NO DEFINIDO'},
        {field:'futuro', header:'A FUTURO'},
        {field:'venta', header:'A VENTA'},
        {field:'cerrado', header:'PRECIO CERRADO'},
        {field:'fijar', header:'A FIJAR'},
        {field:'forward', header:'FORWARD'},
        {field:'contra_etrega', header:'CONTADO CONTRA ENTREGA'},
        {field:'opcion', header:'OPCION'},
    ]

    constructor(
        private sqlite: SqliteService,
        private comunicacionService: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            {field:'alias', header:'Contrato'},
            {field:'socio', header:'Socio'},
            {field:'corredor', header:'Corredor'},
            {field:'comprador', header:'Comprador'},
            {field:'destino', header:'Destino'},
            {field:'tipo_contrato', header:'Tipo Contrato'},
            {field:'fecha_contrato', header:'Fecha'},
            {field:'fecha_desde', header:'Fecha Inicio'},
            {field:'fecha_hasta', header:'Fecha Hasta'},
            {field:'grano', header:'Grano'},
            {field:'kilos', header:'Kilos'},
            {field:'precio', header:'Precio'},
            {field:'moneda', header:'Moneda'},
            {field:'activo', header:'Activo'},
        ]

        this.obtenerSociosDB()
        this.obtenerGranosDB()
        this.obtenerIntervinientesDB()
        this.getDB('contratos', () => {
            this.spinnerContratos = false
            this.crearDatosTabla()
        })
    }

    obtenerSociosDB() {
        this.comunicacionService.getDB('socios').subscribe(
            (res: any) => {
                this.db_socios = res
                this.spinnerSocios = false
                this.crearDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerGranosDB() {
        this.comunicacionService.getDB('granos').subscribe(
            (res: any) => {
                this.db_granos = res
                this.spinnerGranos = false
                this.crearDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerIntervinientesDB() {
        this.comunicacionService.getDB('intervinientes').subscribe(
            (res: any) => {
                this.db_intervinientes = res
                this.spinnerIntervinientes = false
                this.crearDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    crearDatosTabla(){
        if(!this.spinnerSocios && !this.spinnerContratos && !this.spinnerGranos && !this.spinnerIntervinientes){

            this.dataParaMostrarTabla.push({
                socio: 'asd',
                alias: 'dsa'
            })

            this.dataParaMostrarTabla.sort((a:any, b:any) => {
                if (a[this.ordenarPor] < b[this.ordenarPor]) return -1;
                if (a[this.ordenarPor] > b[this.ordenarPor]) return 1;
                return 0;
            });

        }
    }


    mostrarContrato(idd:any = false){
        if(idd){
            this.contratoMostrar = this.db_locales['contratos'].find((e:any) => { return e.id == idd })

        } else {
            idd = this.generarID('contratos')

            this.contratoMostrar = {
                id: idd,
                id_socio: 1,
                id_grano: 0,
                alias: '',
                cuit_corredor: 0,
                cuit_comprador: 0,
                destino: '',
                tipo_contrato: 0,
                fecha_contrato: new Date(),
                fecha_desde: new Date(),
                fecha_hasta: new Date(),
                kilos: 0,
                precio: 0,
                moneda: 'dolares',
                activo: 0,
            }
        }

        this.displayContrato = true
    }
    borrarContrato(){
    }
    guardarEditarContrato(){

    }


    getDB(tabla: any, func: any = false) {
        this.sqlite.getDB(tabla).subscribe(
            (res: any) => {
                if (res) {
                    this.db_locales[tabla] = res
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }

                if (func) {
                    func()
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    crearDatoDB(tabla: any, data: any, func: any = false) {
        this.sqlite.createDB(tabla, data).subscribe(
            (res: any) => {
                if (res) {
                    if (res.mensaje) {
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Creado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }
                    if (func) {
                        func()
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    editarDB(tabla: any, data: any, func: any = false) {
        this.sqlite.updateDB(tabla, data).subscribe(
            (res: any) => {
                if (res) {
                    if (res.mensaje) {
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Modificado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }
                    if (func) {
                        func()
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    borrarDB(tabla: any, idd: any, func: any = false) {
        this.sqlite.deleteDB(tabla, idd).subscribe(
            (res: any) => {
                if (res) {
                    if (res.mensaje) {
                        this.messageService.add({ severity: 'success', summary: 'CORRECTO', detail: 'Borrado con exito' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en backend' })
                    }

                    if (func) {
                        func()
                    }

                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND' })
            }
        )
    }
    generarID(tabla: any) {
        var idd: any = this.generateUUID()
        if (!this.db_locales[tabla].some((e: any) => { return e.id == idd })) {
            return idd
        }
        idd = this.generateUUID()
        if (!this.db_locales[tabla].some((e: any) => { return e.id == idd })) {
            return idd
        }
        idd = this.generateUUID()
        if (!this.db_locales[tabla].some((e: any) => { return e.id == idd })) {
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
        if (tipo == 'numero') {
            return dato.toLocaleString('es-AR');
        }
        if (tipo == 'socio') {
            return this.db_socios.some((e: any) => { return e.id == dato }) ? this.db_socios.find((e: any) => { return e.id == dato }).alias : dato
        }


        return dato
    }
}