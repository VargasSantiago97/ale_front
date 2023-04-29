import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { SyncService } from './services/sync/sync.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'norte';
    sessionIniciada: any = false;

    esSuperUsuario: any = false;

    fechaHoraActualizacion: any = { fechaHoraActualizacion: false, fechaHoraActualizacionLarga: false, actualizado: false }

    itemsBotonSuperUser: any = [];

    constructor(
        private login: LoginService,
        private sync: SyncService,
        private router: Router
    ) { }

    ngOnInit() {
        this.login.verificarSession()
        this.sessionIniciada = this.login.sessionIniciada();
        this.esSuperUsuario = this.login.esSuperUsuario()

        this.sync.recibirVariable(this.fechaHoraActualizacion)

        this.sync.iniciarActualizacion()

        this.itemsBotonSuperUser = [
            { label: 'Control Camiones', icon: 'pi pi-cog', routerLink: ['/camiones'] },
            { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
            { separator: true },
            { label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup'] }
        ]
    }

    actualizar() {
        this.sync.obtenerDatosLocales()
    }

    routerLinkIr(ruta:any){
        this.router.navigate([ruta])
    }

}