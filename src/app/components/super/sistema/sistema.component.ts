import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-sistema',
    templateUrl: './sistema.component.html',
    styleUrls: ['./sistema.component.css']
})
export class SistemaComponent {

    db: any = {}
    db_locales: any = {}


    varr: any = 0
    colsProd: any = []

    datoTabla: any = []

    colsCorr: any = []
    datoTablaCorredores: any = []

    colsDep:any = []
    datoTablaDeposito:any = []

    variador: any = 0;
    background: any = 'green'

    temperatura: any = 0;
    humedad: any = 0;

    options:any;

    constructor(
        private comunicacionService: ComunicacionService,
        private sqlite: SqliteService,
        private messageService: MessageService
    ) {}

    ngOnInit() {

        this.colsProd = [
            {field: 'id', header: 'Id'},
            {field: 'socio_movimiento_id', header: 'Id Soc. Mov.'},
            {field: 'socio_movimiento', header: 'Soc. Mov.'},
            {field: 'socio_cpe_cuit', header: 'Soc. Cpe. CUIT'},
            {field: 'socio_cpe', header: 'Soc. Cpe.'},
            {field: 'estado', header: 'Est. Cpe.'},
        ];
        this.colsCorr = [
            {field: 'id', header: 'Id'},
            {field: 'ctg', header: 'CTG'},
            {field: 'corredor_movimiento_id', header: 'Id Corr. Mov.'},
            {field: 'corredor_movimiento', header: 'Corr. Mov.'},
            {field: 'corredor_cpe_cuit', header: 'Corr. Cpe. CUIT'},
            {field: 'corredor_cpe', header: 'Corr. Cpe.'},
            {field: 'corredor_cpe_cuit_sec', header: 'Corr. Cpe. CUIT (sec)'},
            {field: 'corredor_cpe_sec', header: 'Corr. Cpe. (sec)'},
            {field: 'estado', header: 'Est. Cpe.'},
        ];
        this.colsDep = [
            {field: 'id', header: 'Id'},
            {field: 'deposito', header: 'Deposito Mov.'},
            {field: 'creado_por', header: 'Creado'},
            {field: 'editado_por', header: 'Editado'},
            {field: 'kilos', header: 'Kgs'},
            {field: 'obs', header: 'Obs.'},
            {field: 'orden', header: 'Nro Orden'},
        ];

        this.getAll('socios')
        this.getAll('intervinientes')
        this.getAll('depositos')

    }

    getAll(tabla:any, func:any=null){
        this.comunicacionService.getDB(tabla).subscribe(
            (res:any) => {
                if(res){
                    this.db[tabla] = res
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta (Comunic)' })
                }
                if(func){
                    func()
                }
            }, 
            (err:any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND (Comunic)' })
            }
        )
    }
    getAllLocal(tabla:any, func:any = false){
        this.sqlite.getDB(tabla).subscribe(
            (res:any) => {
                if(res){
                    this.db_locales[tabla] = res
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, sin respuesta (Local)' })
                }
                if(func){
                    func()
                }
            },
            (err:any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error conectando a BACKEND (Local)' })
            }
        )
    }


    //MOVIMIENTOS - SOCIOS
    obtenerMovimientos(){
        this.datoTabla = []
        this.getAll('movimientos', ()=>{
            this.db['movimientos'].forEach((mov:any) => {
                this.datoTabla.push({
                    id: mov.id, 
                    socio_movimiento_id: mov.id_socio, 
                    socio_movimiento: this.transf(mov.id_socio, 'socio'), 
                    socio_cpe: '',
                    diferencia: false
                })
            });
        })
    }
    obtenerSociosCPE(){
        this.getAll('carta_porte', ()=>{
            this.db['carta_porte'].forEach((cpe:any) => {
                if(cpe.data){
                    if(JSON.parse(cpe.data)){
                        if((JSON.parse(cpe.data).estado == 'CN') || (JSON.parse(cpe.data).estado == 'AC') || (JSON.parse(cpe.data).estado == 'CF') ){

                            var dato = this.datoTabla.find((e:any) => { return e.id == cpe.id_movimiento})

                            if(dato){
                                dato.socio_cpe_cuit = cpe.cuit_solicitante
                                dato.estado = JSON.parse(cpe.data).estado
                                dato.socio_cpe = this.transf(cpe.cuit_solicitante, 'socioCuit')
                                dato.socio_cpe_id = this.transf(cpe.cuit_solicitante, 'socioCuitId')

                                dato.diferencia = !(dato.socio_cpe_id == dato.socio_movimiento_id)
                            }
                        }
                    }
                }
            })
        })
    }
    modificar(idd:any){
        var dato = this.datoTabla.find((e:any) => { return e.id == idd})

        var datoMovimiento = this.db['movimientos'].find((mov:any) => { return mov.id == idd })
        datoMovimiento.id_socio = dato.socio_cpe_id

        this.editarMovimiento(datoMovimiento, ()=>{
            dato.socio_movimiento_id = dato.socio_cpe_id
            dato.socio_movimiento = dato.socio_cpe
            dato.diferencia = false
        })
    }



