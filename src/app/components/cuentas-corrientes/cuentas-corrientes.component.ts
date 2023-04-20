import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { PadronService } from 'src/app/services/padron.service';

@Component({
    selector: 'app-cuentas-corrientes',
    templateUrl: './cuentas-corrientes.component.html',
    styleUrls: ['./cuentas-corrientes.component.css']
})
export class CuentasCorrientesComponent {


    db_camiones: any = []
    db_choferes: any = []
    db_transportistas: any = []
    db_condicion_iva: any = []
    db_socios: any = []

    transportista: any;
    socio: any;
    chofer: any;
    camion: any;

    select_choferes: any = [];
    select_camiones: any = [];

    load_camiones: any = true
    load_choferes: any = true
    load_transportistas: any = true
    load_condicion_iva: any = true

    constructor(
        private messageService: MessageService,
        private comunicacionService: ComunicacionService,
    ){}

    ngOnInit(){
        this.obtenerCamiones()
        this.obtenerChoferes()
        this.obtenerTransportistas()
        this.obtenerCondicion_iva()
        this.obtenerSocios()
    }

    //CONEXION A BASE DE DATOS
    obtenerCamiones(){
        this.comunicacionService.getDB("camiones").subscribe(
            (res:any) => {
                this.db_camiones = res;
                this.load_camiones = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerChoferes(){
        this.comunicacionService.getDB("choferes").subscribe(
            (res:any) => {
                this.db_choferes = res;
                this.load_choferes = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerTransportistas(){
        this.comunicacionService.getDB("transportistas").subscribe(
            (res:any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerCondicion_iva(){
        this.comunicacionService.getDB("condicion_iva").subscribe(
            (res:any) => {
                this.db_condicion_iva = res;
                this.load_condicion_iva = false
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerSocios(){
        this.comunicacionService.getDB("socios").subscribe(
            (res:any) => {
                this.db_socios = res;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }



    onSelectTransporte(){

    }

    onSelectSocio(){
        console.log('s')
    }

}
