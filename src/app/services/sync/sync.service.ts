import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class SyncService {

    API_URI = vars.API_URI;
    USER_ID: any = 0;

    actualizandoActivo: boolean = false

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
        }, 600000)
    }

    actualizarDatosNube() {
        var fecha = new Date()
        console.info('Inicio act.: ' + fecha)
        //this.messageService.add({severity:'info', summary: 'Sticky', detail: 'Message Content', sticky: true});
    }

}