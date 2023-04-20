import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { PadronService } from 'src/app/services/padron.service';

@Component({
    selector: 'app-intervinientes',
    templateUrl: './intervinientes.component.html',
    styleUrls: ['./intervinientes.component.css']
})
export class IntervinientesComponent {


    db_intervinientes: any = []
    datosInterviniente: any = {}

    spinnerIntervinienteCUIT: any = false
    load_intervinientes: any = true
    displayInterviniente: any = false

    selectedColumns: any = []
    dataParaMostrarTabla: any = []
    cols: any = []

    opciones:any = [{alias:"SI", codigo:"1"}, {alias:"NO", codigo:null},]

    constructor(
        private comunicacionService: ComunicacionService,
        private padronService: PadronService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: "alias", header: "Alias" },
            { field: "cuit", header: "CUIT" },
            { field: "dstno", header: "DESTINO" },
            { field: "dstro", header: "DESTINATARIO" },
            { field: "corvtapri", header: "CORR VTA PRI" },
            { field: "corvtasec", header: "CORR VTA SEC" },
            { field: "mertermino", header: "MERC TERMINO" },
            { field: "rtecomprod", header: "RTE COM PROD" },
            { field: "rtecomvtapri", header: "RTE COM VTA PRI" },
            { field: "rtecomvtasec", header: "RTE COM VTA SEC" },
            { field: "rtecomvtasec2", header: "RTE COM VTA SEC 2" },
            { field: "rteent", header: "REP ENTREG" },
            { field: "rterec", header: "REP RECIB" },
            { field: "intflet", header: "INTERM. FLETE" },
            { field: "pagflet", header: "PAGAD. FLETE" },
        ];


        this.selectedColumns = [
            { field: "alias", header: "Alias" },
            { field: "cuit", header: "CUIT" },
            { field: "dstno", header: "DESTINO" },
            { field: "dstro", header: "DESTINATARIO" },
            { field: "corvtapri", header: "CORR VTA PRI" },
            { field: "corvtasec", header: "CORR VTA SEC" },
            { field: "mertermino", header: "MERC TERMINO" },
            { field: "rtecomprod", header: "RTE COM PROD" },
            { field: "rtecomvtapri", header: "RTE COM VTA PRI" },
            { field: "rtecomvtasec", header: "RTE COM VTA SEC" },
            { field: "rtecomvtasec2", header: "RTE COM VTA SEC 2" },
            { field: "rteent", header: "REP ENTREG" },
            { field: "rterec", header: "REP RECIB" },
            { field: "intflet", header: "INTERM. FLETE" },
            { field: "pagflet", header: "PAGAD. FLETE" },
        ];

        this.obtenerIntervinientes()
    }

    obtenerIntervinientes(){
        this.comunicacionService.getDB('intervinientes').subscribe(
            (res: any) => {
                console.log(res)
                this.db_intervinientes = res;
                this.load_intervinientes = false;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }


    nuevoInterviniente(){
        this.datosInterviniente = {
            alias: null,
            cuit: null,
            dstno: null,
            dstro: null,
            corvtapri: null,
            corvtasec: null,
            mertermino: null,
            rtecomprod: null,
            rtecomvtapri: null,
            rtecomvtasec: null,
            rtecomvtasec2: null,
            rteent: null,
            rterec: null,
            intflet: null,
            pagflet: null
        }
        this.displayInterviniente = true
    }

    editarInterviniente(dato:any){
        this.datosInterviniente = { ... dato }
        this.displayInterviniente = true
    }

    buscarIntervinienteCUIT(){
        this.spinnerIntervinienteCUIT = true
        this.padronService.padronCUIT(this.datosInterviniente.cuit).subscribe(
            (res:any) => {
                this.spinnerIntervinienteCUIT = false
                if(!res){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Verifique los datos ingresados'})
                }

                var sugiereAlias = ''
                var razonSocial = ''

                if(res.tipoPersona == 'FISICA'){
                    sugiereAlias = res.apellido + ', ' + res.nombre
                    razonSocial = res.apellido + ' ' + res.nombre
                } else {
                    sugiereAlias = res.razonSocial
                    razonSocial = res.razonSocial
                }

                this.datosInterviniente.razon_social = razonSocial

                if(this.datosInterviniente.alias == '' || this.datosInterviniente.alias == null){
                    this.datosInterviniente.alias = sugiereAlias
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a Backend (AFIP)'})
                this.spinnerIntervinienteCUIT = false
            }
        )
    }
    guardarInterviniente(){
        var errores = 0
        var mensaje = ''
        if(!this.datosInterviniente.id){
            //CREAR
            if(!this.datosInterviniente.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_intervinientes.some((e:any) => {return e.codigo.toString().toUpperCase() == this.datosInterviniente.codigo.toString().toUpperCase()})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un interviniente con este codigo'})
                errores++;
            }

            if(!errores){
                if(confirm('Desea guardar?')){
                    this.confirmaGuardarInterviniente()
                }
            }

        } else {
            //MODIFICAR
            if(!this.datosInterviniente.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_intervinientes.some((e:any) => {return (e.codigo.toString().toUpperCase() == this.datosInterviniente.codigo.toString().toUpperCase()) && (e.id != this.datosInterviniente.id)})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un interviniente con este codigo'})
                errores++;
            }

            if(!errores && this.db_intervinientes.some((e:any) => {return (e.cuit == this.datosInterviniente.cuit) && (e.id != this.datosInterviniente.id)})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un interviniente con este CUIT.'})
                mensaje = " - Tenga en cuenta que ya existe un interviniente con ese CUIT."
            }

            if(!errores){
                if(confirm('Desea modificar?')){
                    this.confirmaEditarInterviniente()
                }
            }
        }
    }
    borrarInterviniente(){
        if (confirm('Desea eliminar Interviniente?')) {
            this.datosInterviniente.estado = 0
            this.comunicacionService.updateDB("intervinientes", this.datosInterviniente).subscribe(
                (res: any) => {
                    res.mensaje ? this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminado con exito' }) : this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo en backend' })
                    this.displayInterviniente = false
                    this.obtenerIntervinientes()
                },
                (err: any) => {
                    console.log(err)
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Fallo al conectar al backend' })
                }
            )
        }
    }
    confirmaGuardarInterviniente(){
        var idd = this.generateUUID()
        if(this.db_intervinientes.some((e:any) => {return e.id == idd})){
            this.confirmaGuardarInterviniente()
            return
        }

        this.datosInterviniente.id = idd

        this.comunicacionService.createDB("intervinientes", this.datosInterviniente).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                    console.log(res)
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Chofer creado con exito 👌'})
                    this.obtenerIntervinientes()
                    this.displayInterviniente = false
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }
    confirmaEditarInterviniente(){

        this.comunicacionService.updateDB("intervinientes", this.datosInterviniente).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Camion modificado con exito 👌'})
                    this.displayInterviniente = false
                    this.obtenerIntervinientes()
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }

    


    transformarDatoMostrarTabla(dato:any, tipo:any){
        return dato
    }

    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}
