import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-produccion-silos',
    templateUrl: './produccion-silos.component.html',
    styleUrls: ['./produccion-silos.component.css']
})
export class ProduccionSilosComponent {

    db_socios: any = []

    db_locales: any = {
        lotes: [],
        silos: [],
        produccion: []
    }

    load_est: any = true;
    load_soc: any = true;
    load_silo: any = true;
    load_mov: any = true;
    load_mov_orig: any = true;
    load_lote_silo: any = true;


    datosTabla: any = []
    datosGenerales: any = []

    campo_select: any;

    lotes: any = [];
    lote: any = [];
    totalHasLotes: any = 0;

    silos: any = [];
    silo: any = [];
    totalKilosSilos: any = 0;

    produccion: any = []
    produce: any = []
    socio_id: any = ''
    totalPorcentaje: any = []

    cols: any = []
    colsCampos: any = []

    datosEstablecimiento: any = []
    datosTotales:any = {}

    constructor(
        private sqlite: SqliteService,
        private comunicacionService: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'silo', header: 'Silo' },
            { field: 'kg_carga', header: 'Kgs ENTRADA' },
            { field: 'kg_descarga', header: 'Kgs SALIDA' },
            { field: 'kg_pendiente', header: 'Kgs EN SILO' },
        ]
        this.colsCampos = [
            { field: 'establecimiento', header: 'Establecimiento' },
            { field: 'kg_carga', header: 'Kgs ENTRADA' },
            { field: 'kg_descarga', header: 'Kgs SALIDA' },
            { field: 'kg_pendiente', header: 'Kgs EN SILO' },
        ]

        this.obtenerSociosDB()

        this.getDB('silos', () => {
            this.load_silo = false
            this.generarDatosTabla()
        })
        this.getDB('establecimientos', () => {
            this.load_est = false
            this.generarDatosTabla()
        })
        this.getDB('movimientos', () => {
            this.load_mov = false
            this.generarDatosTabla()
        })
        this.getDB('movimiento_origen', () => {
            this.load_mov_orig = false
            this.generarDatosTabla()
        })
        this.getDB('lote_a_silo', () => {
            this.load_lote_silo = false
            this.generarDatosTabla()
        })
    }

    obtenerSociosDB() {
        this.comunicacionService.getDB('socios').subscribe(
            (res: any) => {
                this.db_socios = res
                this.load_soc = false
                this.generarDatosTabla()
            },
            (err: any) => {
                console.log(err)
            }
        )
    }


    generarDatosTabla() {
        if (!(this.load_est || this.load_soc || this.load_silo || this.load_mov || this.load_mov_orig || this.load_lote_silo)) {

            this.datosGenerales = []
            this.datosEstablecimiento = []

            this.db_locales.establecimientos.forEach((establecimiento: any) => {

                var dataAgregando: any = {
                    establecimiento: establecimiento.alias,
                    establecimiento_id: establecimiento.id,
                    silos: [],
                    totales: {},
                }

                //totales
                var kg_carga = 0
                var kg_descarga = 0
                var kg_pendiente = 0

                var silos = this.db_locales.silos.filter((f: any) => { return f.id_establecimiento == establecimiento.id })
                silos.forEach((silo: any) => {

                    var kg_cargaSilo = 0
                    var kg_descargaSilo = 0
                    
                    //SILOS CARGA
                    var lote_a_silo = this.db_locales.lote_a_silo.filter((f: any) => { return f.id_silo == silo.id })
                    lote_a_silo.forEach((f: any) => {
                        const kilos = f.kilos ? parseInt(f.kilos) : 0
                        kg_cargaSilo += kilos
                    })

                    //SILOS DESCARGA
                    var mov_desde_silo = this.db_locales.movimiento_origen.filter((f: any) => { return f.id_origen == silo.id })
                    mov_desde_silo.forEach((f: any) => {
                        const kilos = f.kilos ? parseInt(f.kilos) : 0
                        kg_descargaSilo += kilos
                    })


                    var kg_pendienteSilo = kg_cargaSilo - kg_descargaSilo

                    dataAgregando.silos.push({
                        silo: silo.alias,
                        kg_carga: this.transformarDatoMostrarTabla(kg_cargaSilo, 'numero'),
                        kg_descarga: this.transformarDatoMostrarTabla(kg_descargaSilo, 'numero'),
                        kg_pendiente: this.transformarDatoMostrarTabla(kg_pendienteSilo, 'numero'),
                    })

                    kg_carga += kg_cargaSilo
                    kg_descarga += kg_descargaSilo
                    kg_pendiente += kg_pendienteSilo
                    
                })

                dataAgregando.totales = {
                    silo: 'TOTALES',
                    kg_carga: this.transformarDatoMostrarTabla(kg_carga, 'numero'),
                    kg_descarga: this.transformarDatoMostrarTabla(kg_descarga, 'numero'),
                    kg_pendiente: this.transformarDatoMostrarTabla(kg_pendiente, 'numero'),
                }

                this.datosGenerales.push(dataAgregando)
                this.datosEstablecimiento.push({
                    establecimiento: establecimiento.alias,
                    kg_carga: this.transformarDatoMostrarTabla(kg_carga, 'numero'),
                    kg_descarga: this.transformarDatoMostrarTabla(kg_descarga, 'numero'),
                    kg_pendiente: this.transformarDatoMostrarTabla(kg_pendiente, 'numero')
                })
            })
        }
    }


    seleccionarCampo(campo: any) {
        this.campo_select = campo
        this.acualizarDatosLotes()
        this.acualizarDatosSilos()
        this.actualizarDatosProduccion()
    }
    acualizarDatosLotes() {
        this.lotes = []
        this.totalHasLotes = 0

        this.getDB('lotes', () => {
            this.lotes = this.db_locales['lotes'].filter((e: any) => { return (e.id_establecimiento == this.campo_select.id) && (e.estado == 1) })
            this.lotes.forEach((e: any) => {
                if (e.activo == 'falso' || e.activo == 'false' || e.activo == '0' || e.activo == null) {
                    e.activo = false
                }
                this.totalHasLotes += parseInt(e.has)
            })
        })
    }
    acualizarDatosSilos() {
        this.silos = []
        this.totalKilosSilos = 0

        this.getDB('silos', () => {
            this.silos = this.db_locales['silos'].filter((e: any) => { return (e.id_establecimiento == this.campo_select.id) && (e.estado == 1) })
            this.silos.forEach((e: any) => {
                if (e.activo == 'falso' || e.activo == 'false' || e.activo == '0' || e.activo == null) {
                    e.activo = false
                }
                this.totalKilosSilos += parseInt(e.kilos)
            })
        })
    }
    actualizarDatosProduccion() {
        this.produccion = []
        this.totalPorcentaje = 0

        this.getDB('produccion', () => {
            this.produccion = this.db_locales['produccion'].filter((e: any) => { return e.id_establecimiento == this.campo_select.id })
            this.produccion.forEach((e: any) => {
                this.totalPorcentaje += parseFloat(e.porcentaje)
            })
        })
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

        if (tipo == 'has') {
            const has = parseFloat(this.totalHasLotes) * parseFloat(dato) / 100
            return has.toLocaleString('es-AR');
        }


        return dato
    }
}