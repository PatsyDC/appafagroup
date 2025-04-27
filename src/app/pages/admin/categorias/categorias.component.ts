import { Component, inject } from '@angular/core';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { CategoriaService } from 'app/core/services/categoria.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { EditCategoriaComponent } from './modal/edit-categoria/edit-categoria.component';
import { CreateCategoriaComponent } from './modal/create-categoria/create-categoria.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [MatDialogModule, FormsModule, CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  readonly dialog = inject(MatDialog);

  categoria: ICategoriaP[] = [];

  //Barra de busqueda
  filteredCategorias: ICategoriaP[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private categoriaService: CategoriaService,
  ){}

  ngOnInit(): void{
    this.categoriaService.allCategorias().subscribe((data) => {
      console.log('data :' ,data);
      this.categoria = data;
      this.filteredCategorias = [...this.categoria];
      this.calculateTotalPages();
    })
  }

  getCategorias() {
    this.categoriaService.allCategorias().subscribe(categoria => {
      this.categoria = categoria;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategorias = [...this.categoria];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredCategorias = this.categoria.filter(cat =>
        cat.categoria_name.toLowerCase().includes(searchTermLower) ||
        cat.description.toLowerCase().includes(searchTermLower)
      );
    }
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredCategorias.length / this.pageSize);
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

  openDialogEdit(categoria: ICategoriaP) {
    const dialogRefEdit = this.dialog.open(EditCategoriaComponent, {
      data: categoria
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.getCategorias();
      }
    });
  }
  openDialogCreate(): void {
    const dialogRefCreate = this.dialog.open(CreateCategoriaComponent);

    dialogRefCreate.afterClosed().subscribe(result => {
      if (result) {
        this.getCategorias();
      }
    });
  }

  deleteCategoria(id: number) {
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar esta categoría?',
      text: "Una vez eliminada, no podrás recuperarla.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCategoria(id).subscribe(
          () => {
            console.log('Categoría eliminado correctamente');
            this.getCategorias();
          },
          error => {
            console.error('Error al eliminar el sondeo:', error);
          }
        );
      }
    });
  }

}
