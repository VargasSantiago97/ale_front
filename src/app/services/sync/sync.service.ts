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

    listaSyncLocal: any;
    listaSyncRemota: any;

    tablasAModificar: any = [];
    modificandoTablaN: any = 0;
    datosTablaLocal: any = [];
    datosTablaRemota: any = [];

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.USER_ID = localStorage.getItem('user')
    }

    iniciarActualizacion() {
        if(this.actualizandoActivo) return;

        this.actualizandoActivo = true

        this.obtenerDatosLocales()
        setInterval(() => {
            this.obtenerDatosLocales()
        }, 60000)
    }

    recibirVariable(dato:any){
        this.actualizarFechaHora = dato
    }

    //INICIAR CON PROCESOS:
    obtenerDatosLocales(){
        this.local_getSync().subscribe(
            (res:any) => {
                this.listaSyncLocal = res
                this.obtenerDatosRemotos()
            },
            (err:any) => {
                console.log(err)
            }
        )
    }

    obtenerDatosRemotos(){
        this.remoto_getSync().subscribe(
            (res:any) => {
                this.listaSyncRemota = res
                this.realizarCompararcionDeTablas()
            },
            (err:any) => {
                console.log(err)
            }
        )
    }

    realizarCompararcionDeTablas(){
        this.tablasAModificar = []

        this.listaSyncLocal.forEach((dataLocal:any) => {
            var tabla = dataLocal.tabla

            var dataServer = this.listaSyncRemota.find((e:any) => {return e.tabla == tabla})
            
            var ult_mod_local = new Date(dataLocal.ult_mod).getTime()
            var ult_mod_server = new Date(dataServer.ult_mod).getTime()

            if(ult_mod_local != ult_mod_server){
                this.tablasAModificar.push(tabla)
            }
        });

        this.modificandoTablaN = 0
        if(this.tablasAModificar.length > 0){
            this.getAllForSyncLocal()
        }
    }

    getAllForSyncLocal(){

        this.datosTablaLocal = []
        this.datosTablaRemota = []

        this.local_getAllForSync(this.tablasAModificar[this.modificandoTablaN]).subscribe(
            (res:any) => {
                this.datosTablaLocal = res;

                this.remoto_getAllForSync(this.tablasAModificar[this.modificandoTablaN]).subscribe(
                    (res:any) => {
                        this.datosTablaRemota = res;
                        this.compararDatosTablas()
                    },
                    (err:any) => {
                        console.log(err)
                    }
                )
            },
            (err:any) => {
                console.log(err)
            }
        )

    }

    compararDatosTablas(){
        //SI EXISTE EN REMOTO Y NO EN LOCAL
        this.datosTablaRemota.forEach((e:any) => {
            if(!this.datosTablaLocal.some((f:any) => {return f.id == e.id})){
                //crearEnLocal
                console.log('crearEnLocal', e)
            }
        })

        //SI EXISTE EN LOCAL Y NO EN REMOTO
        this.datosTablaLocal.forEach((e:any) => {
            if(!this.datosTablaRemota.some((f:any) => {return f.id == e.id})){
                //crearEnRemoto
                console.log('crearEnRemoto', e)
            }
        })

        //SI EXISTE EN REMOTO Y MODIFICACION MAS RECIENTE (bajar)
        this.datosTablaRemota.forEach((e:any) => {
            if(this.datosTablaLocal.some((f:any) => {return (f.id == e.id) && (f.editado_el < e.editado_el)})){
                //bajarALocal
                console.log('bajarALocal', e)
            }
        })

        //SI EXISTE EN LOCAL Y MODIFICACION MAS RECIENTE (subir)
        this.datosTablaLocal.forEach((e:any) => {
            if(this.datosTablaRemota.some((f:any) => {return (f.id == e.id) && (f.editado_el < e.editado_el)})){
                //subirARemoto
                console.log('subirARemoto', e)
            }
        })


        this.modificandoTablaN++;
        if(this.tablasAModificar.length > this.modificandoTablaN){
            this.getAllForSyncLocal()
        } else {
            //fin
            var fecha = new Date()
            this.actualizarFechaHora.fechaHoraActualizacion = fecha.toLocaleString()
            this.actualizarFechaHora.fechaHoraActualizacionLarga = fecha.toLocaleString('es-ES', {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: 'numeric', second: 'numeric'})
            this.actualizarFechaHora.actualizado = true
        }
    }


    //CONEXIONES A DB
    local_getSync(){
        return this.http.get(`${this.API_URI}/index.php?op=getAll&tabla=sync`)
    }
    remoto_getSync(){
        return this.http.get(`${this.API_URI_NUBE}/index.php?op=getAll&tabla=sync`)
    }

    local_getAllForSync(tabla:any){
        return this.http.get(`${this.API_URI}/index.php?op=getAllForSync&tabla=${tabla}`)
    }
    remoto_getAllForSync(tabla:any){
        return this.http.get(`${this.API_URI_NUBE}/index.php?op=getAllForSync&tabla=${tabla}`)
    }

    local_getID(tabla:any, idd:any){
        return this.http.get(`${this.API_URI}/index.php?op=getID&tabla=${tabla}&id=${idd}`)
    }
    remoto_getID(tabla:any, idd:any){
        return this.http.get(`${this.API_URI_NUBE}/index.php?op=getID&tabla=${tabla}&id=${idd}`)
    }

    local_create(tabla:any, idd:any){
        return this.http.get(`${this.API_URI}/index.php?op=getID&tabla=${tabla}&id=${idd}`)
    }
    remoto_create(tabla:any, idd:any){
        return this.http.get(`${this.API_URI_NUBE}/index.php?op=getID&tabla=${tabla}&id=${idd}`)
    }

    local_update(tabla:any, idd:any){
        return this.http.get(`${this.API_URI}/index.php?op=getID&tabla=${tabla}&id=${idd}`)
    }
    remoto_update(tabla:any, idd:any){
        return this.http.get(`${this.API_URI_NUBE}/index.php?op=getID&tabla=${tabla}&id=${idd}`)
    }

}