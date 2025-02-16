import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { CategoriaService } from 'app/core/services/categoria.service';

@Component({
  selector: 'app-edit-categoria',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './edit-categoria.component.html',
  styleUrl: './edit-categoria.component.css'
})
export class EditCategoriaComponent {

  formEditCategoria: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    public dialogRef: MatDialogRef<EditCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICategoriaP
  ) {
    this.formEditCategoria = this.formBuilder.group({
      categoria_name: ['', [Validators.required]],
      description: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.formEditCategoria.patchValue(this.data);
  }

  save(): void {
    if (this.formEditCategoria.valid) {
      const categoria: ICategoriaP = this.formEditCategoria.value;
      this.categoriaService.putCategoria(categoria, this.data.categoria_id).subscribe(
        (res) => {
          console.log("Categoria actualizada:", res);
          this.dialogRef.close(res);
        },
        (error) => {
          console.error("Error al actualizar categoria:", error);
        }
      );
    }
  }

}
