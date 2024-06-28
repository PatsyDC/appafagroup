import { Component } from '@angular/core';
import { IContacto } from 'app/core/models/contacto.model';
import { ContactoService } from 'app/core/services/contacto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  contacto: IContacto[] = [];

  constructor(
    private contactoService: ContactoService,
  ){}

  ngOnInit(): void{
    this.contactoService.allContacto().subscribe((data) => {
      console.log('data :' ,data);
      this.contacto = data;
    })
  }


}
