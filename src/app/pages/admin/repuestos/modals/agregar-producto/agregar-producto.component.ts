import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { ProductoAGService } from 'app/core/services/productoAG.service';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent {

  readonly dialog = inject(MatDialog);

  producto: IProductoAG[] = [];
  categorias: ICategoriaP[] = [];
  formP: FormGroup;
  selectedFile: File | null = null;

    constructor(
      private service: ProductoAGService,
      private formBuilder: FormBuilder
    ) {
      this.formP = this.formBuilder.group({
        categoria_id: ['', [Validators.required]],
        nombre_producto: ['', [Validators.required]],
        codigo_sunat: ['', [Validators.required]],
        tipo_producto:['', [Validators.required]],
        tipo_existencia: ['', [Validators.required]],
        compra: ['', [Validators.required]],
        kardex: ['', [Validators.required]],
        nombre_comercial: ['', [Validators.required]],
        stock_minimo: [0, [Validators.required]],
        stock_maximo: [0, [Validators.required]],
        peso: [0, [Validators.required]],
        imagen_url: [null]
      });
    }

    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0] as File;
    }

    isFormValid(): boolean {
      return this.formP.valid && this.selectedFile !== null;
    }

    save() {
      if (this.formP.valid && this.selectedFile) {
        const formData = new FormData();

        // Agregar los valores del formulario al FormData
        formData.append('categoria_id', this.formP.get('categoria_id')?.value || '');
        formData.append('nombre_producto', this.formP.get('nombre_producto')?.value || '');
        formData.append('codigo_sunat', this.formP.get('codigo_sunat')?.value || '');
        formData.append('tipo_producto', this.formP.get('tipo_producto')?.value || '');
        formData.append('tipo_existencia', this.formP.get('tipo_existencia')?.value || '');
        formData.append('compra', this.formP.get('compra')?.value || '');
        formData.append('kardex', this.formP.get('kardex')?.value || '');
        formData.append('nombre_comercial', this.formP.get('nombre_comercial')?.value || '');
        formData.append('stock_minimo', this.formP.get('stock_minimo')?.value || '');
        formData.append('stock_maximo', this.formP.get('stock_maximo')?.value || '');
        formData.append('peso', this.formP.get('peso')?.value || '');

        // Agregar la imagen al FormData
        formData.append('imagen_url', this.selectedFile, this.selectedFile.name);

        // Mostrar los datos en consola usando formData.forEach
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });

        this.service.postProducto(formData).subscribe(
          res => {
            console.log("Producto creado correctamente:", res);
            this.formP.reset();
            this.selectedFile = null; // Restablecer la imagen seleccionada
          },
          error => {
            console.error('Error al crear el producto:', error);
          }
        );
      } else {
        console.warn("Formulario inválido o falta la imagen.");
      }
    }

    cancelar() {
      // Lógica para cancelar la acción
      this.formP.reset(); // Esto limpia el formulario
    }
}
