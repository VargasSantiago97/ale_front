import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

declare var vars: any;
const messageBienvenida = vars.messageBienvenida;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPass:any;
  pass:any = ''

  messageBienvenida: any = messageBienvenida;

  intentos:any =0;

  constructor(private login: LoginService, private router: Router){}

  ngOnInit(){
    this.pass = localStorage.getItem('pass')
    if(this.login.sessionIniciada()){
      this.router.navigate([''])
    }
  }

  intentoLogueo(){
    this.login.logueoClave(this.pass)
  }
  
  guardarPass(){
    this.intentos += 1;
    if(this.intentos > 10){
      if(confirm('Guardar clave en LocalStorage?')){
        localStorage.setItem('pass', this.pass)
      }
    }
  }
}
