import { Component, inject } from '@angular/core';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { CategoriaService } from 'app/core/services/categoria.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { EditCategoriaComponent } from './modal/edit-categoria/edit-categoria.component';
import { CreateCategoriaComponent } from './modal/create-categoria/create-categoria.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  readonly dialog = inject(MatDialog);

  categoria: ICategoriaP[] = [];

  constructor(
    private categoriaService: CategoriaService,
  ){}

  ngOnInit(): void{
    this.categoriaService.allCategorias().subscribe((data) => {
      console.log('data :' ,data);
      this.categoria = data;
    })
  }

  getCategorias() {
    this.categoriaService.allCategorias().subscribe(categoria => this.categoria = categoria);
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
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.categoriaService.deleteCategoria(id).subscribe(
        () => {
          console.log('Usuario eliminado correctamente');
          this.getCategorias(); // Recargar la lista después de eliminar
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }

}
