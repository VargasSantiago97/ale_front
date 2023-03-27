import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-unlogin',
  templateUrl: './unlogin.component.html',
  styleUrls: ['./unlogin.component.css']
})
export class UnloginComponent {

  constructor(private login: LoginService){}

  ngOnInit(){
    this.login.cerrarSesion()
  }

}
