import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inoticia } from 'app/core/models/noticia.model';
import { NoticiaService } from 'app/core/services/noticia.service';

@Component({
  selector: 'app-edit-noticia',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './edit-noticia.component.html',
  styleUrl: './edit-noticia.component.css'
})
export class EditNoticiaComponent {
  formEditNoticia: FormGroup

  constructor(
    private noticiaService: NoticiaService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditNoticiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inoticia
  ) {
    this.formEditNoticia = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      texto_corto: ['', [Validators.required]],
      texto_largo: ['', [Validators.required]],
      link: ['', [Validators.required]],
      img: [null],
    })

    //formulario con datos de lo w voy a editar
    this.formEditNoticia.patchValue({
      titulo: this.data.titulo,
      texto_corto: this.data.texto_corto,
      texto_largo: this.data.texto_largo,
      link: this.data.link,
      img: null
    })
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formEditNoticia.patchValue({ [controlName]: file });
    }
  }

  save(): void {
    if (this.formEditNoticia.valid) {
      const formData = new FormData();
      const noticiaData = this.formEditNoticia.value;

      Object.keys(noticiaData).forEach(key => {
        if (key === 'img') {
          const file = noticiaData[key];
          if (file instanceof File) {
            formData.append(key, file, file.name);
          }
        } else {
          formData.append(key, noticiaData[key]);
        }
      });

      // Usa this.data.id para obtener el ID del producto a editar
      this.noticiaService.putNoticia(formData, this.data.id).subscribe({
        next: (response) => {
          console.log('Noticia editada exitosamente:', response);
          this.dialogRef.close(true); // Cierra el diálogo indicando éxito
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al editar el producto:', err);
        }
      });
    } else {
      console.error('Formulario inválido:', this.formEditNoticia);
    }
  }

}
