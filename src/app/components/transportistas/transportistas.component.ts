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
    displayChofer: any = false
    displayCamion: any = false

    spinnerCUIT: any = false;
    spinnerChoferCUIT: any = false;

    db_camiones: any = []
    db_choferes: any = []
    db_transportistas: any = []
    db_condicion_iva: any = []

    transportista: any;
    chofer: any;
    camion: any;

    select_choferes: any = [];
    select_camiones: any = [];

    load_camiones: any = true
    load_choferes: any = true
    load_transportistas: any = true
    load_condicion_iva: any = true

    cuit:any;

    tipoPersonaOptions: any = ["FISICA", "JURIDICA", "OTRA"]

    datosTransportista: any
    datosChofer: any
    datosCamion: any


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
            razon_social: '',
            direccion: '',
            localidad: '',
            codigoPostal: '',
            descripcionProvincia: ''
        }
        this.datosChofer = {
            id: null,
            id_transportista: null,
            codigo: '',
            alias: '',
            cuit: null,
            razon_social: '',
        }
        this.datosCamion = {
            id: null,
            id_transportista: null,
            codigo: '',
            patente_chasis: '',
            patente_acoplado: '',
            patente_otro: '',
            alias: '',
            modelo: '',
            kg_tara: ''
        }
    }

    //CONEXION A BASE DE DATOS
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
    obtenerTransportistas(){
        this.comunicacionService.get_transportistas().subscribe(
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
        this.comunicacionService.get_condicion_iva().subscribe(
            (res:any) => {
                this.db_condicion_iva = res;
                this.load_condicion_iva = false
            },
            (err:any) => {
                console.log(err)
            }
        )
    }



    onSelectTransporte(){
        if(this.transportista){
            this.buscarChoferesCamiones()
        }
    }
    buscarChoferesCamiones(){
        if(this.transportista){
            if(this.transportista.id){
                this.select_choferes = this.db_choferes.filter((e:any) => { return e.id_transportista == this.transportista.id})
                this.select_camiones = this.db_camiones.filter((e:any) => { return e.id_transportista == this.transportista.id})        
            }
        }
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
                    this.datosTransportista.razon_social = res.apellido + ' ' + res.nombre
                    sugiereAlias = res.apellido + ', ' + res.nombre
                } else {
                    this.datosTransportista.razon_social = res.razonSocial
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
                } else if (res.domicilio.tipoDomicilio == 'LEGAL/REAL') {
                    this.datosTransportista.direccion = res.domicilio.direccion
                    this.datosTransportista.localidad = res.domicilio.localidad
                    this.datosTransportista.codigoPostal = res.domicilio.codigoPostal
                    this.datosTransportista.descripcionProvincia = res.domicilio.descripcionProvincia
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a Backend (AFIP)'})
                this.spinnerCUIT = false
            }
        )
    }

    //TRANSPORTISTAS
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
    editarTransportista(dato:any){
        this.datosTransportista = { ... dato }
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
            if(!errores && this.db_transportistas.some((e:any) => {return e.codigo.toString().toUpperCase() == this.datosTransportista.codigo.toString().toUpperCase()})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un transportista con este codigo'})
                errores++;
            }

            if(!errores && this.db_transportistas.some((e:any) => {return e.cuit == this.datosTransportista.cuit})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un transportista con este CUIT.'})
                mensaje = " - Tenga en cuenta que ya existe un transportista con ese CUIT."
            }

            if(!errores){
                this.messageService.clear('confirmGuardarTransp');
                this.messageService.add({key: 'confirmGuardarTransp', sticky: true, severity:'warn', summary:'CREAR NUEVO', detail:'Confirme para guardar' + mensaje});
            }

        } else {
            //MODIFICAR
            if(!this.datosTransportista.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_transportistas.some((e:any) => {return (e.codigo == this.datosTransportista.codigo) && (e.id != this.datosTransportista.id)})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un transportista con este codigo'})
                errores++;
            }

            if(!errores && this.db_transportistas.some((e:any) => {return (e.cuit == this.datosTransportista.cuit) && (e.id != this.datosTransportista.id)})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un transportista con este CUIT.'})
                mensaje = " - Tenga en cuenta que ya existe un transportista con ese CUIT."
            }

            if(!errores){
                this.messageService.clear('confirmModificarTransp');
                this.messageService.add({key: 'confirmModificarTransp', sticky: true, severity:'warn', summary:'MODIFICAR', detail:'Confirme para modificar' + mensaje});
            }
        }
    }

    onReject() {
        this.messageService.clear('confirmGuardarTransp');
    }
    onConfirm() {
        this.messageService.clear('confirmGuardarTransp');

        var idd = this.generateUUID()
        if(this.db_transportistas.some((e:any) => {return e.id == idd})){
            this.messageService.add({severity:'info', summary:'INTENTE NUEVAMENTE', detail:'Hubo un error interno en UUID. Vuelva a presionar "guardar"'})
            return
        }

        this.datosTransportista.id = idd
        this.datosTransportista.razon_social = this.datosTransportista.razonSocial

        this.comunicacionService.create_transportistas(this.datosTransportista).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                    console.log(res)
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Transportista creado con exito 👌'})
                    this.obtenerTransportistas()
                    this.displayTransportista = false
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }

    onRejectModificar(){
        this.messageService.clear('confirmModificarTransp');
    }
    onConfirmModificar(){
        this.messageService.clear('confirmModificarTransp');

        this.datosTransportista.razon_social = this.datosTransportista.razonSocial

        this.comunicacionService.update_transportistas(this.datosTransportista).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Transportista modificado con exito 👌'})
                    this.obtenerTransportistas()
                    this.displayTransportista = false
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }


    //CHOFERES
    nuevoChofer(){
        if(this.transportista){
            if(this.transportista.id){
                this.datosChofer = {
                    id: null,
                    id_transportista: this.transportista.id,
                    codigo: '',
                    alias: '',
                    cuit: null,
                    razon_social: '',
                }
                this.displayChofer = true

                console.log(this.datosChofer)

                return
            }
        }
        //else
        this.messageService.add({severity:'error', summary:'Error!', detail:'Seleccione un TRANSPORTISTA'})
    }
    editarChofer(dato:any){
        this.datosChofer = { ... dato }
        this.displayChofer = true
    }
    buscarChoferCUIT(){
        this.spinnerChoferCUIT = true
        this.padronService.padronCUIT(this.datosChofer.cuit).subscribe(
            (res:any) => {
                this.spinnerChoferCUIT = false
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

                this.datosChofer.razon_social = razonSocial

                if(this.datosChofer.alias == '' || this.datosChofer.alias == null){
                    this.datosChofer.alias = sugiereAlias
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a Backend (AFIP)'})
                this.spinnerChoferCUIT = false
            }
        )
    }
    guardarChofer(){
        var errores = 0
        var mensaje = ''
        if(!this.datosChofer.id){
            //CREAR
            if(!this.datosChofer.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_choferes.some((e:any) => {return e.codigo.toString().toUpperCase() == this.datosChofer.codigo.toString().toUpperCase()})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un chofer con este codigo'})
                errores++;
            }

            if(!errores && this.db_choferes.some((e:any) => {return e.cuit == this.datosChofer.cuit})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un chofer con este CUIT.'})
                mensaje = " - Tenga en cuenta que ya existe un chofer con ese CUIT."
            }

            if(!errores){
                this.messageService.clear('confirmGuardarChofer');
                this.messageService.add({key: 'confirmGuardarChofer', sticky: true, severity:'warn', summary:'CREAR NUEVO', detail:'Confirme para guardar' + mensaje});
            }

        } else {
            //MODIFICAR
            if(!this.datosChofer.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_choferes.some((e:any) => {return (e.codigo.toString().toUpperCase() == this.datosChofer.codigo.toString().toUpperCase()) && (e.id != this.datosChofer.id)})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un chofer con este codigo'})
                errores++;
            }

            if(!errores && this.db_choferes.some((e:any) => {return (e.cuit == this.datosChofer.cuit) && (e.id != this.datosChofer.id)})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un chofer con este CUIT.'})
                mensaje = " - Tenga en cuenta que ya existe un chofer con ese CUIT."
            }

            if(!errores){
                this.messageService.clear('confirmModificarChofer');
                this.messageService.add({key: 'confirmModificarChofer', sticky: true, severity:'warn', summary:'MODIFICAR', detail:'Confirme para modificar' + mensaje});
            }
        }
    }

    onRejectChofer() {
        this.messageService.clear('confirmGuardarChofer');
    }
    onConfirmChofer() {
        this.messageService.clear('confirmGuardarChofer');

        var idd = this.generateUUID()
        if(this.db_choferes.some((e:any) => {return e.id == idd})){
            this.messageService.add({severity:'info', summary:'INTENTE NUEVAMENTE', detail:'Hubo un error interno en UUID. Vuelva a presionar "guardar"'})
            return
        }

        this.datosChofer.id = idd

        this.comunicacionService.create_choferes(this.datosChofer).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                    console.log(res)
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Chofer creado con exito 👌'})
                    this.obtenerChoferes()
                    this.buscarChoferesCamiones()
                    this.displayChofer = false
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }

    onRejectModificarChofer(){
        this.messageService.clear('confirmModificarChofer');
    }
    onConfirmModificarChofer(){
        this.messageService.clear('confirmModificarChofer');

        this.comunicacionService.update_choferes(this.datosChofer).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Chofer modificado con exito 👌'})
                    this.obtenerChoferes()
                    this.buscarChoferesCamiones()
                    this.displayChofer = false
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }

    

    //CAMIONES
    nuevoCamion(){
        if(this.transportista){
            if(this.transportista.id){
                this.datosCamion = {
                    id: null,
                    id_transportista: this.transportista.id,
                    codigo: '',
                    patente_chasis: '',
                    patente_acoplado: '',
                    patente_otro: '',
                    alias: '',
                    modelo: '',
                    kg_tara: ''
                }
                this.displayCamion = true

                return
            }
        }
        //else
        this.messageService.add({severity:'error', summary:'Error!', detail:'Seleccione un TRANSPORTISTA'})
    }
    editarCamion(dato:any){
        this.datosCamion = { ... dato }
        this.displayCamion = true
    }
    guardarCamion(){
        var errores = 0
        var mensaje = ''
        if(!this.datosCamion.id){
            //CREAR
            if(!this.datosCamion.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_camiones.some((e:any) => {return e.codigo.toString().toUpperCase() == this.datosCamion.codigo.toString().toUpperCase()})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un camion con este codigo'})
                errores++;
            }

            if(!errores && this.db_camiones.some((e:any) => {return e.patente_chasis == this.datosCamion.patente_chasis})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un camion con esa patente'})
                mensaje = " - Tenga en cuenta que ya existe un camion con esa patente."
            }

            if(!errores){
                this.messageService.clear('confirmGuardarCamion');
                this.messageService.add({key: 'confirmGuardarCamion', sticky: true, severity:'warn', summary:'CREAR NUEVO', detail:'Confirme para guardar' + mensaje});
            }

        } else {
            //MODIFICAR
            if(!this.datosCamion.codigo){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ingrese un codigo'})
                errores++;
            }
            if(!errores && this.db_camiones.some((e:any) => {return (e.codigo.toString().toUpperCase() == this.datosCamion.codigo.toString().toUpperCase()) && (e.id != this.datosCamion.id)})){
                this.messageService.add({severity:'error', summary:'Error!', detail:'Ya existe un Camion con este codigo'})
                errores++;
            }

            if(!errores && this.db_camiones.some((e:any) => {return (e.patente_chasis == this.datosCamion.patente_chasis) && (e.id != this.datosCamion.id)})){
                this.messageService.add({severity:'warn', summary:'ADVERTENCIA!', detail:'Ya existe un camion con esa patente.'})
                mensaje = " - Tenga en cuenta que ya existe un camion con esa patente."
            }

            if(!errores){
                this.messageService.clear('confirmModificarCamion');
                this.messageService.add({key: 'confirmModificarCamion', sticky: true, severity:'warn', summary:'MODIFICAR', detail:'Confirme para modificar' + mensaje});
            }
        }
    }

    onRejectCamion() {
        this.messageService.clear('confirmGuardarCamion');
    }
    onConfirmCamion() {
        this.messageService.clear('confirmGuardarCamion');

        var idd = this.generateUUID()
        if(this.db_camiones.some((e:any) => {return e.id == idd})){
            this.messageService.add({severity:'info', summary:'INTENTE NUEVAMENTE', detail:'Hubo un error interno en UUID. Vuelva a presionar "guardar"'})
            return
        }

        this.datosCamion.id = idd

        this.comunicacionService.create_camiones(this.datosCamion).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                    console.log(res)
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Camion creado con exito 👌'})
                    this.obtenerCamiones()
                    this.buscarChoferesCamiones()
                    this.displayCamion = false
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
    }

    onRejectModificarCamion(){
        this.messageService.clear('confirmModificarCamion');
    }
    onConfirmModificarCamion(){
        this.messageService.clear('confirmModificarCamion');

        this.comunicacionService.update_camiones(this.datosCamion).subscribe(
            (res:any) => {
                if(!res || res.mensaje == false){
                    this.messageService.add({severity:'error', summary:'Error!', detail:'Error en el backend. Consulte consola'})
                } else {
                    this.messageService.add({severity:'success', summary:'Exito!', detail:'Camion modificado con exito 👌'})
                    this.obtenerCamiones()
                    this.buscarChoferesCamiones()
                    this.displayCamion = false
                }
            },
            (err:any) => {
                console.log(err)
                this.messageService.add({severity:'error', summary:'Error!', detail:'Error conectando a backend. Consulte consola'})
            }
        )
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
