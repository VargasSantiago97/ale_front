import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearOrdenTrabajoComponent } from './components/crear-orden-trabajo/crear-orden-trabajo.component';


import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { UnloginComponent } from './components/login/unlogin/unlogin.component';
import { TablasComponent } from './components/tablas/tablas.component';
import { TransportistasComponent } from './components/transportistas/transportistas.component';
import { IntervinientesComponent } from './components/intervinientes/intervinientes.component';


const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: 'inicio', component: InicioComponent },
  { path: 'transportistas', component: TransportistasComponent },


  { path: 'unlogin', component: UnloginComponent },
  { path: 'login', component: LoginComponent },



  { path: 'crearOrdenTrabajo', component: CrearOrdenTrabajoComponent },



  { path: 'tablas', component: TablasComponent },
  { path: 'intervinientes', component: IntervinientesComponent },

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }