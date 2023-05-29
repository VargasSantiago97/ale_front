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

    ///
    movimientosTotales: any = null
    movimientosKilosBalanza: any = 0
    movimientosKilosCampo: any = 0

    movimientosTotalesLocales: any = 0

    ok_origen: any = 0
    ok_balanza: any = 0
    ok_acondicionadora: any = 0
    ok_descarga: any = 0
    ok_contratos: any = 0

    cpeTotales: any = 0
    cpeConfirmadas: any = 0
    cpeAnuladas: any = 0
    cpeActivas: any = 0
    cpeRechhazadas: any = 0

    establecimientos: any = 0
    establecimientosSocio: any = 0

    colsProd:any = []

    cols:any = []
    datosMovimientos: any = []


    datosTabla: any = []
    datosTablaProduccion: any = []

    ok_movimientos: any = false
    ok_movimientos_local: any = false
    ok_cpe: any = false
    ok_socios: any = false
    ok_establecimientos: any = false
    ok_establecimientoProduccion: any = false


    constructor(
        private comunicacionService: ComunicacionService,
        private sqlite: SqliteService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: 'socio', header: 'SOCIO'},
            { field: 'produccion', header: 'CORRESPONDE'},
        ]

        this.colsProd = [
            { field: 'establecimiento', header: 'ESTABLECIMIENTO'},
            { field: 'kilos', header: 'TOTAL KGS'}
        ]

        this.getAll('movimientos', () => {
            this.ok_movimientos = true
            this.analizarMovimientosTotales()
            this.armarDatosMovimientos()
        })
        this.getAll('carta_porte', () => {
            this.ok_cpe = true
            this.analizarCPE()
            this.armarDatosMovimientos()
        })
        this.getAll('socios', () => {
            this.db['socios'].forEach((e:any) => { this.colsProd.push({ field: e.alias, header: e.alias}) })

            this.ok_socios = true
            this.armarDatosMovimientos()
        })

        this.getAllLocal('movimientos', () => {
            this.ok_movimientos_local = true
            this.analizarMovimientosTotalesLocales()
            this.armarDatosMovimientos()
        })
        this.getAllLocal('produccion', () => {
            this.ok_establecimientoProduccion = true
            this.analizarEstablecimientos()
            this.armarDatosMovimientos()
        })
        this.getAll('establecimientos', () => {
            this.ok_establecimientos = true
            this.analizarEstablecimientos()
            this.armarDatosMovimientos()
        })
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

    //DATOS GENERALES
    analizarMovimientosTotales(){
        this.movimientosTotales = this.db['movimientos'].length

        this.db['movimientos'].forEach((mov:any) => {
            if(mov.kg_neto_final){
                this.movimientosKilosBalanza ++;
            }
            if(mov.kg_campo){
                this.movimientosKilosCampo ++;
            }
        });
    }
    analizarMovimientosTotalesLocales(){
        this.movimientosTotalesLocales = this.db_locales['movimientos'].length

        this.ok_origen = 0
        this.ok_balanza = 0
        this.ok_acondicionadora = 0
        this.ok_descarga = 0
        this.ok_contratos = 0

        this.db_locales['movimientos'].forEach((mov:any) => {
            if(mov.ok_origen == 1){
                this.ok_origen ++;
            }
            if(mov.ok_balanza == 1){
                this.ok_balanza ++;
            }
            if(mov.ok_acondicionadora == 1){
                this.ok_acondicionadora ++;
            }
            if(mov.ok_descarga == 1){
                this.ok_descarga ++;
            }
            if(mov.ok_contratos == 1){
                this.ok_contratos ++;
            }
        });
    }
    analizarCPE(){
        this.cpeTotales = this.db['carta_porte'].length

        this.cpeConfirmadas = 0
        this.cpeAnuladas = 0
        this.cpeActivas = 0
        this.cpeRechhazadas = 0

        this.db['carta_porte'].forEach((cpe:any) => {
            if(cpe.data){
                if(JSON.parse(cpe.data)){
                    if(JSON.parse(cpe.data).estado){
                        const estado = JSON.parse(cpe.data).estado

                        if(estado == 'CN'){
                            this.cpeConfirmadas ++;
                        }
                        if(estado == 'AN'){
                            this.cpeAnuladas ++;
                        }
                        if(estado == 'AC'){
                            this.cpeActivas ++;
                        }
                        if(estado == 'RE'){
                            this.cpeRechhazadas ++;
                        }
                    }
                }
            }
        });

    }
    analizarEstablecimientos(){
        if(this.ok_establecimientoProduccion && this.ok_establecimientos){
            this.establecimientos = this.db['establecimientos'].length

            this.establecimientosSocio = 0
    
            this.db['establecimientos'].forEach((est:any) => {
                if(this.db_locales['produccion'].some((e:any) => { return e.id_establecimiento == est.id})){
                    this.establecimientosSocio ++
                }
            });
        }
    }

    //DATOS MOVIMIENTOS

    armarDatosMovimientos(){

        if(this.ok_movimientos && this.ok_movimientos_local && this.ok_cpe && this.ok_socios && this.ok_establecimientos && this.ok_establecimientoProduccion){

            this.datosTablaProduccion = []
            this.db['establecimientos'].forEach((est:any) => {
                this.datosTablaProduccion.push({
                    establecimiento: est.alias
                })
            })




            this.datosMovimientos = []

            this.db['socios'].forEach((socio:any) => {
                this.datosMovimientos.push({
                    socio: socio
                })
            })
            this.armarDatosParaTabla()
        }
    }

    armarDatosParaTabla(){
        this.datosTabla = []

        this.datosMovimientos.forEach((mov:any) => {

            this.datosTabla.push({
                socio: mov['socio']['razon_social'], header: 'Socio'
            })

        })

        console.log(this.db['establecimientos'])
    }

}