    //MOVIMIENTOS - CORREDORES
    obtenerMovimientosCorredor(){
        this.datoTablaCorredores = []
        this.getAll('movimientos', ()=>{
            this.db['movimientos'].forEach((mov:any) => {
                this.datoTablaCorredores.push({
                    id: mov.id, 
                    corredor_movimiento_id: mov.id_corredor, 
                    corredor_movimiento: this.transf(mov.id_corredor, 'interviniente'), 
                    diferencia: false
                })
            });
        })
    }
    obtenerCorredorCPE(){
        this.getAll('carta_porte', ()=>{
            this.db['carta_porte'].forEach((cpe:any) => {
                if(cpe.data){
                    if(JSON.parse(cpe.data)){
                        if((JSON.parse(cpe.data).estado == 'CN') || (JSON.parse(cpe.data).estado == 'AC') || (JSON.parse(cpe.data).estado == 'CF') ){

                            var dato = this.datoTablaCorredores.find((e:any) => { return e.id == cpe.id_movimiento})

                            if(dato){
                                dato.ctg = cpe.nro_ctg
                                dato.corredor_cpe_cuit = cpe.cuit_corredor_venta_primaria
                                dato.estado = JSON.parse(cpe.data).estado
                                dato.corredor_cpe = this.transf(cpe.cuit_corredor_venta_primaria, 'intervinienteCuit')
                                dato.corredor_cpe_id = this.transf(cpe.cuit_corredor_venta_primaria, 'intervinienteCuitId')

                                dato.corredor_cpe_cuit_sec = cpe.cuit_corredor_venta_secundaria
                                dato.corredor_cpe_sec = this.transf(cpe.cuit_corredor_venta_secundaria, 'intervinienteCuit')
                                dato.corredor_cpe_id_sec = this.transf(cpe.cuit_corredor_venta_secundaria, 'intervinienteCuitId')


                                dato.diferencia = !(dato.corredor_cpe_id == dato.corredor_movimiento_id || dato.corredor_cpe_id_sec == dato.corredor_movimiento_id)
                            }
                        }
                    }
                }
            })
        })
    }
    modificarCorredor(idd:any){
        var dato = this.datoTablaCorredores.find((e:any) => { return e.id == idd})

        var datoMovimiento = this.db['movimientos'].find((mov:any) => { return mov.id == idd })
        datoMovimiento.id_corredor = dato.corredor_cpe_id

        this.editarMovimiento(datoMovimiento, ()=>{
            dato.corredor_movimiento_id = dato.corredor_cpe_id
            dato.corredor_movimiento = dato.corredor_cpe
            dato.diferencia = false
        })
    }



    //MOVIMIENTOS - DEPOSITOS
    obtenerMovimientosDepositos(){
        this.datoTablaDeposito = []

        this.getAll('orden_carga', () => {

            this.getAll('movimientos', ()=>{
                this.db['movimientos'].forEach((mov:any) => {

                    var nro_orden = ''

                    if(this.db['orden_carga'].some((g:any) => { return g.id_movimiento == mov.id })){
                        var orden_ca = this.db['orden_carga'].find((g:any) => { return g.id_movimiento == mov.id })

                        nro_orden = orden_ca.numero 
                    }

                    this.datoTablaDeposito.push({
                        id: mov.id,
                        deposito: mov.id_deposito,
                        creado_por: mov.creado_por,
                        editado_por: mov.editado_por,
                        kilos: mov.kg_regulacion,
                        obs: mov.observaciones,
                        orden: nro_orden,
                        diferencia: false
                    })
                });
            })

        })
    }
    modificarDeposito(idd:any){
        var dato = this.datoTablaDeposito.find((e:any) => { return e.id == idd})

        var datoMovimiento = this.db['movimientos'].find((mov:any) => { return mov.id == idd })
        datoMovimiento.id_deposito = dato.deposito

        this.editarMovimiento(datoMovimiento, ()=>{})
    }
    borrarDeposito(idd:any){

        var datoMovimiento = this.db['movimientos'].find((mov:any) => { return mov.id == idd })
        datoMovimiento.id_deposito = ''

        this.editarMovimiento(datoMovimiento, ()=>{})
    }












    transf(dato:any, tipo:any){
        if(tipo=='socio'){
            return this.db['socios'].some((e:any) => { return e.id == dato }) ? this.db['socios'].find((e:any) => { return e.id == dato }).alias : dato
        }
        if(tipo=='socioCuit'){
            return this.db['socios'].some((e:any) => { return e.cuit == dato }) ? this.db['socios'].find((e:any) => { return e.cuit == dato }).alias : dato
        }
        if(tipo=='socioCuitId'){
            return this.db['socios'].some((e:any) => { return e.cuit == dato }) ? this.db['socios'].find((e:any) => { return e.cuit == dato }).id : dato
        }
        
        if(tipo=='interviniente'){
            return this.db['intervinientes'].some((e:any) => { return e.id == dato }) ? this.db['intervinientes'].find((e:any) => { return e.id == dato }).alias : dato
        }
        if(tipo=='intervinienteCuit'){
            return this.db['intervinientes'].some((e:any) => { return e.cuit == dato }) ? this.db['intervinientes'].find((e:any) => { return e.cuit == dato }).alias : dato
        }
        if(tipo=='intervinienteCuitId'){
            return this.db['intervinientes'].some((e:any) => { return e.cuit == dato }) ? this.db['intervinientes'].find((e:any) => { return e.cuit == dato }).id : dato
        }
        return dato
    }

    editarMovimiento(datosMovimiento:any, fnn:any) {
        this.comunicacionService.updateDB("movimientos", datosMovimiento).subscribe(
            (res: any) => {
                res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Editado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                
                if(res.mensaje){
                    fnn()
                }
            },
            (err: any) => {
                console.log(err)
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
            }
        )
    }

    testEstado(varr:any = false){

        if(this.variador < 20){
            this.comunicacionService.getStatusTest().subscribe(
                (res:any) => {
                    console.log(res)

                    this.temperatura = parseFloat(res.temperature).toFixed(1)
                    this.humedad = res.humidity

                    this.background = res.estado ? 'green' : 'red'


                    setTimeout(() => { this.testEstado() }, 1000)
                },
                (err:any) => {
                    console.error(err)
                }
            )
        }
    }

}