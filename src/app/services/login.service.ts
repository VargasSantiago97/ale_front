import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

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
    if(pass == 'ale1'){
      sessionStorage.setItem('session', 'true')
      localStorage.setItem('user', '10')
      this.esSessionIniciada = true
      this.esUsuario = '10'
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
