import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

@Component({
    selector: 'app-depositosres',
    templateUrl: './depositosres.component.html',
    styleUrls: ['./depositosres.component.css']
})
export class DepositosresComponent {


    db: any = {}

    granoSeleccionado: any = ''
    depositoSeleccionado: any = ''

    cols: any = []

    datosTabla:any = []

    constructor(
        private comunicacionService: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {

        this.cols = [
            { field: 'fecha', header: 'Fecha'},
            { field: 'id_camion', header: 'Camion'},
            { field: 'id_chofer', header: 'Chofer'},
            { field: 'id_origen', header: 'Origen'},
            { field: 'id_transporte', header: 'Transporte'},
            { field: 'kg_bruto', header: 'Kg Bruto'},
            { field: 'kg_campo', header: 'Kg Bruto'},
            { field: 'kg_neto', header: 'Kg Neto'},
            { field: 'kg_neto_final', header: 'Kg Neto Final'},
            { field: 'kg_regulacion', header: 'Kg Regulacion'},
            { field: 'kg_tara', header: 'Kg Tara'},
            { field: 'kg_saldo', header: 'SALDO EN DEPOSITO'},
        ]

        this.getDB('depositos')
        this.getDB('granos')
        this.getDB('camiones')
        this.getDB('transportistas')
        this.getDB('choferes')
        this.getDB('establecimientos')
    }

    buscarMovimientos(){
        if(!this.granoSeleccionado || !this.depositoSeleccionado){
            alert('Seleccionar deposito y grano')
            return
        }

        this.datosTabla = []

        this.getDB('movimientos', () => {
            const movimientosSeleccionados = this.db.movimientos.filter((e:any) => { return (e.id_grano == this.granoSeleccionado) && (e.id_deposito == this.depositoSeleccionado ) })

            var kg_saldo: any = 0
            movimientosSeleccionados.forEach((mov:any) => {

                const kilos = mov.kg_regulacion ? parseInt(mov.kg_regulacion) : 0
                kg_saldo -= kilos

                this.datosTabla.push({
                    fecha: mov.fecha,
                    id_camion: mov.id_camion,
                    id_chofer: mov.id_chofer,
                    id_origen: mov.id_origen,
                    id_transporte: mov.id_transporte,
                    kg_bruto: mov.kg_bruto,
                    kg_campo: mov.kg_campo,
                    kg_neto: mov.kg_neto,
                    kg_neto_final: mov.kg_neto_final,
                    kg_regulacion: mov.kg_regulacion,
                    kg_tara: mov.kg_tara,
                    kg_saldo: kg_saldo
                })
            });
        })
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
        if (tipo == 'socio') {
            return this.db.socios.some((e: any) => { return e.id == dato }) ? this.db.socios.find((e: any) => { return e.id == dato }).razon_social : ''
        }
        if (tipo == 'depositos') {
            return this.db.depositos.some((e: any) => { return e.id == dato }) ? this.db.depositos.find((e: any) => { return e.id == dato }).alias : ''
        }
        if (tipo == 'granos') {
            return this.db.granos.some((e: any) => { return e.id == dato }) ? this.db.granos.find((e: any) => { return e.id == dato }).alias : ''
        }

        return dato
    }

    getDB(tabla:any, func:any = false){
        this.comunicacionService.getDB(tabla).subscribe(
            (res:any) => {
                if(res){
                    this.db[tabla] = res

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


}
