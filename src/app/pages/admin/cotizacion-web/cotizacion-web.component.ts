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
  estadosCotizacion: {[key: string]: boolean} = {};

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ){}

  ngOnInit(): void {
    // Primero cargamos todos los carritos
    this.carritoService.allCarritoWeb().subscribe((data) => {
      console.log('Carritos web:', data);
      this.cotizacionWeb = data;

      // Ahora buscamos qué carritos tienen cotización
      this.verificarCotizaciones();
    });
  }

  verificarCotizaciones(): void {
    // Obtenemos todas las cotizaciones
    this.carritoService.contarCotizaciones().subscribe((cotizaciones) => {
      console.log('Cotizaciones:', cotizaciones);

      // Por cada carrito, verificamos si tiene cotización
      this.cotizacionWeb.forEach(carrito => {
        const tieneCotizacion = cotizaciones.some(c => String(c.carrito_id) === String(carrito.carrito_id));
        this.estadosCotizacion[carrito.carrito_id] = tieneCotizacion;
      });
    });
  }

  getEstadoText(carritoId: string): string {
    return this.estadosCotizacion[carritoId] ? 'Cotizado' : 'Pendiente';
  }

  getEstadoClass(carritoId: string): string {
    return this.estadosCotizacion[carritoId] ? 'estado-cotizado' : 'estado-pendiente';
  }

  verDetalle(carritoId: string): void {
    this.router.navigate(['/admin/cotizacion-detalle', carritoId]);
  }

}
