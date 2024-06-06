import { Routes } from '@angular/router';
import { AboutPageComponent } from '@pages/about-page/about-page.component';
import { BlogComponent } from '@pages/blog/blog.component';
import { ContactComponent } from '@pages/contact/contact.component';
import { EquipmentListComponent } from '@pages/equipment-list/equipment-list.component';
import { FabricacionComponent } from '@pages/fabricacion/fabricacion.component';
import { HomePageComponent } from '@pages/home-page/home-page.component';
import { PartsListComponent } from '@pages/parts-list/parts-list.component';
import { ServicesComponent } from '@pages/services/services.component';
import { StoreComponent } from '@pages/store/store.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'about-us', component: AboutPageComponent },
  { path: 'parts-list', component: PartsListComponent },
  { path: 'equipment-list', component: EquipmentListComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'store', component: StoreComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'fabricacion', component: FabricacionComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, //FINALLL
];