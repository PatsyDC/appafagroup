import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoWeb } from 'app/core/models/carritoWeb.model';
import { CarritoService } from 'app/core/services/carrito.service';

@Component({
  selector: 'app-cotizacion-web',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cotizacion-web.component.html',
  styleUrl: './cotizacion-web.component.css'
})
export class CotizacionWebComponent {

  cotizacionWeb: CarritoWeb[] = [];
  estadosCotizacion: {[key: string]: boolean} = {};
  filteredCarrito: CarritoWeb[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ){}

  ngOnInit(): void {
    // Primero cargamos todos los carritos
    this.carritoService.allCarritoWeb().subscribe((data) => {
      console.log('Carritos web:', data);
      this.cotizacionWeb = data;
      this.filteredCarrito = [...this.cotizacionWeb];
      // Ahora buscamos qué carritos tienen cotización
      this.calculateTotalPages();
      this.verificarCotizaciones();
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCarrito = [...this.cotizacionWeb];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredCarrito = this.cotizacionWeb.filter(cat =>
        cat.empresa.toLowerCase().includes(searchTermLower) ||
        cat.nombre.toLowerCase().includes(searchTermLower)
      );
    }
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredCarrito.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Si hay menos páginas que el máximo visible, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas alrededor de la actual
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      // Ajustar si estamos cerca del final
      if (end === this.totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  }

  get paginatedCarrito(): CarritoWeb[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredCarrito.slice(startIndex, endIndex);
  }

  trackByIndex(index: number, item: CarritoWeb): number {
    return index;
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
