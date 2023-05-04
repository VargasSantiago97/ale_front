import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class CpeService {

    API_URI = vars.API_CPE;
    USER_ID: any = 0;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.USER_ID = localStorage.getItem('user')
    }


    ejecutar(data: any) {
        return this.http.get(`${this.API_URI}/index.php?data=${data}`);
    }

    moverArchivo(nro_ctg:any, estado:any, nro_cpe:any){
        return this.http.get(`${this.API_URI}/moverArchivo.php?nro_ctg=${nro_ctg}&estado=${estado}&nro_cpe=${nro_cpe}`);
    }


}