import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { CategoriaService } from 'app/core/services/categoria.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-repuesto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './edit-repuesto.component.html',
  styleUrl: './edit-repuesto.component.css'
})
export class EditRepuestoComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  producto: IProductoAG | null = null;
  categorias: ICategoriaP[] = [];
  formP: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private service: ProductoAGService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private dialogRef: MatDialogRef<EditRepuestoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductoAG
  ) {
    this.formP = this.formBuilder.group({
      categoria_id: ['', [Validators.required]],
      nombre_producto: ['', [Validators.required]],
      codigo_sunat: ['', [Validators.required]],
      tipo_producto: ['', [Validators.required]],
      tipo_existencia: ['', [Validators.required]],
      compra: ['', [Validators.required]],
      kardex: ['', [Validators.required]],
      nombre_comercial: ['', [Validators.required]],
      stock_minimo: [0, [Validators.required]],
      stock_maximo: [0, [Validators.required]],
      peso: [0, [Validators.required]],
      imagen_url: [null],
      precio: [0, [Validators.required]],
    });
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProducto();
  }

  cargarProducto() {
    // Verifica si hay datos directamente del diálogo
    if (this.data) {
      console.log('Datos recibidos:', this.data);
      this.producto = this.data;

      // Llena el formulario con los datos del producto
      this.formP.patchValue({
        categoria_id: this.data.categoria_id,
        nombre_producto: this.data.nombre_producto,
        codigo_sunat: this.data.codigo_sunat,
        tipo_producto: this.data.tipo_producto,
        tipo_existencia: this.data.tipo_existencia,
        compra: this.data.compra,
        kardex: this.data.kardex,
        nombre_comercial: this.data.nombre_comercial,
        stock_minimo: this.data.stock_minimo,
        stock_maximo: this.data.stock_maximo,
        peso: this.data.peso,
        precio: this.data.precio
      });

      // Muestra la imagen actual si está disponible
      if (this.data.imagen_url) {
        this.imagePreview = this.data.imagen_url;
      }
    } else {
      console.error('No se recibieron datos del producto');
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;

    // Create preview for the newly selected image
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  isFormValid(): boolean {
    return this.formP.valid;
  }

  save() {
    if (this.formP.valid && this.producto) {
      const formData = new FormData();

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
      formData.append('precio', this.formP.get('precio')?.value || '');

      // Solo adjunta el archivo si se seleccionó uno nuevo
      if (this.selectedFile) {
        formData.append('imagen_url', this.selectedFile, this.selectedFile.name);
      }

      // Usa el ID correcto del producto
      this.service.putRepuesto(this.producto.producto_id, formData).subscribe(
        res => {
          console.log("Producto actualizado correctamente:", res);
          this.dialogRef.close(res);
          Swal.fire(
            'Éxito!',
            'El producto se edito correctamente.',
            'success'
          );
        },
        error => {
          console.error('Error al actualizar el producto:', error);
          Swal.fire(
            'Error!',
            'Hubo un problema al editar el producto.',
            'error'
          );
        }
      );
    } else {
      console.warn("Formulario inválido.");
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
