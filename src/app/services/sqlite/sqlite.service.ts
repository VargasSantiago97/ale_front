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
        movimientos: ["id", "id_movimiento", "id_socio", "id_establecimiento", "kg_campo", "kg_balanza", "kg_regulacion", "kg_salida", "kg_acondicionadora_entrada", "kg_acondicionadora_diferencia", "kg_acondicionadora_salida", "kg_descarga", "kg_mermas", "kg_final", "observaciones_origen", "observaciones_balanza", "observaciones_acondicionadora", "observaciones_descarga", "observaciones_contratos", "ok_origen", "ok_balanza", "ok_acondicionadora", "ok_descarga", "ok_contratos"],
        movimiento_origen: ["id", "id_movimiento", "id_establecimiento", "id_origen", "tipo_origen", "kilos"],
        contratos: ["id", "id_socio", "id_grano", "alias", "cuit_corredor", "cuit_comprador", "destino", "tipo_contrato", "fecha_contrato", "fecha_desde", "fecha_hasta", "kilos", "precio", "moneda", "activo"]
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
            const sumar = data[e] ? (data[e].toString() ? data[e].toString() : '') : ''
            sent += sumar
            sent += '", "'
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