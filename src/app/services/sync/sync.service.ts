import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class SyncService {

    API_URI = vars.API_URI;
    API_URI_NUBE = vars.API_URI_NUBE;
    USER_ID: any = 0;

    actualizandoActivo: boolean = false

    actualizarFechaHora : any;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.USER_ID = localStorage.getItem('user')
    }

    iniciarActualizacion() {
        if(this.actualizandoActivo) return;

        this.actualizandoActivo = true

        this.actualizarDatosNube()
        setInterval(() => {
            this.actualizarDatosNube()
        }, 60000)
    }

    actualizarDatosNube() {
        var fecha = new Date()

        this.actualizarFechaHora.fechaHoraActualizacion = fecha.toLocaleString()
        this.actualizarFechaHora.fechaHoraActualizacionLarga = fecha.toLocaleString('es-ES', {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: 'numeric', second: 'numeric'})
        this.actualizarFechaHora.actualizado = true

        this.local_getAllForSync('condicion_iva').subscribe(
            (res:any) => {
                console.log(res)
            },
            (err:any) => {
                console.log(err)
            }
        )
    }

    recibirVariable(dato:any){
        this.actualizarFechaHora = dato
    }



    //CONEXIONES A DB
    local_getAllForSync(tabla:any){
        return this.http.get(`${this.API_URI}/index.php?op=getAllForSync&tabla=${tabla}`)
    }
    remoto_getAllForSync(tabla:any){
        return this.http.get(`${this.API_URI_NUBE}/index.php?op=getAllForSync&tabla=${tabla}`)
    }

}