import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-whatsapp',
  standalone: true,
  imports: [],
  templateUrl: './chat-whatsapp.component.html',
  styleUrl: './chat-whatsapp.component.css'
})
export class ChatWhatsappComponent {

  abrirWhatsApp() {
  const numero = '51966166603';
  const mensaje = "Hola, gracias por tu mensaje. ¿Querés más información sobre los equipos de AFA Group? Estamos para ayudarte. Repuestos originales, equipos de calidad y envíos a todo el país. Escribinos y te asesoramos sin compromiso.";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

}
