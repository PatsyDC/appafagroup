// routes.ts

import { Routes } from '@angular/router';
import { AboutPageComponent } from '@pages/usuarios/about-page/about-page.component';
import { AdminComponent } from '@pages/admin/admin.component';
import { EquiposComponent } from '@pages/admin/equipos/equipos.component';
import { ArticuloComponent } from '@pages/usuarios/articulo/articulo.component';
import { BlogComponent } from '@pages/usuarios/blog/blog.component';
import { CarritoComponent } from '@pages/usuarios/carrito/carrito.component';
import { ContactComponent } from '@pages/usuarios/contact/contact.component';
import { DetallePComponent } from '@pages/usuarios/detalle-p/detalle-p.component';
import { DetalleRComponent } from '@pages/usuarios/detalle-r/detalle-r.component';
import { EquipmentListComponent } from '@pages/usuarios/equipment-list/equipment-list.component';
import { FabricacionComponent } from '@pages/usuarios/fabricacion/fabricacion.component';
import { HomePageComponent } from '@pages/usuarios/home-page/home-page.component';
import { PartsListComponent } from '@pages/usuarios/parts-list/parts-list.component';
import { ServicesComponent } from '@pages/usuarios/services/services.component';
import { StoreComponent } from '@pages/usuarios/store/store.component';
import { UsuariosComponent } from '@pages/usuarios/usuarios.component';
import { InicioComponent } from '@pages/admin/inicio/inicio.component';
import { RepuestosComponent } from '@pages/admin/repuestos/repuestos.component';
import { CategoriasComponent } from '@pages/admin/categorias/categorias.component';
import { TiendaComponent } from '@pages/admin/tienda/tienda.component';
import { LoginComponent } from './auth/login/login.component';
import { ContactoComponent } from '@pages/admin/contacto/contacto.component';
import { NoticiaComponent } from '@pages/admin/noticia/noticia.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'about-us', component: AboutPageComponent },
      { path: 'parts-list', component: PartsListComponent },
      { path: 'equipment-list', component: EquipmentListComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'store', component: StoreComponent },
      { path: 'articulo', component: BlogComponent },
      { path: 'contact', component: ContactComponent },
      { path:'detalle/:id', component: DetallePComponent},
      { path: 'carrito', component: CarritoComponent},
      { path: 'fabricacion', component: FabricacionComponent}, // Asegúrate de tener el componente correcto aquí
      { path: 'detalleRepuesto/:id', component: DetalleRComponent},
      { path: 'blog', component: ArticuloComponent},
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
      { path: 'equiposA', component: EquiposComponent },
      { path: 'tiendaA', component: TiendaComponent },
      { path: 'contactoA', component: ContactoComponent },
      { path: 'noticiaA', component: NoticiaComponent },
    ]
  },
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: '/login', pathMatch: 'full' }, // Redirige al login si la ruta no es válida
];
