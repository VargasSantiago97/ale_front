import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var vars: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  CLAVE_PASS = vars.CLAVE_PASS;
  CODIGO_USER = vars.CODIGO_USER;

  esSessionIniciada: any = false;
  esSuperUser: any = false;
  esUsuario: any = '0';

  constructor(private router: Router) {}

  ngOnInit(){
    console.log('service')
  }

  verificarSession(){
    if(sessionStorage.getItem('session') == 'true'){
      this.esSessionIniciada = true

      if(sessionStorage.getItem('super') == 'true'){
        this.esSuperUser = true
      }

    } else {
      this.esSessionIniciada = false
      this.router.navigate(['login'])
    }
  }

  verificarSessionSuperUsuario(){
    if(sessionStorage.getItem('session') != 'true' || sessionStorage.getItem('super') != 'true'){
      this.router.navigate(['inicio'])
    }
  }

  sessionIniciada(){
    return this.esSessionIniciada
  }
  usuario(){
    return this.esUsuario
  }
  esSuperUsuario(){
    return this.esSuperUser
  }

  logueoClave(pass:any){
    if(pass == this.CLAVE_PASS){
      sessionStorage.setItem('session', 'true')
      localStorage.setItem('user', this.CODIGO_USER)

      if(this.CODIGO_USER == '1'){
        sessionStorage.setItem('super', "true")
      }
  
      this.esSessionIniciada = true
      this.esUsuario = this.CODIGO_USER
      window.location.reload();
    } else {
      alert('Contraseña incorrecta')
    }
  }

  cerrarSesion(){
    sessionStorage.removeItem('session')
    sessionStorage.removeItem('super')
    this.esSessionIniciada = false
    window.location.reload();
  }
}
