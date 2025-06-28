import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CotizacionManual } from 'app/core/models/cotizacionManual.model';
import { CotizacionManualService } from 'app/core/services/cotizacion-manual.service';

@Component({
  selector: 'app-cotizacion-manual',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cotizacion-manual.component.html',
  styleUrl: './cotizacion-manual.component.css'
})
export class CotizacionManualComponent {

  cotizacionM: CotizacionManual[] = [];

  //Barra de busqueda
    filteredCotizacion: CotizacionManual[] = [];
    searchTerm: string = '';
    currentPage: number = 1;
    pageSize: number = 5;
    totalPages: number = 1;

  constructor(
    private cotizacionMService: CotizacionManualService,
    private router: Router,
  ){}

  ngOnInit(): void {
  this.cotizacionMService.getCotizaciones().subscribe((data: any) => {
    console.log('data :', data);
    this.cotizacionM = data.body;
    this.filteredCotizacion = [...this.cotizacionM];
    this.calculateTotalPages();
  });
}

  getCategorias() {
    this.cotizacionMService.getCotizaciones().subscribe(cotizacionM => {
      this.cotizacionM = cotizacionM;
      this.applyFilter();
    });
  }

    applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCotizacion = [...this.cotizacionM];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredCotizacion = this.cotizacionM.filter(cat =>
        cat.nombre_contacto.toLowerCase().includes(searchTermLower) ||
        cat.razon_social.toLowerCase().includes(searchTermLower)
      );
    }
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredCotizacion.length / this.pageSize);
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

  editarCotizacion(id: string): void {
  this.router.navigate(['/admin/cotizacionManual/detalle', id]);
}


}
