import { Component } from '@angular/core';
import { SqliteService } from 'src/app/services/sqlite/sqlite.service';

@Component({
    selector: 'app-campos',
    templateUrl: './campos.component.html',
    styleUrls: ['./campos.component.css']
})
export class CamposComponent {

    constructor(
        private sqlite: SqliteService
    ) { }

    ngOnInit() {

    }

    leer() {
        this.sqlite.getDB('establecimientos').subscribe(
            (res:any) => {
                console.log(res)
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    crear() {
        this.sqlite.createDB('establecimientos',{id:1, alias:'sant', activo:2, estado:3}).subscribe(
            (res:any) => {
                console.log(res)
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    editar() {
        this.sqlite.updateDB('').subscribe(
            (res:any) => {
                console.log(res)
            },
            (err:any) => {
                console.log(err)
            }
        )
    }
    borrar() {
        this.sqlite.deleteDB('').subscribe(
            (res:any) => {
                console.log(res)
            },
            (err:any) => {
                console.log(err)
            }
        )
    }

}
