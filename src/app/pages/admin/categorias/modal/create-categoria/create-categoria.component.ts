import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { CategoriaService } from 'app/core/services/categoria.service';

@Component({
  selector: 'app-create-categoria',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './create-categoria.component.html',
  styleUrl: './create-categoria.component.css'
})
export class CreateCategoriaComponent {

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

    save() {
      if (this.formCategoria.valid) {
        const value = this.formCategoria.value;
        this.categoriaService.postCategoria(value).subscribe(res => {
          if (res) {
            console.log("Categoria guardada: ", res);
            this.formCategoria.reset();
          }
        }, error => {
          console.error("Error al guardar categoria:", error);
        });
      }
    }

}
