import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { IContacto } from 'app/core/models/contacto.model';
import { ContactoService } from 'app/core/services/contacto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [], // Remueve 'imports' de aquí, no es necesario ni válido en el decorador @Component
  providers: [DatePipe], // Mantén DatePipe en providers si realmente quieres instanciarlo solo para este componente
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'] // Cambia 'styleUrl' a 'styleUrls' para soportar múltiples archivos CSS
})
export class ContactoComponent {

  contacto: IContacto[] = [];

  constructor(
    private contactoService: ContactoService,
    private datePipe: DatePipe // Inyecta DatePipe aquí
  ){}

  ngOnInit(): void{
    this.contactoService.allContacto().subscribe((data) => {
      console.log('data :' ,data);
      this.contacto = data;
    })
  }

  formatDate(date: Date): string { // Función para formatear fechas
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    return formattedDate ? formattedDate : ''; // Retorna una cadena vacía si transform retorna null
  }
}
