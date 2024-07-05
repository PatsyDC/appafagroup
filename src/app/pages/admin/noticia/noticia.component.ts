import { NoticiasService } from 'app/core/services/noticias.service';
import { NoticiaComponent } from './noticia/noticia.component';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Inoticia } from 'app/core/models/noticia.model'; // Importa el modelo de noticia
import { NoticiaService } from 'app/core/services/noticia.service'; // Importa el servicio de noticias
import { EditNoticiaComponent } from './modals/edit-noticia/edit-noticia.component'; // Importa el componente modal para editar noticias

@Component({
  selector: 'app-noticia',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './noticia.component.html',
  styleUrl: './noticia.component.css'
})
export class NoticiaComponent {

  readonly dialog = inject(MatDialog);

  noticias: Inoticia[] = [];
  formNoticia: FormGroup;

  constructor(
    private noticiasService: NoticiasService,
    private formBuilder: FormBuilder
  ) {
    this.formNoticia = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      texto_corto: ['', [Validators.required]],
      texto_largo: ['', [Validators.required]],
      link: ['', [Validators.required]],
      img: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getNoticias();
  }

  getNoticias() {
    this.noticiasService.getAllNoticias().subscribe((data) => {
      console.log('Noticias:', data);
      this.noticias = data;
    });
  }

  onSubmit(): void {
    if (this.formNoticia.valid) {
      const noticiaData = this.formNoticia.value;

      this.noticiasService.createNoticia(noticiaData).subscribe({
        next: (response) => {
          console.log('Noticia creada exitosamente:', response);
          this.getNoticias();
          this.formNoticia.reset();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear la noticia:', err);
          console.error('Código de estado:', err.status);
          console.error('Mensaje de error:', err.message);
          console.error('Respuesta del servidor:', err.error);
        }
      });
    } else {
      console.error('Formulario inválido:', this.formNoticia);
    }
  }

  openDialogEdit(noticia: Inoticia) {
    const dialogRefEdit = this.dialog.open(EditNoticiaComponent, {
      data: noticia
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.getNoticias();
      }
    });
  }

  deleteNoticia(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      this.noticiasService.deleteNoticia(id).subscribe(
        () => {
          console.log('Noticia eliminada correctamente');
          this.getNoticias();
        },
        error => {
          console.error('Error al eliminar la noticia:', error);
        }
      );
    }
  }
}
