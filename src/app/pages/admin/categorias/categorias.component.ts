import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { CategoriaService } from 'app/core/services/categoria.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { EditCategoriaComponent } from './modal/edit-categoria/edit-categoria.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  readonly dialog = inject(MatDialog);

  categoria: ICategoriaP[] = [];
  formCategoria: FormGroup;

  constructor(
    private categoriaService: CategoriaService,
    private formBuilder: FormBuilder
  ){
    this.formCategoria = this.formBuilder.group({
      categoria_name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void{
    this.categoriaService.allCategorias().subscribe((data) => {
      console.log('data :' ,data);
      this.categoria = data;
    })
  }

  getCategorias() {
    this.categoriaService.allCategorias().subscribe(categoria => this.categoria = categoria);
  }

  save() {
    if (this.formCategoria.valid) {
      const value = this.formCategoria.value;
      this.categoriaService.postCategoria(value).subscribe(res => {
        if (res) {
          console.log("Categoria guardada: ", res);
          this.getCategorias();
          this.formCategoria.reset();
        }
      }, error => {
        console.error("Error al guardar categoria:", error);
      });
    }
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
