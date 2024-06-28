import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';
import { EditEquipoComponent } from './modals/edit-equipo/edit-equipo.component';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, NgFor],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})
export class EquiposComponent {

  readonly dialog = inject(MatDialog);

  equipos: IProducto[] = [];
  categorias: ICategoriaP[] = [];
  formEquipo: FormGroup

  constructor(
    private equiposService: ProductosService,
    private formBuilder: FormBuilder
  ){
    this.formEquipo = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      img: [null, [Validators.required]],
      categoria_id: ['', [Validators.required]],
      ficha_p: [null, [Validators.required]],
      pdf: ['', [Validators.required]],
    })
  }

  ngOnInit(): void{
    this.equiposService.allProductos().subscribe((data) => {
      console.log('data :' ,data);
      this.equipos = data;
    })

    this.equiposService.allCategorias().subscribe((data) => {
      console.log('categorias :', data);
      this.categorias = data;
    });
  }

  getProductos() {
    this.equiposService.allProductos().subscribe(equipos => this.equipos = equipos);
  }

  onSubmit(): void {
    if (this.formEquipo.valid) {
      const formData = new FormData();
      const equipoData = this.formEquipo.value; // Obtiene los valores del formulario

      // Agregar cada campo al FormData
      Object.keys(equipoData).forEach(key => {
        if (key === 'img' || key === 'ficha_p') { // Manejo especial para campos de archivo
          const fileInput = document.getElementById(key) as HTMLInputElement;
          const file = fileInput.files ? fileInput.files[0] : null;
          if (file) {
            formData.append(key, file, file.name); // Agregar archivo con su nombre
          }
        } else {
          const value = equipoData[key];
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value)); // Convertir objetos a JSON
          } else {
            formData.append(key, value); // Agregar otros campos
          }
        }
      });

      console.log('FormData a enviar:', formData); // Muestra todo el contenido

      // Llamar al servicio para enviar el formData al backend
      this.equiposService.postProducto(formData).subscribe({
        next: (response) => {
          console.log('Producto creado exitosamente:', response);
          this.getProductos();
          this.formEquipo.reset();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear el producto:', err);
          console.error('Código de estado:', err.status);
          console.error('Mensaje de error:', err.message);
          console.error('Respuesta del servidor:', err.error);
          // Aquí puedes mostrar mensajes de error específicos al usuario
          // basados en la respuesta del servidor (err.error)
        }
      });
    } else {
      console.error('Formulario inválido:', this.formEquipo); // Muestra errores de validación
    }
  }

  openDialogEdit(equipos: IProducto) {
    const dialogRefEdit = this.dialog.open(EditEquipoComponent, {
      data: equipos
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.getProductos();
      }
    });
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.equiposService.deleteProducto(id).subscribe(
        () => {
          console.log('Usuario eliminado correctamente');
          this.getProductos(); // Recargar la lista después de eliminar
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }



}
