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

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.USER_ID = localStorage.getItem('user')
    }

    descargarOrdenCarga(data: any) {
        return this.http.post(`${this.API_URI}/ordencarga/pdf/index.php?D=D&odenDeCarga=ok`, data);
    };
    mostrarOrdenCarga(data: any) {
        return this.http.post(`${this.API_URI}/ordencarga/pdf/index.php?D=I&odenDeCarga=ok`, data);
    };

    //CAMPANiAS
    get_campanas() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=campanas`);
    }
    create_campanas(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=campanas`, data);
    }
    update_campanas(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=campanas`, data);
    }

    //depositos
    get_depositos() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=depositos`);
    }
    create_depositos(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=depositos`, data);
    }
    update_depositos(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=depositos`, data);
    }

    //establecimientos
    get_establecimientos() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=establecimientos`);
    }
    create_establecimientos(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=establecimientos`, data);
    }
    update_establecimientos(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=establecimientos`, data);
    }

    //gastos
    get_gastos() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=gastos`);
    }
    create_gastos(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=gastos`, data);
    }
    update_gastos(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=gastos`, data);
    }

    //granos
    get_granos() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=granos`);
    }
    create_granos(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=granos`, data);
    }
    update_granos(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=granos`, data);
    }

    //condicion_iva
    get_condicion_iva() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=condicion_iva`);
    }
    create_condicion_iva(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=condicion_iva`, data);
    }
    update_condicion_iva(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=condicion_iva`, data);
    }


    //socios
    get_socios() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=socios`);
    }
    create_socios(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=socios`, data);
    }
    update_socios(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=socios`, data);
    }


    //transportistas
    get_transportistas() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=transportistas`)
    }
    create_transportistas(data: any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;

        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=transportistas`, data);
    }
    update_transportistas(data: any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=transportistas`, data);
    }


    //CHOFERES
    get_choferes() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=choferes`)
    }
    create_choferes(data:any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=choferes`, data)
    }
    update_choferes(data:any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=choferes`, data)
    }



    //CAMIONES
    get_camiones() {
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=camiones`)
    }
    create_camiones(data:any) {
        data.creado_por = this.USER_ID;
        data.editado_por = this.USER_ID;
        data.creado_el = new Date();
        data.creado_el.setHours(data.creado_el.getHours() - 3);
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        data.estado = 1;
        return this.http.post(`${this.API_URI}/index.php?op=create&tabla=camiones`, data)
    }
    update_camiones(data:any) {
        data.editado_por = this.USER_ID;
        data.editado_el = new Date();
        data.editado_el.setHours(data.editado_el.getHours() - 3);
        return this.http.post(`${this.API_URI}/index.php?op=update&tabla=camiones`, data)
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