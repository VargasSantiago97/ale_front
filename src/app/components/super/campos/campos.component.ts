import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-campos',
    templateUrl: './campos.component.html',
    styleUrls: ['./campos.component.css']
})
export class CamposComponent {

    db_campos_nube:any = []
    db_campos: any = []
    db_socios: any = []

    db_locales:any = {
        lotes: [],
        silos: [],
        produccion: []
    }

    campo_select: any;

    lotes:any = [];
    lote:any = [];
    totalHasLotes:any = 0;

    silos:any = [];
    silo:any = [];
    totalKilosSilos:any = 0;

    produccion:any = []
    produce:any = []
    socio_id: any = ''
    totalPorcentaje: any = []


    displayLote: any = false
    displaySilo: any = false
    displayProduce: any = false

    constructor(
        private sqlite: SqliteService,
        private comunicacionService: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.obtenerCamposDB()
        this.obtenerSociosDB()

        this.getDB('lotes')
    }

    //SINCRONIZAR LOS CAMPOS
    obtenerCamposDB(){
        this.comunicacionService.getDB('establecimientos').subscribe(
            (res:any) => {
                this.db_campos_nube = res
                this.obtenerEstablecimientosDB()
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerEstablecimientosDB(){
        this.sqlite.getDB('establecimientos').subscribe(
            (res:any) => {
                this.db_campos = res


                this.getDB('lotes', ()=>{
                    this.db_campos.forEach((e:any) => {
                        var suma = this.db_locales.lotes.reduce((acumulador:any, objeto:any) => {
                            const sumar = ((objeto.id_establecimiento == e.id) && objeto.estado == 1 ) ? objeto.has : 0
                            return acumulador + sumar;
                        }, 0);

                        e.has = suma
                    });
                })



                this.db_campos_nube.forEach((e:any) => {
                    if(!this.db_campos.some((f:any) => { return f.id == e.id })){
                        this.crearDatoDB('establecimientos', e)
                    }
                });
            },
            (err:any) => {
                console.log(err)
            }
        )
    }

    
    obtenerSociosDB(){
        this.comunicacionService.getDB('socios').subscribe(
            (res:any) => {
                this.db_socios = res
            },
            (err:any) => {
                console.log(err)
            }
        )
    }




    seleccionarCampo(campo:any){
        this.campo_select = campo
        this.acualizarDatosLotes()
        this.acualizarDatosSilos()
        this.actualizarDatosProduccion()
    }
    acualizarDatosLotes(){
        this.lotes = []
        this.totalHasLotes = 0

        this.getDB('lotes', ()=>{
            this.lotes = this.db_locales['lotes'].filter((e:any) => { return (e.id_establecimiento == this.campo_select.id) && (e.estado == 1)})
            this.lotes.forEach((e:any) => {
                if(e.activo == 'falso' || e.activo == 'false' || e.activo == '0' || e.activo == null ){
                    e.activo = false
                }
                this.totalHasLotes += parseInt(e.has)
            })
        })
    }
    acualizarDatosSilos(){
        this.silos = []
        this.totalKilosSilos = 0

        this.getDB('silos', ()=>{
            this.silos = this.db_locales['silos'].filter((e:any) => { return (e.id_establecimiento == this.campo_select.id) && (e.estado == 1)})

            this.getDB("lote_a_silo", () => {

                this.silos.forEach((e:any) => {
                    if(e.activo == 'falso' || e.activo == 'false' || e.activo == '0' || e.activo == null ){
                        e.activo = false
                    }
                    
                    var kilos:any = 0

                    const lote_a_silo = this.db_locales['lote_a_silo'].filter((lotSil:any) => { return lotSil.id_silo == e.id })

                    e.lote_a_silo = lote_a_silo

                    lote_a_silo.forEach((element:any) => {
                        kilos += parseInt(element.kilos)
                    })

                    e.kilos = parseInt(kilos)

                    this.totalKilosSilos += parseInt(e.kilos)
                })
            })
        })

        console.log(this.silos)
    }
    actualizarDatosProduccion(){
        this.produccion = []
        this.totalPorcentaje = 0

        this.getDB('produccion', ()=>{
            this.produccion = this.db_locales['produccion'].filter((e:any) => { return e.id_establecimiento == this.campo_select.id})
            this.produccion.forEach((e:any) => {
                this.totalPorcentaje += parseFloat(e.porcentaje)
            })
        })
    }

    abrirModalLote(lote:any = false){
        if(!this.campo_select){
            alert('seleccione un campo')
            return
        }
        if(lote){
            this.lote = lote
        } else {
            this.lote = {
                id: false, 
                id_establecimiento: this.campo_select.id,
                alias: '',
                has: 0,
                activo: 1,
                estado: 1
            }
        }

        this.displayLote = true
    }
    borrarLote(idd:any){
        if(confirm('Eliminar?')){
            this.borrarDB('lotes', idd, ()=>{
                this.displayLote = false
                this.acualizarDatosLotes()
            })
        }
    }
    guardarEditarLote(lote:any){
        if(lote.id){
            //edit
            this.editarDB('lotes', lote, ()=>{
                this.displayLote = false
                this.acualizarDatosLotes()
            })
        } else {
            //crear
            const idd = this.generarID('lotes')
            lote.id = idd
            if(lote.activo == 'falso' || lote.activo == 'false' || lote.activo == '0' || lote.activo == null ){
                lote.activo = 'false'
            }
            this.crearDatoDB('lotes', lote, ()=>{
                this.displayLote = false
                this.acualizarDatosLotes()
            })
        }
    }


    abrirModalSilo(silo:any = false){
        if(!this.campo_select){
            alert('seleccione un campo')
            return
        }
        if(silo){
            this.silo = silo
        } else {
            this.silo = {
                id: false, 
                id_establecimiento: this.campo_select.id,
                alias: '',
                kilos: 0,
                activo: 1,
                estado: 1,
                lote_a_silo : []
            }
        }

        this.getDB("lote_a_silo", () => {

            this.totalKilosSilos = 0
            const totales = this.db_locales['lote_a_silo'].filter((lotSil:any) => { return lotSil.id_establecimiento == this.campo_select.id })
            totales.forEach((e:any) => { this.totalKilosSilos += parseInt(e.kilos) })

            var kilos:any = 0

            const lote_a_silo = this.db_locales['lote_a_silo'].filter((lotSil:any) => { return lotSil.id_silo == this.silo.id })

            this.silo.lote_a_silo = lote_a_silo

            lote_a_silo.forEach((element:any) => {
                kilos += parseInt(element.kilos)
            })

            this.silo.kilos = parseInt(kilos)

        })


        this.displaySilo = true
    }
    borrarSilo(idd:any){
        if(confirm('Eliminar?')){
            this.borrarDB('silos', idd, ()=>{
                this.displaySilo = false
                this.acualizarDatosSilos()
            })
        }
    }
    guardarEditarSilo(silo:any){
        if(silo.id){
            //edit
            this.editarDB('silos', silo, ()=>{
                this.displaySilo = false
                this.acualizarDatosSilos()
            })
        } else {
            //crear
            const idd = this.generarID('silos')
            silo.id = idd
            if(silo.activo == 'falso' || silo.activo == 'false' || silo.activo == '0' || silo.activo == null ){
                silo.activo = 'false'
            }
            this.crearDatoDB('silos', silo, ()=>{
                this.displaySilo = false
                this.acualizarDatosSilos()
            })
        }
    }


    abrirModalProduce(produce:any = false){
        if(!this.campo_select){
            alert('seleccione un campo')
            return
        }

        if(produce){
            this.produce = produce
        } else {
            this.produce = {
                id: false, 
                id_establecimiento: this.campo_select.id,
                id_socio: null,
                porcentaje: 0,
            }
        }

        this.displayProduce = true
    }
    borrarProduce(idd:any){
        if(confirm('Eliminar?')){
            this.borrarDB('produccion', idd, ()=>{
                this.displayProduce = false
                this.actualizarDatosProduccion()
            })
        }
    }
    guardarEditarProduce(produce:any){
        if(produce.id){
            console.log(produce)
            //edit
            this.editarDB('produccion', produce, ()=>{
                this.displayProduce = false
                this.actualizarDatosProduccion()
            })
        } else {
            //crear
            const idd = this.generarID('produccion')
            produce.id = idd
            this.crearDatoDB('produccion', produce, ()=>{
                this.displayProduce = false
                this.actualizarDatosProduccion()
            })
        }
    }

    agregarLoteSilo(){
        this.silo.lote_a_silo.push({
            id: false,
            id_lote: null,
            id_silo: this.silo.id,
            id_establecimiento: this.campo_select.id,
            kilos: null
        })
    }
    borrarLoteSilo(idd:any){
        if(confirm('Desea eliminar?')){
            this.borrarDB('lote_a_silo', idd, ()=>{
                this.abrirModalSilo(this.silo)
            })
        }
    }
    guardarLoteSilo(loteSilo:any){
        var idd = this.generarID('lote_a_silo')
        loteSilo.id = idd
        this.crearDatoDB('lote_a_silo', loteSilo, ()=>{
            this.abrirModalSilo(this.silo)
        })

    }


    getDB(tabla:any, func:any = false){
        this.sqlite.getDB(tabla).subscribe(
            (res:any) => {
                if(res){
                    this.db_locales[tabla] = res
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta' })
                }

                if(func){
                    func()
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
            return dato.toLocaleString('es-AR');
        }
        if(tipo=='socio'){
            return this.db_socios.some((e:any) => { return e.id == dato }) ? this.db_socios.find((e:any) => { return e.id == dato }).alias : dato
        }

        if(tipo=='has'){
            const has = parseFloat(this.totalHasLotes) * parseFloat(dato) / 100
            return has.toLocaleString('es-AR');
        }


        return dato
    }
}