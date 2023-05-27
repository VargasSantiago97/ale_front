import { Component } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

@Component({
    selector: 'app-modificar',
    templateUrl: './modificar.component.html',
    styleUrls: ['./modificar.component.css']
})
export class ModificarComponent {

    permitirModificar: Boolean = false

    constructor(
        private comunicacionService: ComunicacionService
    ) { }

    ngOnInit() {
    }

    modificar() {
        if (this.permitirModificar) {
            this.permitirModificar = false

            this.comunicacionService.getDB('intervinientes').subscribe(
                (res:any) => {
                    console.log(res)

                    this.comunicacionService.getDB('movimientos').subscribe(
                        (ress:any) => {
                            ress.forEach((e:any) => {
                                if(e.id_corredor){
                                    var corredor = res.find((f:any) => { return f.id == e.id_corredor })
                                    if(corredor){
                                        console.log(corredor.alias)
                                    }
                                }
                            })
                        }
                    )
                },
                (err:any) => {
                    console.log(err)
                }
            )
        }
    }

}