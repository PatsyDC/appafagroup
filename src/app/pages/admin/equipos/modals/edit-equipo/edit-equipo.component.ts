import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';

@Component({
  selector: 'app-edit-equipo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './edit-equipo.component.html',
  styleUrl: './edit-equipo.component.css'
})
export class EditEquipoComponent {
  formEditProducto: FormGroup;
  categorias: ICategoriaP[] = [];

  constructor(
    private equiposService: ProductosService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditEquipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProducto
  ) {
    this.formEditProducto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      img: [null],
      categoria_id: ['', [Validators.required]],
      ficha_p: [null],
      pdf: ['', [Validators.required]],
    });

    // Inicializa el formulario con los datos del producto a editar
    this.formEditProducto.patchValue({
      nombre: this.data.nombre,
      descripcion: this.data.descripcion,
      precio: this.data.precio.toString(),
      categoria_id: this.data.categoria_id.toString(),
      img: null, // Considera manejar esto adecuadamente
      ficha_p: null, // Considera manejar esto adecuadamente
      pdf: '', // Asumiendo que no necesitas actualizarlo aquí
    });
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formEditProducto.patchValue({ [controlName]: file });
    }
  }


  ngOnInit(): void {
    this.formEditProducto.patchValue(this.data);

    this.equiposService.allCategorias().subscribe((data) => {
      console.log('categorias :', data);
      this.categorias = data;
    });

    // Agregar un log para ver los valores actuales del formulario
    console.log('Form values:', this.formEditProducto.value);
  }


  save(): void {
    if (this.formEditProducto.valid) {
      const formData = new FormData();
      const equipoData = this.formEditProducto.value;

      Object.keys(equipoData).forEach(key => {
        if (key === 'img' || key === 'ficha_p') {
          const file = equipoData[key];
          if (file instanceof File) {
            formData.append(key, file, file.name);
          }
        } else {
          formData.append(key, equipoData[key]);
        }
      });

      // Usa this.data.id para obtener el ID del producto a editar
      this.equiposService.putProducto(formData, this.data.id).subscribe({
        next: (response) => {
          console.log('Producto editado exitosamente:', response);
          this.dialogRef.close(true); // Cierra el diálogo indicando éxito
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al editar el producto:', err);
        }
      });
    } else {
      console.error('Formulario inválido:', this.formEditProducto);
    }
  }






}
