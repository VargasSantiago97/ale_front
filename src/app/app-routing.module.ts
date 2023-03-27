import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearOrdenTrabajoComponent } from './components/crear-orden-trabajo/crear-orden-trabajo.component';


import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { UnloginComponent } from './components/login/unlogin/unlogin.component';
import { TablasComponent } from './components/tablas/tablas.component';


const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: 'inicio', component: InicioComponent },

  { path: 'unlogin', component: UnloginComponent },
  { path: 'login', component: LoginComponent },



  { path: 'crearOrdenTrabajo', component: CrearOrdenTrabajoComponent },



  { path: 'tablas', component: TablasComponent },

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }