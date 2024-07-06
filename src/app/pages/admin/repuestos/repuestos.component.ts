import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IRepuesto } from 'app/core/models/repuesto.model';
import { RepuestoService } from 'app/core/services/repuesto.service';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EditRepuestoComponent } from './modals/edit-repuesto/edit-repuesto.component';

@Component({
  selector: 'app-repuestos',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent {

  readonly dialog = inject(MatDialog);

  repuesto: IRepuesto[] = [];
  categorias: ICategoriaP[] = [];
  formRepuesto: FormGroup;

  constructor(
    private RepuestoService: RepuestoService,
    private formBuilder: FormBuilder
  ) {
    this.formRepuesto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      codigo:['', [Validators.required]],
      precio: ['', [Validators.required]],
      categoria_id: ['', [Validators.required]], // Agregar el control categoria_id
      img: ['', [Validators.required]],
      pdf: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.RepuestoService.allRepuestos().subscribe((data) => {
      console.log('data :', data);
      this.repuesto = data;
    });

    this.RepuestoService.allCategorias().subscribe((data) => {
      console.log('categorias :', data);
      this.categorias = data;
    });
  }

  getRepuesto() {
    this.RepuestoService.allRepuestos().subscribe(repuesto => this.repuesto = repuesto);
  }

  onSubmit(): void {
    if (this.formRepuesto.valid) {
      const formData = new FormData();
      const repuestoData = this.formRepuesto.value; // Obtiene los valores del formulario

      // Agregar cada campo al FormData
      Object.keys(repuestoData).forEach(key => {
        if (key === 'img') { // Manejo especial para campos de archivo
          const fileInput = document.getElementById(key) as HTMLInputElement;
          const file = fileInput.files ? fileInput.files[0] : null;
          if (file) {
            formData.append(key, file, file.name); // Agregar archivo con su nombre
          }
        } else {
          const value = repuestoData[key];
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value)); // Convertir objetos a JSON
          } else {
            formData.append(key, value); // Agregar otros campos
          }
        }
      });

      console.log('FormData a enviar:', formData); // Muestra todo el contenido

      // Llamar al servicio para enviar el formData al backend
      this.RepuestoService.postRepuestos(formData).subscribe({
        next: (response) => {
          console.log('Producto creado exitosamente:', response);
          this.getRepuesto();
          this.formRepuesto.reset();
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
      console.error('Formulario inválido:', this.formRepuesto); // Muestra errores de validación
    }
  }

  openDialogEdit(repuesto: IRepuesto) {
    const dialogRefEdit = this.dialog.open(EditRepuestoComponent, {
      data: repuesto
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.getRepuesto();
      }
    });
  }

  deleteRepuesto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
      this.RepuestoService.deleteRepuesto(id).subscribe(
        () => {
          console.log('Repuesto eliminado correctamente');
          this.getRepuesto(); // Recargar la lista después de eliminar
        },
        error => {
          console.error('Error al eliminar el repuesto:', error);
        }
      );
    }
  }
}
