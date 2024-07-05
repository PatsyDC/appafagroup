import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Inoticia } from 'app/core/models/noticia.model';
import { NoticiaService } from 'app/core/services/noticia.service';
import { EditNoticiaComponent } from './modals/edit-noticia/edit-noticia.component';

@Component({
  selector: 'app-noticia',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './noticia.component.html',
  styleUrl: './noticia.component.css'
})
export class NoticiaComponent {

  readonly dialog = inject(MatDialog);

  noticia: Inoticia[] = [];
  formNotcia: FormGroup

  constructor(
    private noticiaService : NoticiaService,
    private formBuilder: FormBuilder
  ){
    this.formNotcia = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      texto_corto: ['', [Validators.required]],
      texto_largo: ['', [Validators.required]],
      link: ['', [Validators.required]],
      img: ['', [Validators.required]]
    });
  }

  ngOnInit(): void{
    this.noticiaService.allNoticias().subscribe((data) => {
      console.log('data :' ,data);
      this.noticia = data;
    })
  }

  getNoticia(){
    this.noticiaService.allNoticias().subscribe(noticia => this.noticia = noticia);
  }

  onSubmit(): void {
    if (this.formNotcia.valid) {
      const formData = new FormData();
      const noticiaData = this.formNotcia.value; // Obtiene los valores del formulario

      // Agregar cada campo al FormData
      Object.keys(noticiaData).forEach(key => {
        if (key === 'img') { // Manejo especial para campos de archivo
          const fileInput = document.getElementById(key) as HTMLInputElement;
          const file = fileInput.files ? fileInput.files[0] : null;
          if (file) {
            formData.append(key, file, file.name); // Agregar archivo con su nombre
          }
        } else {
          const value = noticiaData[key];
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value)); // Convertir objetos a JSON
          } else {
            formData.append(key, value); // Agregar otros campos
          }
        }
      });

      console.log('FormData a enviar:', formData); // Muestra todo el contenido

      // Llamar al servicio para enviar el formData al backend
      this.noticiaService.postNoticia(formData).subscribe({
        next: (response) => {
          console.log('Producto creado exitosamente:', response);
          this.getNoticia();
          this.formNotcia.reset();
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
      console.error('Formulario inválido:', this.formNotcia); // Muestra errores de validación
    }
  }

  deleteNoticia(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.noticiaService.deleteNoticia(id).subscribe(
        () => {
          console.log('Usuario eliminado correctamente');
          this.getNoticia(); // Recargar la lista después de eliminar
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }

  openDialogEdit(equipos: Inoticia) {
    const dialogRefEdit = this.dialog.open(EditNoticiaComponent, {
      data: equipos
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.getNoticia();
      }
    });
  }


}
