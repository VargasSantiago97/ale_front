import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { SyncService } from './services/sync/sync.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'norte';
  sessionIniciada: any = false;

  constructor(
    private login: LoginService,
    private sync: SyncService
  ){}
  
  ngOnInit() {
    this.login.verificarSession()
    this.sessionIniciada = this.login.sessionIniciada();
    this.sync.iniciarActualizacion()
  }
}