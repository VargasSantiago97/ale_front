import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class SqliteService {

    API_URI = vars.API_URI;

    formatoColumnas:any = {
        establecimientos: ['id', 'alias', 'activo', 'estado'],
        lotes: ["id", "id_establecimiento", "alias", "has", "activo", "estado"],
        silos: ["id", "id_establecimiento", "alias", "kilos", "activo", "estado"],
        produccion: ["id", "id_establecimiento", "id_socio", "porcentaje"],
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

        return this.http.post(`${this.API_URI}/sqlite.php`, {sentencia: sent});
    }
    updateDB(tabla:any, data: any) {
        var sent = 'UPDATE "' + tabla + '" SET '

        for (let i = 0; i < this.formatoColumnas[tabla].length; i++) {
            const agregar = this.formatoColumnas[tabla][i] + ' = "' + data[this.formatoColumnas[tabla][i]] + '", '
            sent += agregar
        }

        sent = sent.slice(0, -2)
        sent += ' WHERE id = "' + data.id + '"'

        return this.http.put(`${this.API_URI}/sqlite.php`, {sentencia: sent});
    }
    deleteDB(tabla:any, idd: any) {
        const sent = 'DELETE FROM "' + tabla + '" WHERE id = "' + idd + '"'
        return this.http.delete(`${this.API_URI}/sqlite.php`, {body: {sentencia:sent}} );
    }

}