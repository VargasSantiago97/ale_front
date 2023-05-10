import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class SqliteService {

    API_URI = vars.API_URI;

    formatoColumnas:any = {
        establecimientos: ['id', 'alias', 'activo', 'estado']
    }

    constructor(
        private http: HttpClient,
    ){}


    //Consultas a DB
    getDB(tabla: any) {
        return this.http.get(`${this.API_URI}/sqlite.php?tabla=${tabla}`);
    }
    createDB(tabla:any, data: any) {
        var sent = 'INSERT INTO "' + tabla + '" ('
        sent += this.formatoColumnas[tabla].join(', ')
        sent += ') VALUES ("'

        this.formatoColumnas[tabla].forEach((e:any) => {
            if(data[e]){
                sent += data[e].toString()
                sent += '", "'
            }
        });

        sent = sent.slice(0, -3) + ')'

        console.log(sent)
        return this.http.post(`${this.API_URI}/sqlite.php`, {sentencia: sent});
    }
    updateDB(data: any) {
        const sent = "UPDATE 'establecimientos' SET activo = 2, alias = 'cambio' WHERE id = '123'"
        return this.http.put(`${this.API_URI}/sqlite.php`, {sentencia: sent});
    }
    deleteDB(data: any) {
        const sent = "DELETE FROM 'establecimientos' WHERE id = 123"
        return this.http.delete(`${this.API_URI}/sqlite.php`, {body: {sentencia:sent}} );
    }

}