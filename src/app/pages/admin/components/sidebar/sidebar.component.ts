import { CommonModule, NgClass } from '@angular/common';
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
  imports: [RouterLink, RouterLinkActive, NgClass, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isSidebarOpen = true;
  userName: string = '';
  role: string = '';

  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(
    private userService : UserService,
    private router: Router
  ){}

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.userName = user.user_name;
      this.role = user.role;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
