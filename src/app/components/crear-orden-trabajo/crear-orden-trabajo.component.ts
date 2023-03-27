import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crear-orden-trabajo',
    templateUrl: './crear-orden-trabajo.component.html',
    styleUrls: ['./crear-orden-trabajo.component.css']
})
export class CrearOrdenTrabajoComponent {
    socioSeleccionado: any;
    socios: any;
    fechaSalida: any;

    constructor() { }

    ngOnInit() {
        this.socios = [
            {
                alias: 'Norte',
                id: 1
            },
            {
                alias: 'Yagua',
                id: 2
            },
            {
                alias: 'Tijuana',
                id: 3
            }
        ]

        this.fechaSalida = new Date();
    }

}
