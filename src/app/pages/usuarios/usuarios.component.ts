import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@components/footer/footer.component';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { ChatWhatsappComponent } from "../../components/chat-whatsapp/chat-whatsapp.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ChatWhatsappComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

}
