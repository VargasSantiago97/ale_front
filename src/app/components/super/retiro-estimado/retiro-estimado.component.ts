import { Component } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

@Component({
    selector: 'app-retiro-estimado',
    templateUrl: './retiro-estimado.component.html',
    styleUrls: ['./retiro-estimado.component.css']
})
export class RetiroEstimadoComponent {

    fechaActual: any

    establecimiento: any = 'VERBECK'
    cultivo: any = 'MAIZ'

    id_establecimiento: any = ''
    id_cultivo: any = ''

    db_granos: any = []
    db_establecimientos: any = []

    
    db_movimientos: any = []

    totalCamiones: any = 0
    totalCamionesKgs: any = 0
    
    totalCamionesNorte: any = 0
    totalCamionesYagua: any = 0
    totalKgsNorte: any = 0
    totalKgsYagua: any = 0
    totalEstimadoNorte: any = 0
    totalEstimadoYagua: any = 0

    data: any;

    constructor(
        private comunicacionService: ComunicacionService
    ) {}

    ngOnInit() {
        this.fechaActual = new Date()
        this.fechaActual = this.fechaActual.toLocaleString()

        this.obtenerGranos()
        this.obtenerEstablecimientos()
        this.obtenerMovimientos()
    }

    
    obtenerGranos() {
        this.comunicacionService.getDB('granos').subscribe(
            (res: any) => {
                this.db_granos = res;
            },
            (err: any) => {
                console.log(err)
            }
        )
    } 
    obtenerEstablecimientos() {
        this.comunicacionService.getDB('establecimientos').subscribe(
            (res: any) => {
                this.db_establecimientos = res;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    obtenerMovimientos() {
        this.comunicacionService.getDB('movimientos').subscribe(
            (res: any) => {
                this.db_movimientos = res;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    onEst(){
       this.establecimiento = this.db_establecimientos.find((e:any) => { return e.id == this.id_establecimiento }).alias
       if(this.id_cultivo){
        this.buscarDatos()
       }
    }

    onGrano(){
        this.cultivo = this.db_granos.find((e:any) => { return e.id == this.id_cultivo }).alias
        if(this.id_establecimiento){
            this.buscarDatos()
        }
    }

    buscarDatos(){
        const ID_NORTE = '141ea05753ff'
        const ID_YAGUA = 'bcb3d28daa6b'
        const ID_PLANJAR = '9c89bfa40ad1'

        this.totalCamiones = 0
        this.totalCamionesKgs = 0
        this.totalCamionesNorte = 0
        this.totalCamionesYagua = 0
        this.totalKgsNorte = 0
        this.totalKgsYagua = 0
        this.totalEstimadoNorte = 0
        this.totalEstimadoYagua = 0

        this.db_movimientos.filter((mov:any) => { return (mov.id_grano == this.id_cultivo) && (mov.id_origen == this.id_establecimiento) }).forEach((mov:any) => {
            this.totalCamiones++
            if(mov.kg_neto){
                this.totalCamionesKgs++
            }

            if((mov.id_socio == ID_NORTE) || mov.id_socio == ID_PLANJAR){
                this.totalCamionesNorte++

                if(mov.kg_neto){
                    this.totalKgsNorte += parseInt(mov.kg_neto)
                }
            }
            if(mov.id_socio == ID_YAGUA){
                this.totalCamionesYagua++

                if(mov.kg_neto){
                    this.totalKgsYagua += parseInt(mov.kg_neto)
                }
            }
        });

        const kilosPorCamion = (this.totalKgsNorte + this.totalKgsYagua) / this.totalCamionesKgs

        this.totalEstimadoNorte = (kilosPorCamion * this.totalCamionesNorte)
        this.totalEstimadoYagua = (kilosPorCamion * this.totalCamionesYagua)

        const porNor = this.totalEstimadoNorte / (this.totalEstimadoNorte + this.totalEstimadoYagua) * 100
        const porYag = this.totalEstimadoYagua / (this.totalEstimadoNorte + this.totalEstimadoYagua) * 100

        this.data = {
            labels: ['NORTE/PLANJAR','YAGUA'],
            datasets: [
                {
                    data: [porNor, porYag],
                    backgroundColor: [
                        "#42A5F5",
                        "#66BB6A",
                    ],
                    hoverBackgroundColor: [
                        "#64B5F6",
                        "#81C784",
                    ]
                }
            ]
        };

    }


    transf(dato:any, tipo:any){
        if(tipo == 'n'){
            return dato.toLocaleString()
        }
        return dato
    }
}
