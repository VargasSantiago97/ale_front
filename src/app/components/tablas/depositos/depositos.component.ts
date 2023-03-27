import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComunicacionService } from 'src/app/services/comunicacion.service';

@Component({
  selector: 'app-depositos',
  templateUrl: './depositos.component.html',
  styleUrls: ['./depositos.component.css']
})
export class DepositosComponent {

  datos:any = []

  constructor(private serv : ComunicacionService, private messageService: MessageService){}

  ngOnInit(){
    this.obtenerElementos()
  }

  obtenerElementos(){
    this.serv.get_depositos().subscribe(
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
    this.serv.update_depositos(dato).subscribe(
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

    dato['id'] = true
    dato['estado'] = 1

    console.log(dato)
    this.serv.create_depositos(dato).subscribe(
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
      this.serv.update_depositos(dato).subscribe(
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
}
