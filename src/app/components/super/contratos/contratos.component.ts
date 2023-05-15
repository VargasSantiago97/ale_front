import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';
import * as XLSX from 'xlsx';

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

    ordenarPorAnterior:any = 'socio'
    ordenarMayorMenor:Boolean = true



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

            this.dataParaMostrarTabla = []

            //foreach
            this.db_locales['contratos'].forEach((e:any) => {
                const fecha_contrato = new Date(e.fecha_contrato);
                const fecha_desde = new Date(e.fecha_desde);
                const fecha_hasta = new Date(e.fecha_hasta);

                const anioCto = fecha_contrato.getFullYear();
                const mesCto = (fecha_contrato.getMonth() + 1).toString().padStart(2, '0');
                const diaCto = (fecha_contrato.getDate()).toString().padStart(2, '0');

                const anioDesde = fecha_desde.getFullYear();
                const mesDesde = (fecha_desde.getMonth() + 1).toString().padStart(2, '0');
                const diaDesde = (fecha_desde.getDate()).toString().padStart(2, '0');

                const anioHasta = fecha_hasta.getFullYear();
                const mesHasta = (fecha_hasta.getMonth() + 1).toString().padStart(2, '0');
                const diaHasta = (fecha_hasta.getDate()).toString().padStart(2, '0');

                var fecha_contratoFormat = `${anioCto}-${mesCto}-${diaCto}`
                var fecha_desdeFormat = `${anioDesde}-${mesDesde}-${diaDesde}`
                var fecha_hastaFormat = `${anioHasta}-${mesHasta}-${diaHasta}`
                
                if(!e.fecha_contrato || (e.fecha_contrato == 'null')){
                    fecha_contratoFormat = ''
                }
                if(!e.fecha_desde || (e.fecha_desde == 'null')){
                    fecha_desdeFormat = ''
                }
                if(!e.fecha_hasta || (e.fecha_hasta == 'null')){
                    fecha_hastaFormat = ''
                }



                this.dataParaMostrarTabla.push({
                    id: e.id,
                    alias: e.alias,
                    socio: this.transformarDatoMostrarTabla(e.id_socio, 'socio'),
                    corredor: this.transformarDatoMostrarTabla(e.cuit_corredor, 'interviniente'),
                    comprador: this.transformarDatoMostrarTabla(e.cuit_comprador, 'interviniente'),
                    destino: e.destino,
                    tipo_contrato: this.transformarDatoMostrarTabla(e.tipo_contrato, 'tipo_contrato'),
                    fecha_contrato: fecha_contratoFormat,
                    fecha_desde: fecha_desdeFormat,
                    fecha_hasta: fecha_hastaFormat,
                    grano: this.transformarDatoMostrarTabla(e.id_grano, 'grano'),
                    kilos: this.transformarDatoMostrarTabla(e.kilos, 'numero'),
                    precio: this.transformarDatoMostrarTabla(e.precio, 'moneda'),
                    moneda: this.transformarDatoMostrarTabla(e.moneda, 'monedaTipo'),
                    activo: e.activo,
                })
            })
        }
    }
    ordenarTabla(ordenarPor:any){

        if(ordenarPor == this.ordenarPorAnterior){
            this.ordenarMayorMenor = !this.ordenarMayorMenor
        }
    
        this.ordenarPorAnterior = ordenarPor

        this.dataParaMostrarTabla.sort((a:any, b:any) => {
            if(this.ordenarMayorMenor){
                if (a[ordenarPor] < b[ordenarPor]) return -1;
                if (a[ordenarPor] > b[ordenarPor]) return 1;
            } else {
                if (a[ordenarPor] < b[ordenarPor]) return 1;
                if (a[ordenarPor] > b[ordenarPor]) return -1;
            }

            return 0;
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
        if (tipo=='numero'){
            return parseFloat(dato) ? parseFloat(dato).toLocaleString('es-AR', { useGrouping: true }) : dato;
        }
        if(tipo=='socio'){
            return this.db_socios.some((e:any) => { return e.id == dato }) ? this.db_socios.find((e:any) => { return e.id == dato }).alias : dato
        }
        if(tipo=='grano'){
            return this.db_granos.some((e:any) => { return e.id == dato }) ? this.db_granos.find((e:any) => { return e.id == dato }).alias : dato
        }
        if(tipo=='interviniente'){
            return this.db_intervinientes.some((e:any) => { return e.cuit == dato }) ? this.db_intervinientes.find((e:any) => { return e.cuit == dato }).alias : dato
        }
        if(tipo=='tipo_contrato'){
            return this.tipos_contrato.some((e:any) => { return e.field == dato }) ? this.tipos_contrato.find((e:any) => { return e.field == dato }).header : dato
        }
        if(tipo=='monedaTipo'){
            return this.monedas.some((e:any) => { return e.field == dato }) ? this.monedas.find((e:any) => { return e.field == dato }).header : dato
        }

        return dato
    }


    mostrarContrato(idd:any = false){
        if(idd){
            this.contratoMostrar = this.db_locales['contratos'].find((e:any) => { return e.id == idd })

            this.contratoMostrar.fecha_contrato = this.contratoMostrar.fecha_contrato ? new Date(this.contratoMostrar.fecha_contrato) : null
            this.contratoMostrar.fecha_desde = this.contratoMostrar.fecha_desde ? new Date(this.contratoMostrar.fecha_desde) : null
            this.contratoMostrar.fecha_hasta = this.contratoMostrar.fecha_hasta ? new Date(this.contratoMostrar.fecha_hasta) : null

        } else {
            this.contratoMostrar = {
                id: false,
                id_socio: null,
                id_grano: null,
                alias: '',
                cuit_corredor: 0,
                cuit_comprador: 0,
                destino: '',
                tipo_contrato: 0,
                fecha_contrato: new Date(),
                fecha_desde: new Date(),
                fecha_hasta: new Date(),
                kilos: null,
                precio: null,
                moneda: 'dolares',
                activo: 1,
            }
        }

        this.displayContrato = true
    }
    borrarContrato(idd:any){
        if(confirm('Eliminar?')){
            this.borrarDB('contratos', idd, ()=>{
                this.displayContrato = false

                this.getDB('contratos', () => {
                    this.crearDatosTabla()
                })
            })
        }
    }
    guardarEditarContrato(contrato:any){
        console.log(contrato)
        if(contrato.id){
            //edit
            this.editarDB('contratos', contrato, ()=>{
                this.displayContrato = false

                this.getDB('contratos', () => {
                    this.crearDatosTabla()
                })
            })
        } else {
            //crear
            const idd = this.generarID('contratos')

            contrato.id = idd
            this.crearDatoDB('contratos', contrato, ()=>{
                this.displayContrato = false

                this.getDB('contratos', () => {
                    this.crearDatosTabla()
                })
            })
        }
    }

    setearFechaHasta(){
        var fecha = new Date(this.contratoMostrar.fecha_desde)
        fecha.setDate(fecha.getDate() + 30)

        this.contratoMostrar.fecha_hasta = fecha
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

    exportToExcel() {
        /* Crear un libro de trabajo */
        const workbook = XLSX.utils.book_new();
      
        /* Crear una hoja de cálculo */
        const worksheet = XLSX.utils.json_to_sheet(this.dataParaMostrarTabla);
      
        /* Agregar la hoja de cálculo al libro de trabajo */
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Contratos');
      
        /* Descargar el archivo */
        XLSX.writeFile(workbook, 'contratos.xlsx');
    }
}