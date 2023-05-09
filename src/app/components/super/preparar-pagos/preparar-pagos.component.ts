import { Component } from '@angular/core';

@Component({
    selector: 'app-preparar-pagos',
    templateUrl: './preparar-pagos.component.html',
    styleUrls: ['./preparar-pagos.component.css']
})
export class PrepararPagosComponent {

    prepararPagosData : any = []

    constructor(){

    }

    ngOnInit(){
        if(localStorage.getItem('prepararPagos')){
            this.prepararPagosData = this.base64toObjUtf8(localStorage.getItem('prepararPagos'))

            console.log(this.prepararPagosData)
        }
    }

    base64toObjUtf8(ent: any) {
        let json = atob(ent);
        let utf8String = decodeURIComponent(escape(json));
        let obj = JSON.parse(utf8String)
        return obj;
    }
}
