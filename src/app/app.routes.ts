import { Routes } from '@angular/router';
import { AboutPageComponent } from '@pages/usuarios/about-page/about-page.component';
import { AdminComponent } from '@pages/admin/admin.component';
import { BlogComponent } from '@pages/usuarios/blog/blog.component';
import { ContactComponent } from '@pages/usuarios/contact/contact.component';
import { EquipmentListComponent } from '@pages/usuarios/equipment-list/equipment-list.component';
import { FabricacionComponent } from '@pages/usuarios/fabricacion/fabricacion.component';
import { HomePageComponent } from '@pages/usuarios/home-page/home-page.component';
import { UsuariosComponent } from '@pages/usuarios/usuarios.component';
import { InicioComponent } from '@pages/admin/inicio/inicio.component';
import { RepuestosComponent } from '@pages/admin/repuestos/repuestos.component';
import { CategoriasComponent } from '@pages/admin/categorias/categorias.component';
import { LoginComponent } from './auth/login/login.component';
import { ContactoComponent } from '@pages/admin/contacto/contacto.component';
import { ClienteComponent } from '@pages/admin/cliente/cliente.component';
import { TiendaComponent } from '@pages/usuarios/tienda/tienda.component';
import { CotizacionWebComponent } from '@pages/admin/cotizacion-web/cotizacion-web.component';
import { CotizacionDetalleComponent } from '@pages/admin/cotizacion-web/modal/cotizacion-detalle/cotizacion-detalle.component';
import { AuthGuard } from './auth/auth.guard';
import { EquipmentDetalleComponent } from '@pages/usuarios/equipment-detalle/equipment-detalle.component';
import { ServiceHomeComponent } from '@pages/usuarios/service-home/service-home.component';
import { ErrorComponent } from '@pages/error/error.component';
import { CotizacionManualComponent } from '@pages/admin/cotizacion-manual/cotizacion-manual.component';
import { CreateCotizacionComponent } from '@pages/admin/cotizacion-manual/modal/create-cotizacion/create-cotizacion.component';

export const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'about-us', component: AboutPageComponent },
      { path: 'equipment-list', component: EquipmentListComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'fabricacion', component: FabricacionComponent},
      { path: 'service-home', component: ServiceHomeComponent},
      { path: 'blog', component: BlogComponent},
      { path: 'tienda', component: TiendaComponent},
      { path: 'equipment/:id', component: EquipmentDetalleComponent}
    ],
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'categoriasA', component: CategoriasComponent },
      { path: 'repuestosA', component: RepuestosComponent },
      { path: 'contactoA', component: ContactoComponent },
      { path: 'cliente', component: ClienteComponent},
      { path: 'cotizacionWeb', component: CotizacionWebComponent},
      { path: 'cotizacion-detalle/:id', component: CotizacionDetalleComponent},
      { path: 'cotizacionManual', component: CotizacionManualComponent},
      { path: 'cotizacionManual/crear', component: CreateCotizacionComponent},
      { path: 'cotizacionManual/detalle/:id',component: CreateCotizacionComponent}
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: ErrorComponent },
];
