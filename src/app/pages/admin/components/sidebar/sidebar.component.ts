import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from 'app/core/services/user.service';

interface menuSidebar{
  url: string,
  title: string,
  icon: string
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isSidebarOpen = true;

  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(
    private userService : UserService,
    private router: Router
  ){}

  menu: menuSidebar[] = [
    { url: '/admin/inicio', title: 'Inicio', icon: "fas fa-home" },
    { url: '/admin/equiposA', title: 'Equipos', icon: "fas fa-truck-monster" }
  ]

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }


}
