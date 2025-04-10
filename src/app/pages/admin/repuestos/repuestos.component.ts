import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { AgregarProductoComponent } from './modals/agregar-producto/agregar-producto.component';
import { CategoriaService } from 'app/core/services/categoria.service';
import { EditRepuestoComponent } from './modals/edit-repuesto/edit-repuesto.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repuestos',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, FormsModule, CommonModule],
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent {

  readonly dialog = inject(MatDialog);

  producto: IProductoAG[] = [];
  categorias: ICategoriaP[] = [];

  //Barra de busqueda
  filteredProducto: IProductoAG[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private service: ProductoAGService,
    private serviceCategoria: CategoriaService) {}

  ngOnInit(): void {
    this.service.allProductos().subscribe((data) => {
      console.log('data :' ,data);
      this.producto = data;
      this.applyFilter();
    });

    this.serviceCategoria.allCategorias().subscribe((data) => {
      console.log('Categorías:', data);
      this.categorias = data;
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducto = [...this.producto];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredProducto = this.producto.filter(cat =>
        cat.nombre_producto.toLowerCase().includes(searchTermLower) ||
        cat.nombre_comercial.toLowerCase().includes(searchTermLower)
      );
    }
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducto.length / this.pageSize);
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

  getCategoriaNombre(categoria_id: number): string {
    const categoria = this.categorias.find(cat => cat.categoria_id === categoria_id);
    return categoria ? categoria.categoria_name : 'Desconocido';
  }

  openDialogAdd(): void{
    const dialogReAdd = this.dialog.open(AgregarProductoComponent);

    dialogReAdd.afterClosed().subscribe(result => {
      if(result){
        this.ngOnInit();
      }
    });
  }

  onDelete(producto_id: number): void {
    this.service.deleteProducto(producto_id).subscribe({
      next: () => {
        this.ngOnInit(); // Recarga los datos después de eliminar
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
      }
    });
  }

  openDialogEdit(repuesto: IProductoAG) {
    const dialogRefEdit = this.dialog.open(EditRepuestoComponent, {
      data: repuesto
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

}
