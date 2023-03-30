import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

@Component({
  selector: 'app-campanas',
  templateUrl: './campanas.component.html',
  styleUrls: ['./campanas.component.css']
})
export class CampanasComponent {

  datos:any = []

  constructor(private serv : ComunicacionService, private messageService: MessageService){}

  ngOnInit(){
    this.obtenerElementos()
  }

  obtenerElementos(){
    this.serv.get_campanas().subscribe(
      (res:any) => {
        this.datos = res
      },
      (err:any) => {
        console.log(err)
      }
    )
  }

  agregarElemento(){
    this.datos.push({})
  }
  duplicarElemento(dato:any){
    var datoAgregar = {...dato}
    datoAgregar.id = false
    this.datos.push(datoAgregar)
  }

  editarElemento(dato:any){
    this.serv.update_campanas(dato).subscribe(
      (res:any) => {
        console.log(res)
        res.mensaje ? this.messageService.add({severity:'success', summary:'Exito!', detail:'Editado con exito'}) : this.messageService.add({severity:'error', summary:'Error!', detail:'Fallo en backend'})
      },
      (err:any) => {
        console.log(err)
        this.messageService.add({severity:'error', summary:'Error!', detail:'Fallo al conectar al backend'})
      }
    )
  }
  
  guardarElemento(dato:any){

    var idd = this.generateUUID()
    if(this.datos.some((e:any) => {return e.id == idd})){
      this.messageService.add({severity:'info', summary:'INTENTE NUEVAMENTE', detail:'Hubo un error interno en UUID. Vuelva a presionar "guardar"'})
      return
    }

    dato.id = idd
    dato['estado'] = 1

    console.log(dato)
    this.serv.create_campanas(dato).subscribe(
      (res:any) => {
        console.log(res)
        res.mensaje ? this.messageService.add({severity:'success', summary:'Exito!', detail:'Guardado con exito'}) : this.messageService.add({severity:'error', summary:'Error!', detail:'Fallo en backend'})
        this.obtenerElementos()
      },
      (err:any) => {
        console.log(err)
        this.messageService.add({severity:'error', summary:'Error!', detail:'Fallo al conectar al backend'})
      }
    )
  }

  eliminarElemento(dato:any){
    if(confirm('Desea eliminar elemento?')){
      dato.estado = 0
      this.serv.update_campanas(dato).subscribe(
        (res:any) => {
          console.log(res)
          res.mensaje ? this.messageService.add({severity:'success', summary:'Exito!', detail:'Eliminado con exito'}) : this.messageService.add({severity:'error', summary:'Error!', detail:'Fallo en backend'})
          this.obtenerElementos()
        },
        (err:any) => {
          console.log(err)
          this.messageService.add({severity:'error', summary:'Error!', detail:'Fallo al conectar al backend'})
        }
      )
    }
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
