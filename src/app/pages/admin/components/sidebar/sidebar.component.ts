import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface menuSidebar{
  url: string,
  title: string,
  icon: string
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgClass, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  menu: menuSidebar[] = [
    {url: '/admin/inicio', title: 'Inicio', icon: "fa fa-"},
    {url: '/admin/equiposA', title: 'Equipos', icon: "fa fa-"}
  ]

}
