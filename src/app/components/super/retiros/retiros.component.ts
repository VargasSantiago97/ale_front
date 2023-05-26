import { Component } from '@angular/core';

@Component({
  selector: 'app-retiros',
  templateUrl: './retiros.component.html',
  styleUrls: ['./retiros.component.css']
})
export class RetirosComponent {

  images: string[] = [];

  datos_filtrar_granos:any = [
    {
      alias: "1",
      id: "./assets/prueba/1.png"
    },
    {
      alias: "2",
      id: "./assets/prueba/2.png"
    },
    {
      alias: "3",
      id: "./assets/prueba/3.png"
    },
  ]

}
