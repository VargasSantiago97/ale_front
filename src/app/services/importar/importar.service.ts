import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class ImportarService {

    API_URI = vars.API_URI_IMPORTAR;
    USER_ID: any = 0;
    BLOQUEAR_EDICION: any = vars.BLOQUEAR_EDICION

    constructor(
        private http: HttpClient
    ) {
        this.USER_ID = localStorage.getItem('user')

        if (!this.BLOQUEAR_EDICION) {
            this.BLOQUEAR_EDICION = false
        }
    }

    //Consultas a DB
    getExcel() {
        return this.http.get(`${this.API_URI}/excel.php`);
    }
}
