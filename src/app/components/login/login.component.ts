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

}
