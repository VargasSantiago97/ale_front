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
  esUsuario: any = '0';

  constructor(private router: Router) {}

  ngOnInit(){
    console.log('service')
  }

  verificarSession(){
    if(sessionStorage.getItem('session') == 'true'){
      this.esSessionIniciada = true
    } else {
      this.esSessionIniciada = false
      this.router.navigate(['login'])
    }
  }

  sessionIniciada(){
    return this.esSessionIniciada
  }
  usuario(){
    return this.esUsuario
  }

  logueoClave(pass:any){
    if(pass == this.CLAVE_PASS){
      sessionStorage.setItem('session', 'true')
      localStorage.setItem('user', this.CODIGO_USER)
      this.esSessionIniciada = true
      this.esUsuario = this.CODIGO_USER
      window.location.reload();
    } else {
      alert('Contraseña incorrecta')
    }
  }

  cerrarSesion(){
    sessionStorage.removeItem('session')
    this.esSessionIniciada = false
    window.location.reload();
  }
}
