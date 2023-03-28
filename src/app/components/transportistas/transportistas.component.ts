import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';
import { PadronService } from 'src/app/services/padron.service';

@Component({
    selector: 'app-transportistas',
    templateUrl: './transportistas.component.html',
    styleUrls: ['./transportistas.component.css']
})
export class TransportistasComponent {

    displayTransportista: any = false

    db_camiones: any = []
    db_choferes: any = []
    db_transportistas: any = []
    db_condicion_iva: any = []

    transportista: any;
    chofer: any;
    camion: any;

    select_choferes: any = [];
    select_camiones: any = [];

    cod_transporte: any;
    cod_chofer: any;
    cod_camion: any;

    load_camiones: any = true
    load_choferes: any = true
    load_transportistas: any = true

    cuit:any;

    tipoPersonaOptions: any = ["FISICA", "JURIDICA", "OTRA"]

    spinnerCUIT: any = false;

    datosTransportista: any


    constructor(
        private messageService: MessageService,
        private comunicacionService: ComunicacionService,
        private padronService: PadronService
    ){}

    ngOnInit(){
        this.obtenerCamiones()
        this.obtenerChoferes()
        this.obtenerTransportistas()
        this.obtenerCondicion_iva()

        this.datosTransportista = {
            id: null,
            codigo: '',
            alias: '',
            cuit: null,
            tipoPersona: 'FISICA',
            condicion_iva: 1,
            nombre: '',
            apellido: '',
            razonSocial: '',
            direccion: '',
            localidad: '',
            codigoPostal: '',
            descripcionProvincia: ''
        }
    }

    obtenerCamiones(){
        this.comunicacionService.get_camiones().subscribe(
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
        this.comunicacionService.get_choferes().subscribe(
            (res:any) => {
                this.db_choferes = res;
                this.load_choferes = false;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    obtenerTransportistas(){/* 
        this.comunicacionService.get_transportistas().subscribe(
            (res:any) => {
                this.db_transportistas = res;
                this.load_transportistas = false;
            },
            (err:any) => {
                console.log(err)
            }
        ) */
        this.db_transportistas = [
            {
                alias: 'Transp1',
                codigo: '01',
                cuit: null
            },
            {
                alias: 'Transp5',
                codigo: '02',
                cuit: null
            },
            {
                alias: 'Transp3',
                codigo: '03',
                cuit: null
            }
        ]
    }
    obtenerCondicion_iva(){
        this.comunicacionService.get_condicion_iva().subscribe(
            (res:any) => {
                this.db_condicion_iva = res;
            },
            (err:any) => {
                console.log(err)
            }
        )
    }








    buscarTransporte(){
        if(this.db_transportistas.some((e:any) => {return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase()})){
            this.transportista = { ... this.db_transportistas.find((e:any) => {return e.codigo.toUpperCase() == this.cod_transporte.toUpperCase()}) }

        } else {
            this.transportista = null
            this.messageService.add({severity:'error', summary:'Error!', detail:'TRANSPORTISTA no encontrado'})
        }
        
    }

    onSelectTransporte(){
        if(this.transportista){
            this.cod_transporte = this.transportista.codigo
            this.buscarChoferesCamiones()
        }
    }

    onSelectChofer(){
        if(this.chofer){
            this.cod_chofer = this.chofer.codigo
        }
    }

    onSelectCamion(){
        if(this.camion){
            this.cod_camion = this.camion.codigo
        }
    }

    buscarChoferesCamiones(){
        this.select_choferes = this.db_choferes.filter((e:any) => { return e.id_transportista == this.transportista.id})
        this.select_camiones = this.db_camiones.filter((e:any) => { return e.id_transportista == this.transportista.id})

        this.chofer = { ... this.select_choferes[0] }
        this.onSelectChofer()
        this.camion = { ... this.select_camiones[0] }
        this.onSelectCamion()

    }

    buscarCUIT(){
        this.spinnerCUIT = true
        this.padronService.padronCUIT(this.datosTransportista.cuit).subscribe(
            (res:any) => {
                this.spinnerCUIT = false
                if(!res){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Verifique los datos ingresados'})
                }

                this.datosTransportista.tipoPersona = res.tipoPersona

                var sugiereAlias = ''
                if(res.tipoPersona == 'FISICA'){
                    this.datosTransportista.nombre = res.nombre
                    this.datosTransportista.apellido = res.apellido
                    this.datosTransportista.razonSocial = ''
                    sugiereAlias = res.apellido + ', ' + res.nombre
                } else {
                    this.datosTransportista.razonSocial = res.razonSocial
                    this.datosTransportista.nombre = ''
                    this.datosTransportista.apellido = ''
                    sugiereAlias = res.razonSocial
                }

                if(this.datosTransportista.alias == '' || this.datosTransportista.alias == null){
                    this.datosTransportista.alias = sugiereAlias
                }

                if(res.domicilio.length){
                    let domicilio = res.domicilio.find((e:any) => {return e.tipoDomicilio == 'LEGAL/REAL'})
                    if(domicilio){
                        this.datosTransportista.direccion = domicilio.direccion
                        this.datosTransportista.localidad = domicilio.localidad
                        this.datosTransportista.codigoPostal = domicilio.codigoPostal
                        this.datosTransportista.descripcionProvincia = domicilio.descripcionProvincia
                    }
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a Backend (AFIP)'})
                this.spinnerCUIT = false
            }
        )
    }

    verVars(){
        console.log(this.datosTransportista)
    }

    nuevoTransportista(){
        this.datosTransportista = {
            id: null,
            codigo: '',
            alias: '',
            cuit: null,
            tipoPersona: 'FISICA',
            condicion_iva: 1,
            nombre: '',
            apellido: '',
            razonSocial: '',
            direccion: '',
            localidad: '',
            codigoPostal: '',
            descripcionProvincia: ''
        }
        this.displayTransportista = true
    }

    guardarTransportista(){
        var errores = 0
        var mensaje = ''
        if(!this.datosTransportista.id){
            //CREAR
            if(!this.datosTransportista.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_transportistas.some((e:any) => {return e.codigo == this.datosTransportista.codigo})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un transportista con este codigo'})
                errores++;
            }

            if(!errores && this.db_transportistas.some((e:any) => {return e.cuit == this.datosTransportista.cuit})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un transportista con este CUIT.'})
                mensaje = " - Tenga en cuenta que ya existe un transportista con ese CUIT."
            }

            if(!errores){
                this.messageService.clear('confirmGuardarTransp');
                this.messageService.add({key: 'confirmGuardarTransp', sticky: true, severity:'warn', summary:'Estas seguro?', detail:'Confirme para guardar' + mensaje});
            }
            
        } else {
            //MODIFICAR
            alert('modif')
        }
    }

    onReject() {
        this.messageService.clear('confirmGuardarTransp');
    }
    onConfirm() {
        this.messageService.clear('confirmGuardarTransp');
        this.displayTransportista = false

        this.comunicacionService.create_transportistas({}).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                    console.log(res)
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Transportista creado con exito 👌'})
                    this.obtenerTransportistas()
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }

}
