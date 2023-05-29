import { Component } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

@Component({
    selector: 'app-modificar',
    templateUrl: './modificar.component.html',
    styleUrls: ['./modificar.component.css']
})
export class ModificarComponent {

    permitirModificar: Boolean = false
    permiteComenzar: Boolean = false

    db_intervinientes: any = []
    db_movimientos: any = []
    db_carta_porte: any = []
    db_banderas: any = []

    datosAModificar: any = []
    modificandoNumero: any = 0

    constructor(
        private comunicacionService: ComunicacionService
    ) { }

    ngOnInit() {
    }

    modificar() {
        if (this.permitirModificar) {
            this.permitirModificar = false
            this.buscarIntervinientes()
        }
    }

    buscarIntervinientes(){
        this.comunicacionService.getDB('intervinientes').subscribe(
            (res:any) => {
                this.db_intervinientes = res

                this.buscarMovimientos()
            },
            (err:any) => {
                console.log(err)
            }
        )
    }

    buscarMovimientos(){
        this.comunicacionService.getDB('movimientos').subscribe(
            (res:any) => {
                this.db_movimientos = res

                this.buscarCPE()
            }
        )
    }

    buscarCPE(){
        this.comunicacionService.getDB('carta_porte').subscribe(
            (res:any) => {
                this.db_carta_porte = res

                this.buscarBanderas()
            }
        )
    }

    buscarBanderas(){
        this.comunicacionService.getDB('banderas').subscribe(
            (res:any) => {
                this.db_banderas = res

                this.construirDatos()
            }
        )
    }

    construirDatos(){
        this.datosAModificar = []

        this.db_movimientos.forEach((movimiento:any) => {

            const cpes:any = this.db_carta_porte.filter((e:any) => { return e.id_movimiento == movimiento.id })

            cpes.forEach((cpe:any) => {
                if(cpe.data){
                    if(JSON.parse(cpe.data)){
                        if((JSON.parse(cpe.data)['estado'] == 'CN') || (JSON.parse(cpe.data)['estado'] == 'AC')){
                            if(cpe.cuit_corredor_venta_primaria){

                                const bandera = this.db_banderas.find((e:any) => { return e.codigo == cpe.cuit_corredor_venta_primaria })

                                if(bandera){
                                    movimiento.id_bandera = JSON.stringify([bandera.id])
                                    this.datosAModificar.push(movimiento)
                                }
                            }
                        }
                    }
                }
            })

        })

        this.permiteComenzar = true
        this.modificandoNumero = 0
        console.log('A modificar:', this.datosAModificar.length)
    }

    comenzarModificacion(){
        if(this.modificandoNumero < this.datosAModificar.length){
            console.log(this.datosAModificar[this.modificandoNumero])

            this.editarDB(this.datosAModificar[this.modificandoNumero])
        }
    }

    editarDB(dato:any){

        var fechaHora = new Date(dato.editado_el);
        fechaHora.setHours(fechaHora.getHours() - 3);
        fechaHora.setMinutes(fechaHora.getMinutes() + 1);
        var fechaHoraISO = fechaHora.toISOString().slice(0, 19).replace('T', ' ');
    
        dato.editado_el = fechaHoraISO

        this.comunicacionService.updateDirectoDB('movimientos', dato).subscribe(
            (res:any) => {
                if(res){
                    if(res.mensaje){
                        console.log(res)

                        setTimeout(() => {
                            this.modificandoNumero++
                            this.comenzarModificacion()
                        }, 100)
                    }
                }
            },
            (err) => {console.error(err)}
        )
    }

}