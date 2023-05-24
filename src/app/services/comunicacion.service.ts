import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class ComunicacionService {

    API_URI = vars.API_URI;
    USER_ID: any = 0;
    BLOQUEAR_EDICION: any = vars.BLOQUEAR_EDICION

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.USER_ID = localStorage.getItem('user')

        if(!this.BLOQUEAR_EDICION){
            this.BLOQUEAR_EDICION = false
        }
    }

    
    //Consultas a DB
    getDB(tabla: any) {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=${tabla}`);
    }
    getDBAll(tabla: any) {
        return this.http.get(`${this.API_URI}/index.php?op=getAllAll&tabla=${tabla}`);
    }
    createDB(tabla: any, data: any) {
        if(!this.BLOQUEAR_EDICION){
            return this.http.post(`${this.API_URI}/index.php?op=create&tabla=${tabla}`, this.trans(tabla, data));
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No esta autorizado para crear nuevos registros. Consulte al administrador' })
            return this.http.post(`${this.API_URI}/index.php?op=getAll&tabla=null`, this.trans(tabla, data));
        }
    }
    updateDB(tabla: any, data: any) {
        if(!this.BLOQUEAR_EDICION){
            return this.http.post(`${this.API_URI}/index.php?op=update&tabla=${tabla}`, this.transEdit(tabla, data));
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'No esta autorizado para editar registros. Consulte al administrador' })
            return this.http.post(`${this.API_URI}/index.php?op=getAll&tabla=null`, this.trans(tabla, data));
        }
    }

    //Consultas a DB
    getDir(dir: any) {
        return this.http.get(`${this.API_URI}/listar.php?&dir=${dir}`);
    }


    trans(tabla:any, dato:any){
        dato.estado = 1;

        dato.creado_por = this.USER_ID;
        dato.editado_por = this.USER_ID;

        var fechaHora = new Date();
        fechaHora.setHours(fechaHora.getHours() - 3);
        var fechaHoraISO = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

        dato.creado_el = fechaHoraISO
        dato.editado_el = fechaHoraISO

        this.setearUltimaMod(tabla, fechaHoraISO)

        return dato
    }
    transEdit(tabla:any, dato:any){
        dato.editado_por = this.USER_ID;

        var fechaHora = new Date();
        fechaHora.setHours(fechaHora.getHours() - 3);
        var fechaHoraISO = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

        dato.editado_el = fechaHoraISO

        this.setearUltimaMod(tabla, fechaHoraISO)

        return dato
    }
    setearUltimaMod(tabla:any, ult_mod:any){
        this.getDB('sync').subscribe(
            (res:any) => {
                if(res){
                    var dato = res.find((e:any) => { return e.tabla == tabla })
                    if(dato){
                        dato.ult_mod = ult_mod
                        this.updateDB('sync', dato).subscribe(
                            (resp:any) => {}, (errr:any) => {console.log(errr)}
                        )
                    }
                }
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
}

/* 
[
    {
        "tabla": "camiones",
        "columnas": ["id", "id_transportista", "patente_chasis", "patente_acoplado", "patente_otro", "codigo", "alias", "modelo", "kg_tara", "creado_por", "creado_el", "editado_por", "editado_el", "estado"]
    },
    {
        "tabla": "choferes",
        "columnas": ["id", "id_transportista", "codigo", "alias", "razon_social", "cuit", "condicion_iva", "creado_por", "creado_el", "editado_por", "editado_el", "estado"]
    },
    {
        "tabla": "condicion_iva",
        "columnas": ["id", "alias", "descripcion", "codigo", "iva", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    },
    {
        "tabla": "socios",
        "columnas": ["id", "alias", "razon_social", "cuit", "codigo", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    },
    {
        "tabla": "transportistas",
        "columnas": ["id", "codigo", "alias", "razon_social", "cuit", "condicion_iva", "creado_por", "creado_el", "editado_por", "editado_el", "estado"]
    },
    {
        "tabla": "users",
        "columnas": ["id", "alias", "nombre", "apellido", "foto_url", "estado"]
    },
    {
        "tabla": "campanas",
        "columnas": ["id", "alias", "descripcion", "codigo", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    },
    {
        "tabla": "depositos",
        "columnas": ["id", "alias", "descripcion", "codigo", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    },
    {
        "tabla": "establecimientos",
        "columnas": ["id", "alias", "descripcion", "codigo", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    },
    {
        "tabla": "gastos",
        "columnas": ["id", "alias", "descripcion", "codigo", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    },
    {
        "tabla": "granos",
        "columnas": ["id", "alias", "descripcion", "codigo", "creado_por", "creado_el", "editado_por", "editado_el", "activo", "estado"]
    }
]

*/