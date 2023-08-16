import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class CpeService {

    API_URI = vars.API_CPE;
    API_URI_ARCHIVOS = vars.API_CPE_ARCHIVOS;
    USER_ID: any = 0;
    BLOQUEAR_EDICION_CPE: any = vars.BLOQUEAR_EDICION_CPE

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.USER_ID = localStorage.getItem('user')

        if(!this.BLOQUEAR_EDICION_CPE){
            this.BLOQUEAR_EDICION_CPE = false
        }
    }


    ejecutar(data: any) {
        if(!this.BLOQUEAR_EDICION_CPE){
            return this.http.get(`${this.API_URI}/index.php?data=${data}`);
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No esta autorizado para usar modulo "CPE". Consulte al administrador' })
            return this.http.get(`${this.API_URI}/index.php`);
        }
    }

    moverArchivo(nro_ctg:any, estado:any, nro_cpe:any){
        return this.http.get(`${this.API_URI_ARCHIVOS}/moverArchivo.php?nro_ctg=${nro_ctg}&estado=${estado}&nro_cpe=${nro_cpe}`);
    }

    guardarArchivo(archivo:any){

        const dataEnviar = { key: encodeURIComponent(archivo) };

        return this.http.post(`${this.API_URI_ARCHIVOS}/guardar.php`, dataEnviar)
    }


}