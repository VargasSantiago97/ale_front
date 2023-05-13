import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearOrdenTrabajoComponent } from './components/crear-orden-trabajo/crear-orden-trabajo.component';

import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { UnloginComponent } from './components/login/unlogin/unlogin.component';
import { TablasComponent } from './components/tablas/tablas.component';
import { TransportistasComponent } from './components/transportistas/transportistas.component';
import { IntervinientesComponent } from './components/intervinientes/intervinientes.component';
import { CuentasCorrientesComponent } from './components/cuentas-corrientes/cuentas-corrientes.component';
import { CamionesComponent } from './components/super/camiones/camiones.component';
import { PagosEmitidosComponent } from './components/super/pagos-emitidos/pagos-emitidos.component';
import { ResumenCuentasComponent } from './components/super/resumen-cuentas/resumen-cuentas.component';
import { PrepararPagosComponent } from './components/super/preparar-pagos/preparar-pagos.component';
import { ActualizarCPEComponent } from './components/super/actualizar-cpe/actualizar-cpe.component';
import { CamposComponent } from './components/super/campos/campos.component';
import { ContratosComponent } from './components/super/contratos/contratos.component';


const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'transportistas', component: TransportistasComponent },


    { path: 'unlogin', component: UnloginComponent },
    { path: 'login', component: LoginComponent },

    { path: 'crearOrdenTrabajo', component: CrearOrdenTrabajoComponent },

    { path: 'tablas', component: TablasComponent },
    { path: 'intervinientes', component: IntervinientesComponent },
    { path: 'ctasctes', component: CuentasCorrientesComponent },



    //superUser
    { path: 'camiones', component: CamionesComponent },
    { path: 'pagosEmitidos', component: PagosEmitidosComponent },
    { path: 'resumenCuentas', component: ResumenCuentasComponent },

    { path: 'prepararPagos', component: PrepararPagosComponent },
    { path: 'actualizarCPE', component: ActualizarCPEComponent },

    { path: 'campos', component: CamposComponent },
    { path: 'contratos', component: ContratosComponent },

];



@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }