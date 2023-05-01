import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//PRIMENG
import {ButtonModule} from 'primeng/button';
import {MenubarModule} from 'primeng/menubar';
import {TableModule} from 'primeng/table';
import {FileUploadModule} from 'primeng/fileupload';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {BadgeModule} from 'primeng/badge';
import {TagModule} from 'primeng/tag';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SelectButtonModule} from 'primeng/selectbutton';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {DividerModule} from 'primeng/divider';
import {ChartModule} from 'primeng/chart';
import {CalendarModule} from 'primeng/calendar';
import {ChipsModule} from 'primeng/chips';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MultiSelectModule} from 'primeng/multiselect';
import {ListboxModule} from 'primeng/listbox';
import {SplitterModule} from 'primeng/splitter';
import {KnobModule} from 'primeng/knob';
import {TreeModule} from 'primeng/tree';
import {CardModule} from 'primeng/card';
import {DockModule} from 'primeng/dock';
import {ContextMenuModule} from 'primeng/contextmenu';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {PasswordModule} from 'primeng/password';
import {AvatarModule} from 'primeng/avatar';
import {SpeedDialModule} from 'primeng/speeddial';
import {TabViewModule} from 'primeng/tabview';
import {AccordionModule} from 'primeng/accordion';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {ColorPickerModule} from 'primeng/colorpicker';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ScrollerModule} from 'primeng/scroller';
import {SplitButtonModule} from 'primeng/splitbutton';






import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { CrearOrdenTrabajoComponent } from './components/crear-orden-trabajo/crear-orden-trabajo.component';
import { NuevoViajeComponent } from './components/modals/nuevo-viaje/nuevo-viaje.component';
import { TablasComponent } from './components/tablas/tablas.component';
import { GranosComponent } from './components/tablas/granos/granos.component';
import { CampanasComponent } from './components/tablas/campanas/campanas.component';
import { SociosComponent } from './components/tablas/socios/socios.component';
import { EstablecimientosComponent } from './components/tablas/establecimientos/establecimientos.component';
import { DepositosComponent } from './components/tablas/depositos/depositos.component';
import { CondicionIvaComponent } from './components/tablas/condicion-iva/condicion-iva.component';
import { GastosComponent } from './components/tablas/gastos/gastos.component';
import { UnloginComponent } from './components/login/unlogin/unlogin.component';
import { TransportistasComponent } from './components/transportistas/transportistas.component';
import { IntervinientesComponent } from './components/intervinientes/intervinientes.component';
import { CuentasCorrientesComponent } from './components/cuentas-corrientes/cuentas-corrientes.component';
import { CamionesComponent } from './components/super/camiones/camiones.component';
import { PagosEmitidosComponent } from './components/super/pagos-emitidos/pagos-emitidos.component';



@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    CrearOrdenTrabajoComponent,
    NuevoViajeComponent,
    TablasComponent,
    GranosComponent,
    CampanasComponent,
    SociosComponent,
    EstablecimientosComponent,
    DepositosComponent,
    CondicionIvaComponent,
    GastosComponent,
    UnloginComponent,
    TransportistasComponent,
    IntervinientesComponent,
    CuentasCorrientesComponent,
    CamionesComponent,
    PagosEmitidosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    //PRIMENG
    ButtonModule,
    MenubarModule,
    TableModule,
    FileUploadModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    BadgeModule,
    TagModule,
    DialogModule,
    BrowserAnimationsModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    CascadeSelectModule,
    DividerModule,
    ChartModule,
    CalendarModule,
    ChipsModule,
    AutoCompleteModule,
    MultiSelectModule,
    ListboxModule,
    SplitterModule,
    KnobModule,
    TreeModule,
    CardModule,
    DockModule,
    ContextMenuModule,
    ToastModule,
    PasswordModule,
    AvatarModule,
    SpeedDialModule,
    TabViewModule,
    AccordionModule,
    DropdownModule,
    InputNumberModule,
    ColorPickerModule,
    InputTextareaModule,
    ScrollerModule,
    SplitButtonModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }