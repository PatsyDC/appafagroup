import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EditRepuestoComponent } from './modals/edit-repuesto/edit-repuesto.component';
import { IProductoAG } from 'app/core/models/productoAG.model';

@Component({
  selector: 'app-repuestos',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent {

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

  ngOnInit(): void {
    this.service.allProductos().subscribe((data) => {
      console.log('data :' ,data);
      this.producto = data;
    })
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




  // openDialogEdit(repuesto: IRepuesto) {
  //   const dialogRefEdit = this.dialog.open(EditRepuestoComponent, {
  //     data: repuesto
  //   });

  //   dialogRefEdit.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getRepuesto();
  //     }
  //   });
  // }

  // deleteRepuesto(id: number) {
  //   if (confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
  //     this.RepuestoService.deleteRepuesto(id).subscribe(
  //       () => {
  //         console.log('Repuesto eliminado correctamente');
  //         this.getRepuesto(); // Recargar la lista después de eliminar
  //       },
  //       error => {
  //         console.error('Error al eliminar el repuesto:', error);
  //       }
  //     );
  //   }
  // }
}
