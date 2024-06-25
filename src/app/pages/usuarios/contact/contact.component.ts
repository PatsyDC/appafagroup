import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMap, MapHeatmapLayer } from '@angular/google-maps';
import { Router } from '@angular/router';
import { IContacto } from 'app/core/models/contacto.model';
import { ContactoService } from 'app/core/services/contacto.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [GoogleMap, MapHeatmapLayer, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, OnDestroy{

  contacto: IContacto = {
    id: 0,
    nombre: '',
    email: '',
    celular: '',
    ciudad: '',
    mensaje: ''
  };
  formContacto: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private contactoService: ContactoService,
    private router: Router,
  ){
    this.formContacto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  center = {lat: -8.1487078, lng: -79.040944};
  zoom = 15;
  heatmapOptions = {radius: 15};
  heatmapData = [
    {lat: -8.1487078, lng: -79.040944},
    {lat: -8.1714148, lng: -79.008936},
    {lat: -6.7714616, lng: -79.8387175},
    {lat: -6.034721374511719, lng: -76.97469329833984},
    {lat: -12.0621065, lng: -77.0365256},
  ];

  setCenter(lat: number, lng: number) {
    this.center = {lat, lng};
  }

  save(): void {
    if (this.formContacto.valid) {
      const value = this.formContacto.value;
      this.contacto = this.formContacto.value;
      this.contactoService.saveContacto(this.contacto).subscribe(res => {
        if (res) {
          console.log("Mensaje guardado: ", res);
          alert("Envío exitoso");
          this.formContacto.reset(); // Limpiar el formulario después de éxito
        }
      }, error => {
        console.error("Error al enviar:", error);
      });
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  }

}
