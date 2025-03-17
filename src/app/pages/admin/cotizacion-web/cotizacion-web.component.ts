import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoWeb } from 'app/core/models/carritoWeb.model';
import { CarritoService } from 'app/core/services/carrito.service';

@Component({
  selector: 'app-cotizacion-web',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cotizacion-web.component.html',
  styleUrl: './cotizacion-web.component.css'
})
export class CotizacionWebComponent {

  cotizacionWeb: CarritoWeb[] = [];

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ){}

  ngOnInit(): void{
    this.carritoService.allCarritoWeb().subscribe((data) => {
      console.log('data :' ,data);
      this.cotizacionWeb = data;
    })
  }

  verDetalle(carritoId: string): void {
    this.router.navigate(['/admin/cotizacion-detalle', carritoId]);
  }

}
