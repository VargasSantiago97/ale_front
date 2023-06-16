import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { ImportarService } from 'src/app/services/importar/importar.service';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

declare var vars: any;

@Component({
    selector: 'app-importaciones',
    templateUrl: './importaciones.component.html',
    styleUrls: ['./importaciones.component.css']
})
export class ImportacionesComponent {

    API_URI = vars.API_URI_IMPORTAR

    colsDescargaMermaNeto: any = []
    datoTablaDescargaMermaNeto: any = []
    
    colsContratos: any = []
    datoTablaContratos: any = []

    db_locales: any = []
    db: any = []


    constructor(
        private importaciones: ImportarService,
        private sqlite: SqliteService,
        private cs: ComunicacionService,
        private messageService: MessageService
    ){}

    ngOnInit() {
        this.colsDescargaMermaNeto = [
            {field:'nro_ctg', header:'CTG'},
            {field:'descarga', header:'DESCARGA'},
            {field:'merma', header:'MERMAS'},
            {field:'neto', header:'NETO FINAL'},
            {field:'coincide', header:'COINCIDE'},
            {field:'cp_sistema', header:'CPE en Sistema'},
            {field:'id_movimiento', header:'MOV ID'},
            {field:'cp_mov', header:'MOV Local con CPE'},
            {field:'loc_salida', header:'LOC: Kg salida'},
            {field:'loc_destino', header:'LOC: Kg Dest'},
            {field:'loc_mermas', header:'LOC: Kg Merm'},
            {field:'loc_neto', header:'LOC: Kg Neto'},
            {field:'loc_diferencia', header:'Dest-Salida'},
        ]
        
        this.colsContratos = [
            {field:'nro_ctg', header:'CTG'},
            {field:'kilos', header:'KILOS'},
            {field:'contrato', header:'CONTRATO'},
            {field:'neto', header:'NETO FINAL'},
            {field:'coincide', header:'COINCIDE'},
            {field:'cp_sistema', header:'CPE en Sistema'},
            {field:'id_movimiento', header:'MOV ID'},
            {field:'cp_mov', header:'MOV Local con CPE'},
            {field:'loc_salida', header:'LOC: Kg salida'},
            {field:'loc_destino', header:'LOC: Kg Dest'},
            {field:'loc_mermas', header:'LOC: Kg Merm'},
            {field:'loc_neto', header:'LOC: Kg Neto'},
            {field:'loc_diferencia', header:'Dest-Salida'},
        ]

        this.getLocalDB('movimiento_contrato')
    }

    onUpload(event: any) {
        alert('Cargado')
    }

