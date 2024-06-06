import { Component, inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select'; // Importa MatSelectModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importa MatFormFieldModule
import { MatButtonModule } from '@angular/material/button'; // Importa MatButtonModule si vas a usar botones de Angular Material
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  selectedService?: string;

  private router = inject(Router)

  services = [
    { value: 'fabricacion', viewValue: 'Fabricación' },
    { value: 'servicio-mecanico', viewValue: 'Servicio Mecánico' },
    { value: 'afarental', viewValue: 'AFA Rental' },
    { value: 'afaconsultoria', viewValue: 'AFA Consultoria' },
    { value: 'afaserviciopostventa', viewValue: 'AFA Servicio Post Venta' },
    { value: 'afacreditos', viewValue: 'AFA Créditos' },
  ];

  onSelectionChange(service: any) {
    this.selectedService = service.value;
    // Aquí puedes agregar la lógica que necesites cuando se selecciona un servicio
    console.log(`Selected service: ${service.viewValue}`);
    // Por ejemplo, podrías navegar a una ruta específica basada en el servicio seleccionado
    this.router.navigate([`/${service.value}`]);
  }
}
