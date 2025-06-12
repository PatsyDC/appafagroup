import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMap, MapHeatmapLayer } from '@angular/google-maps';
import { IContacto } from 'app/core/models/contacto.model';
import { ContactoService } from 'app/core/services/contacto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [GoogleMap, MapHeatmapLayer, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  contacto: IContacto[] = [];
  formContacto: FormGroup;
  // Dimensiones responsive del mapa
  mapWidth: string = '800px';
  mapHeight: string = '400px';

  constructor(
    private formBuilder: FormBuilder,
    private contactoService: ContactoService,
  ){
    this.formContacto = this.formBuilder.group({
      nombre_usuario: ['', [Validators.required]],
      correo_usuario: ['', [Validators.required]],
      numero_usuario: ['', [Validators.required]],
      ciudad_usuario: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });
  }

  center = {lat: -8.1487078, lng: -79.040944};
  zoom = 15;
  heatmapOptions = {radius: 15};
  heatmapData = [
    {lat: -8.1215553, lng: -79.028494},
    {lat: -8.157510, lng: -79.011420},
    {lat: -6.827070, lng: -79.829150},
    {lat: -14.025890, lng: -75.760060},
    {lat: -12.07138, lng: -77.03713},
  ];

  setCenter(lat: number, lng: number) {
    this.center = {lat, lng};
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateMapDimensions();
  }

  updateMapDimensions() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 420) {
      // Móviles muy pequeños
      this.mapWidth = '100%';
      this.mapHeight = '200px';
    } else if (screenWidth <= 576) {
      // Móviles
      this.mapWidth = '100%';
      this.mapHeight = '250px';
    } else if (screenWidth <= 768) {
      // Tablets pequeñas
      this.mapWidth = '100%';
      this.mapHeight = '280px';
    } else if (screenWidth <= 992) {
      // Tablets
      this.mapWidth = '100%';
      this.mapHeight = '300px';
    } else if (screenWidth <= 1024) {
      // Tablets grandes
      this.mapWidth = '100%';
      this.mapHeight = '350px';
    } else {
      // Desktop
      this.mapWidth = '800px';
      this.mapHeight = '400px';
    }
  }

  save() {
    if (this.formContacto.valid) {
      const value = this.formContacto.value;
      value.fecha = new Date();
      this.contactoService.saveContacto(value).subscribe(res => {
        if (res) {
          console.log("Categoria guardada: ", res);
          this.formContacto.reset();
           Swal.fire( // Muestra la alerta
              'Éxito!',
              'Se envió el mensaje correctamente',
              'success'
            );
        }
      }, error => {
        console.error("Error al guardar categoria:", error);
        Swal.fire( // Muestra la alerta
          'Error!',
          'Hubo un problema al enviar mensaje',
          'error'
        );
      });
    }
  }

}