    datosExcelDescargaMermaNeto(){
        this.importaciones.getExcel().subscribe(
            (res:any) => {
                console.log(res)

                this.datoTablaDescargaMermaNeto = []

                res.forEach((element:any) => {
                    var descarga = parseInt(element["COL2"])
                    var merma = parseInt(element["COL3"])
                    var neto = parseInt(element["COL4"])

                    var coincide = (descarga-merma == neto)

                    this.datoTablaDescargaMermaNeto.push({
                        nro_ctg: element["COL1"],
                        descarga: descarga,
                        merma: merma,
                        neto: neto,
                        coincide: coincide ? 'OK' : '',
                        pintar: '',
                    })
                });
            },
            (err:any) => {
                console.error(err)
            }
        )
    }
    buscarCPES(){
        this.getDB('carta_porte', () => {
            this.datoTablaDescargaMermaNeto.forEach((registro:any) => {
                const carta_porte = this.db['carta_porte'].filter((e:any) => { return e.nro_ctg == registro.nro_ctg })
                if(carta_porte.length == 1){
                    registro.pintar = 'verde'
                    registro.cp_sistema = 'OK'
                    registro.id_movimiento = carta_porte[0].id_movimiento
                }
                if(carta_porte.length > 1){

                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'CTG ' + carta_porte[0].nro_ctg + ' REPETIDO!' })
                    registro.pintar = 'rojo'
                    registro.cp_sistema = 'REPETIDO'
                }
            });
        })

        console.log(this.datoTablaDescargaMermaNeto)
    }
    buscarMovimientos(){
        this.getLocalDB('movimientos', () => {
            this.datoTablaDescargaMermaNeto.filter((e:any) => { return e.id_movimiento }).forEach((registro:any) => {
                const movimiento = this.db_locales['movimientos'].find((e:any) => { return e.id_movimiento == registro.id_movimiento })

                registro.pintar = ''

                if(movimiento){
                    registro.pintar = 'verde'
                    registro.cp_mov = 'OK'

                    if((registro.descarga == movimiento.kg_descarga) && (registro.merma == movimiento.kg_mermas) && (registro.neto == movimiento.kg_final)){
                        registro.pintar = 'amarillo'
                    }



                    registro.loc_salida = movimiento.kg_salida
                    registro.loc_destino = movimiento.kg_descarga
                    registro.loc_mermas = movimiento.kg_mermas
                    registro.loc_neto = movimiento.kg_final
                    registro.loc_diferencia = parseInt(registro.descarga) - parseInt(movimiento.kg_salida)
                }
            });
        })
    }

    guardarDescargaMermaNeto(reg:any){
        var movLocal = this.db_locales['movimientos'].find((e:any) => { return e.id_movimiento == reg.id_movimiento });

        movLocal.ok_descarga = 1;
    
        movLocal.kg_descarga = reg.descarga;
        movLocal.kg_mermas = reg.merma;
        movLocal.kg_final = reg.neto;

        this.editarDB('movimientos', movLocal)
    }




    datosExcelContratos(){
        this.importaciones.getExcel().subscribe(
            (res:any) => {

                var ctgs:any = []
                res.forEach((element:any) => {
                    ctgs.includes(element["COL1"]) ? null : ctgs.push(element["COL1"])
                });


                this.datoTablaContratos = []
                ctgs.forEach((ctg:any) => {
                    var dato = {
                        nro_ctg: ctg,
                        contratos: [ ... res.filter((e:any) => { return e["COL1"] == ctg })]
                    }

                    this.datoTablaContratos.push(dato)

                });

                console.log(this.datoTablaContratos)

            },
            (err:any) => {
                console.error(err)
            }
        )
    }
    buscarCPESContratos(){
        this.getDB('carta_porte', () => {
            this.datoTablaContratos.forEach((registro:any) => {
                const carta_porte = this.db['carta_porte'].filter((e:any) => { return e.nro_ctg == registro.nro_ctg })
                if(carta_porte.length == 1){
                    registro.pintar = 'verde'
                    registro.cp_sistema = 'OK'
                    registro.id_movimiento = carta_porte[0].id_movimiento
                }
                if(carta_porte.length > 1){
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'CTG ' + carta_porte[0].nro_ctg + ' REPETIDO!' })
                    registro.pintar = 'rojo'
                    registro.cp_sistema = 'REPETIDO'
                }
            });
        })

    }
    buscarMovimientosLocalesCpe(){
        this.getLocalDB('movimientos', () => {
            this.datoTablaContratos.forEach((registro:any) => {

                var kilos = 0

                this.db_locales['movimiento_contrato'].filter((e:any) => { return e.id_movimiento == registro.id_movimiento }).forEach((cto:any) => {
                    kilos += parseInt(cto.kilos)
                });

                registro.pintar = 'amarillo'

                if(registro.kilos){
                    registro.pintar = ''
                }
                if(registro.kilos == kilos){
                    registro.pintar = 'verde'
                }
            });
        })
    }




    getLocalDB(tabla: any, func: any = false) {
        this.sqlite.getDB(tabla).subscribe(
            (res: any) => {
                if (res) {
                    this.db_locales[tabla] = res

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
    getDB(tabla: any, func: any = false) {
        this.cs.getDB(tabla).subscribe(
            (res: any) => {
                if (res) {
                    this.db[tabla] = res

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
}