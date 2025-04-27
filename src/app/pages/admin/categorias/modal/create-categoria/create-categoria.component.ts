import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { CategoriaService } from 'app/core/services/categoria.service';
import Swal from 'sweetalert2';

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
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoriaComponent>
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
            this.dialogRef.close(res);
            Swal.fire( // Muestra la alerta
              'Éxito!',
              'El registro se guardó correctamente.',
              'success'
            );
          }
        }, error => {
          console.error("Error al guardar categoria:", error);
          Swal.fire( // Muestra la alerta
            'Error!',
            'Hubo un problema al guardar el registro.',
            'error'
          );
        });
      }
    }

  closeDialog() {
    this.dialogRef.close();
  }

}
