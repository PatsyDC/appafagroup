import { Routes } from '@angular/router';
import { AboutPageComponent } from '@pages/usuarios/about-page/about-page.component';
import { AdminComponent } from '@pages/admin/admin.component';
import { ArticuloComponent } from '@pages/usuarios/articulo/articulo.component';
import { BlogComponent } from '@pages/usuarios/blog/blog.component';
import { ContactComponent } from '@pages/usuarios/contact/contact.component';
import { DetalleRComponent } from '@pages/usuarios/detalle-r/detalle-r.component';
import { EquipmentListComponent } from '@pages/usuarios/equipment-list/equipment-list.component';
import { FabricacionComponent } from '@pages/usuarios/fabricacion/fabricacion.component';
import { HomePageComponent } from '@pages/usuarios/home-page/home-page.component';
import { ServicesComponent } from '@pages/usuarios/services/services.component';
import { UsuariosComponent } from '@pages/usuarios/usuarios.component';
import { InicioComponent } from '@pages/admin/inicio/inicio.component';
import { RepuestosComponent } from '@pages/admin/repuestos/repuestos.component';
import { CategoriasComponent } from '@pages/admin/categorias/categorias.component';
import { LoginComponent } from './auth/login/login.component';
import { ContactoComponent } from '@pages/admin/contacto/contacto.component';
import { NoticiaComponent } from '@pages/admin/noticia/noticia.component';
import { AuthGuard } from './auth.guard';
import { ClienteComponent } from '@pages/admin/cliente/cliente.component';
import { TiendaComponent } from '@pages/usuarios/tienda/tienda.component';
import { CotizacionWebComponent } from '@pages/admin/cotizacion-web/cotizacion-web.component';
import { CotizacionDetalleComponent } from '@pages/admin/cotizacion-web/modal/cotizacion-detalle/cotizacion-detalle.component';

export const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'about-us', component: AboutPageComponent },
      { path: 'equipment-list', component: EquipmentListComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'articulo', component: BlogComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'fabricacion', component: FabricacionComponent}, // Asegúrate de tener el componente correcto aquí
      { path: 'detalleRepuesto/:id', component: DetalleRComponent},
      { path: 'blog', component: ArticuloComponent},
      { path: 'tienda', component: TiendaComponent}
    ],
  },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'categoriasA', component: CategoriasComponent },
      { path: 'repuestosA', component: RepuestosComponent },
      { path: 'contactoA', component: ContactoComponent },
      { path: 'noticiaA', component: NoticiaComponent },
      { path: 'cliente', component: ClienteComponent},
      { path: 'cotizacionWeb', component: CotizacionWebComponent},
      {
        path: 'cotizacion-detalle/:id',
        component: CotizacionDetalleComponent
      }
    ]
  },
  // { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: '/login', pathMatch: 'full' }, // Redirige al login si la ruta no es válida
];
