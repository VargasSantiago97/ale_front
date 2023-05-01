import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-pagos-emitidos',
  templateUrl: './pagos-emitidos.component.html',
  styleUrls: ['./pagos-emitidos.component.css']
})
export class PagosEmitidosComponent {

  constructor(
    private loginService : LoginService
  ){}

  ngOnInit(){
    this.loginService.verificarSessionSuperUsuario();
  }

}
