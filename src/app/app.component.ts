import { Component } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'norte';
  sessionIniciada: any = false;

  constructor(private login: LoginService){}
  
  ngOnInit() {
    this.login.verificarSession()
    this.sessionIniciada = this.login.sessionIniciada();
  }
}