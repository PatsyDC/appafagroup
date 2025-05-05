import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { CategoriaService } from 'app/core/services/categoria.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, CommonModule],
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
      private formBuilder: FormBuilder,
      private categoriaService: CategoriaService,
      private dialogRef: MatDialogRef<AgregarProductoComponent>
    ) {
      this.formP = this.formBuilder.group({
        categoria_id: ['', [Validators.required]],
        nombre_producto: ['', [Validators.required]],
        descripcion_producto: ['', [Validators.required]],
        codigo_sunat: ['', [Validators.required]],
        tipo_producto:['', [Validators.required]],
        tipo_existencia: ['', [Validators.required]],
        compra: ['', [Validators.required]],
        kardex: ['', [Validators.required]],
        nombre_comercial: ['', [Validators.required]],
        stock_actual: [0, [Validators.required]],
        stock_minimo: [0, [Validators.required]],
        stock_maximo: [0, [Validators.required]],
        peso: [0, [Validators.required]],
        imagen_url: [null],
        precio: [0, [Validators.required]]
      });
    }

    ngOnInit() {
      this.cargarCategorias();
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

        formData.append('categoria_id', this.formP.get('categoria_id')?.value || '');
        formData.append('nombre_producto', this.formP.get('nombre_producto')?.value || '');
        formData.append('descripcion_producto', this.formP.get('descripcion_producto')?.value || '');
        formData.append('codigo_sunat', this.formP.get('codigo_sunat')?.value || '');
        formData.append('tipo_producto', this.formP.get('tipo_producto')?.value || '');
        formData.append('tipo_existencia', this.formP.get('tipo_existencia')?.value || '');
        formData.append('compra', this.formP.get('compra')?.value || '');
        formData.append('kardex', this.formP.get('kardex')?.value || '');
        formData.append('nombre_comercial', this.formP.get('nombre_comercial')?.value || '');
        formData.append('stock_actual', this.formP.get('stock_actual')?.value || '');
        formData.append('stock_minimo', this.formP.get('stock_minimo')?.value || '');
        formData.append('stock_maximo', this.formP.get('stock_maximo')?.value || '');
        formData.append('peso', this.formP.get('peso')?.value || '');
        formData.append('imagen_url', this.selectedFile, this.selectedFile.name);
        formData.append('precio', this.formP.get('precio')?.value || '');

        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });

        this.service.postProducto(formData).subscribe(
          res => {
            console.log("Producto creado correctamente:", res);
            this.formP.reset();
            this.selectedFile = null;
            this.dialogRef.close(res);
            Swal.fire(
              'Éxito!',
              'El producto se guardó correctamente.',
              'success'
            );
          },
          error => {
            console.error('Error al crear el producto:', error);
            Swal.fire(
              'Error!',
              'Hubo un problema al guardar el producto.',
              'error'
            );
          }
        );
      } else {
        console.warn("Formulario inválido o falta la imagen.");
      }
    }

  cargarCategorias() {
    this.categoriaService.allCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
