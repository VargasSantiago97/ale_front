import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-produccion',
    templateUrl: './produccion.component.html',
    styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent {

    db_socios: any = []
    db_granos: any = []

    db_locales: any = {
        lotes: [],
        silos: [],
        produccion: []
    }

    load_est:any = true;
    load_soc:any = true;
    load_lote:any = true;
    load_mov:any = true;
    load_mov_orig: any = true;
    load_lote_silo: any = true;

    idGrano: any = ''
    tipo_grano: any = ''



    datosTabla:any = []
    datosTablaTotales:any = {}

    datosTablaSociedades:any = []
    datosTablaSociedadesTotales:any = {}

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
    colsSociedades: any = []
    graficoKilos: any = []
    graficoRinde: any = []

    constructor(
        private sqlite: SqliteService,
        private comunicacionService: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'produce', header: 'Produce'},
            { field: 'campo', header: 'Establecimiento'},
            { field: 'has', header: 'Has'},
            { field: 'kg_trilla', header: 'Kgs Trilla'},
            { field: 'kg_silo', header: 'Kgs a Silo'},
            { field: 'kg_total', header: 'TOTALES'},
            { field: 'kg_desde_silo', header: 'Kgs desde Silo'},
            { field: 'kg_en_silos', header: 'Kgs en Silos'},
            { field: 'rinde', header: 'Rinde'},
        ]
        this.colsSociedades = [
            { field: 'produce', header: 'Produce'},
            { field: 'has', header: 'Has'},
            { field: 'kg_trilla', header: 'Kgs Trilla'},
            { field: 'kg_silo', header: 'Kgs a Silo'},
            { field: 'kg_total', header: 'TOTALES'},
            { field: 'kg_desde_silo', header: 'Kgs desde Silo'},
            { field: 'kg_en_silos', header: 'Kgs en Silos'},
            { field: 'rinde', header: 'Rinde'},
        ]

        this.graficoKilos = {
            labels: [],
            datasets: [
                {
                    label: 'Kgs campo',
                    backgroundColor: '#42A5F5',
                    data: []
                }
            ]
        };
        this.graficoRinde = {
            labels: [],
            datasets: [
                {
                    label: 'Rinde',
                    backgroundColor: '#42A5F5',
                    data: []
                }
            ]
        };

        this.obtenerSociosDB()
        this.obtenerGranosDB()

        this.getDB('lotes', () => {
            this.load_lote = false
        })
        this.getDB('establecimientos', () => {
            this.load_est = false
        })
        this.getDB('movimientos', () => {
            this.load_mov = false
        })
        this.getDB('movimiento_origen', () => {
            this.load_mov_orig = false
        })
        this.getDB('lote_a_silo', () => {
            this.load_lote_silo = false
        })
        this.getDB('lotes', () => {
            this.load_lote_silo = false
        })
        this.getDB('silos', () => {
            this.load_lote_silo = false
        })
        this.getDB('produccion')
    }

    obtenerSociosDB() {
        this.comunicacionService.getDB('socios').subscribe(
            (res: any) => {
                this.db_socios = res
                this.load_soc = false
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
            },
            (err: any) => {
                console.log(err)
            }
        )
    }


    generarDatosTabla(){
        if(!(this.load_est || this.load_soc || this.load_lote || this.load_mov || this.load_mov_orig || this.load_lote_silo)){
            this.datosTabla = []

            this.tipo_grano = ' - ' + this.transformarDatoMostrarTabla(this.idGrano, 'granos')

            var has_totales = 0
            var kg_trilla_totales = 0
            var kg_silo_totales = 0
            var kg_total_totales = 0
            var kg_desde_silo_totales = 0
            var kg_en_silos_totales = 0
            
            this.db_locales.establecimientos.forEach((e:any) => {

                var has = 0
                var rinde = 0
                var kg_trilla = 0
                var kg_silo = 0
                var kg_desde_silo = 0
                var kg_total = 0
                var kg_en_silos = 0
                var produce:any = []

                //HAS
                var lotes = this.db_locales.lotes.filter((f:any) => { return f.id_establecimiento == e.id && f.id_grano == this.idGrano })
                lotes.forEach((f:any) => {
                    if(f.estado == 1){
                        const hasLote = f.has ? parseInt(f.has) : 0
                        has += hasLote
                    }
                })


                var lotesHabilitados:any = []
                var silosHabilitados:any = []

                this.db_locales.lotes.map( (f:any) => {
                    if(f.id_grano == this.idGrano && f.id_establecimiento == e.id){
                        lotesHabilitados.push(f.id)
                    }
                })

                this.db_locales.silos.map( (f:any) => {
                    if(f.id_grano == this.idGrano && f.id_establecimiento == e.id){
                        silosHabilitados.push(f.id)
                    }
                })

                //DESDE TRILLA
                var movimiento_origen = this.db_locales.movimiento_origen.filter((f:any) => { return (lotesHabilitados.includes(f.id_origen) )})
                movimiento_origen.forEach((f:any) => {
                    const kgMov = f.kilos ? parseInt(f.kilos) : 0
                    kg_trilla += kgMov
                })
                //DESDE SILOS
                var movimiento_origen = this.db_locales.movimiento_origen.filter((f:any) => { return (silosHabilitados.includes(f.id_origen) )})
                movimiento_origen.forEach((f:any) => {
                    const kgMov = f.kilos ? parseInt(f.kilos) : 0
                    kg_desde_silo += kgMov
                })

                //TRILLA A SILOS
                var lote_a_silo = this.db_locales.lote_a_silo.filter((f:any) => { return silosHabilitados.includes(f.id_silo) }) 
                lote_a_silo.forEach((f:any) => {
                    const kilos = f.kilos ? parseInt(f.kilos) : 0
                    kg_silo += kilos
                })
                
                //PRODUCE
                var producen = this.db_locales.produccion.filter((f:any) => { return f.id_establecimiento == e.id })
                producen.forEach((f:any) => {
                    produce.push(this.transformarDatoMostrarTabla(f.id_socio, 'socio'))
                })


                kg_en_silos = kg_silo - kg_desde_silo
                kg_total = kg_trilla + kg_silo

                if(has){
                    rinde = kg_total/has
                }

                //AGREGAR A LA LISTA
                if(has){
                    this.datosTabla.push({
                        id: e.id,
                        produce: produce.join(', '),
                        campo: e.alias,
                        has: this.transformarDatoMostrarTabla(has, "numero"),
                        rinde: this.transformarDatoMostrarTabla(rinde, "numero"),
                        kg_trilla: this.transformarDatoMostrarTabla(kg_trilla, "numero"),
                        kg_silo: this.transformarDatoMostrarTabla(kg_silo, "numero"),
                        kg_total: this.transformarDatoMostrarTabla(kg_total, "numero"),
                        kg_desde_silo: this.transformarDatoMostrarTabla(kg_desde_silo, "numero"),
                        kg_en_silos: this.transformarDatoMostrarTabla(kg_en_silos, "numero"),

                        num_has: has,
                        num_kg_trilla: kg_trilla,
                        num_kg_silo: kg_silo,
                        num_kg_total: kg_total,
                        num_kg_desde_silo: kg_desde_silo,
                        num_kg_en_silos: kg_en_silos,

                    })
    
                    this.graficoKilos.labels.push(e.alias)
                    this.graficoKilos.datasets[0].data.push(kg_total)
                    this.graficoRinde.labels.push(e.alias)
                    this.graficoRinde.datasets[0].data.push(rinde)


                    has_totales += has
                    kg_trilla_totales += kg_trilla
                    kg_silo_totales += kg_silo
                    kg_total_totales += kg_total
                    kg_desde_silo_totales += kg_desde_silo
                    kg_en_silos_totales += kg_en_silos
                }
            })

            var rinde_totales = 0
            if(has_totales){
                rinde_totales = kg_total_totales/has_totales
            }

            this.datosTablaTotales = {
                has: this.transformarDatoMostrarTabla(has_totales, "numero"),
                rinde: this.transformarDatoMostrarTabla(rinde_totales, "numero"),
                kg_trilla: this.transformarDatoMostrarTabla(kg_trilla_totales, "numero"),
                kg_silo: this.transformarDatoMostrarTabla(kg_silo_totales, "numero"),
                kg_total: this.transformarDatoMostrarTabla(kg_total_totales, "numero"),
                kg_desde_silo: this.transformarDatoMostrarTabla(kg_desde_silo_totales, "numero"),
                kg_en_silos: this.transformarDatoMostrarTabla(kg_en_silos_totales, "numero")
            }

            //DATOS TABLA POR SOCIEDADES
            var sociedades:any = [];
            this.datosTablaSociedades = []

            const dividedArrays = this.datosTabla.reduce((result:any, item:any) => {
                const id = item.produce;
                if (!result[id]) {
                  result[id] = [];
                }
                if (!sociedades.includes(id)) {
                    sociedades.push(id);
                }
                result[id].push(item);
                return result;
            }, {});
            
            sociedades.forEach((soc:any) => {
                var elementos = dividedArrays[soc]

                var has = elementos.reduce((result:any, item:any) => { return result + item.num_has }, 0)
                var kg_trilla = elementos.reduce((result:any, item:any) => { return result + item.num_kg_trilla }, 0)
                var kg_silo = elementos.reduce((result:any, item:any) => { return result + item.num_kg_silo }, 0)
                var kg_total = elementos.reduce((result:any, item:any) => { return result + item.num_kg_total }, 0)
                var kg_desde_silo = elementos.reduce((result:any, item:any) => { return result + item.num_kg_desde_silo }, 0)
                var kg_en_silos = elementos.reduce((result:any, item:any) => { return result + item.num_kg_en_silos }, 0)
                
                var rinde = 0
                if(has){
                    rinde = kg_total/has
                }

                this.datosTablaSociedades.push({
                    produce: soc,
                    has: this.transformarDatoMostrarTabla(has, "numero"),
                    rinde: this.transformarDatoMostrarTabla(rinde, "numero"),
                    kg_trilla: this.transformarDatoMostrarTabla(kg_trilla, "numero"),
                    kg_silo: this.transformarDatoMostrarTabla(kg_silo, "numero"),
                    kg_total: this.transformarDatoMostrarTabla(kg_total, "numero"),
                    kg_desde_silo: this.transformarDatoMostrarTabla(kg_desde_silo, "numero"),
                    kg_en_silos: this.transformarDatoMostrarTabla(kg_en_silos, "numero"),
                })
            });


            /*this.datosTablaSociedades.push({
                id: e.id,
                produce: produce.join(', '),
                campo: e.alias,
                has: this.transformarDatoMostrarTabla(has, "numero"),
                rinde: this.transformarDatoMostrarTabla(rinde, "numero"),
                kg_trilla: this.transformarDatoMostrarTabla(kg_trilla, "numero"),
                kg_silo: this.transformarDatoMostrarTabla(kg_silo, "numero"),
                kg_total: this.transformarDatoMostrarTabla(kg_total, "numero"),
                kg_desde_silo: this.transformarDatoMostrarTabla(kg_desde_silo, "numero"),
                kg_en_silos: this.transformarDatoMostrarTabla(kg_en_silos, "numero")
            }) */
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
        if (tipo == 'granos') {
            return this.db_granos.some((e: any) => { return e.id == dato }) ? this.db_granos.find((e: any) => { return e.id == dato }).alias : dato
        }

        if (tipo == 'has') {
            const has = parseFloat(this.totalHasLotes) * parseFloat(dato) / 100
            return has.toLocaleString('es-AR');
        }


        return dato
    }
}