import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IRepuesto } from 'app/core/models/repuesto.model';
import { RepuestoService } from 'app/core/services/repuesto.service';

@Component({
  selector: 'app-edit-repuesto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-repuesto.component.html',
  styleUrl: './edit-repuesto.component.css'
})
export class EditRepuestoComponent {
  formEditRepuesto: FormGroup;
  categorias: ICategoriaP[] = [];

  constructor(
    private equiposService: RepuestoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditRepuestoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRepuesto
  ) {
    this.formEditRepuesto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      img: [null],
      categoria_id: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
    });

    // Inicializa el formulario con los datos del producto a editar
    this.formEditRepuesto.patchValue({
      nombre: this.data.nombre,
      descripcion: this.data.descripcion,
      precio: this.data.precio,
      img: null, // Asegúrate de manejar esto adecuadamente
      categoria_id: this.data.categoria_id,
      codigo: this.data.codigo,
    });

  }

  ngOnInit(): void {
    this.formEditRepuesto.patchValue(this.data);

    this.equiposService.allCategorias().subscribe((data) => {
      console.log('categorias :', data);
      this.categorias = data;
    });
  }


onFileChange(event: Event, controlName: string): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.formEditRepuesto.patchValue({ [controlName]: file });
  }
}

save(): void {
  if (this.formEditRepuesto.valid) {
    const formData = new FormData();
    const repuestoData = this.formEditRepuesto.value;

    Object.keys(repuestoData).forEach(key => {
      if (key === 'img' && repuestoData[key] instanceof File) {
        formData.append(key, repuestoData[key], repuestoData[key].name);
      } else {
        formData.append(key, repuestoData[key]);
      }
    });

    this.equiposService.putRepuesto(formData, this.data.id).subscribe({
      next: (response) => {
        console.log('Producto editado exitosamente:', response);
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al editar el producto:', err);
      }
    });
  } else {
    console.error('Formulario inválido:', this.formEditRepuesto);
  }
}


}
