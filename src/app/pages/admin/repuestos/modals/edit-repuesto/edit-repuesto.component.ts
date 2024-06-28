import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IRepuesto } from 'app/core/models/repuesto.model';
import { RepuestoService } from 'app/core/services/repuesto.service';

@Component({
  selector: 'app-edit-repuesto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-repuesto.component.html',
  styleUrl: './edit-repuesto.component.css'
})
export class EditRepuestoComponent {
  formEditRepuesto: FormGroup;
  categorias: ICategoriaP[] = [];

  constructor(
    private equiposService: RepuestoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditRepuestoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRepuesto
  ) {
    this.formEditRepuesto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      img: [null],
      categoria_id: ['', [Validators.required]],
      ficha_p: [null],
      pdf: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
    });

    // Inicializa el formulario con los datos del producto a editar
    this.formEditRepuesto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      img: [null], // Asegúrate de manejar esto adecuadamente
      categoria_id: ['', [Validators.required]],
      ficha_p: [null], // Asegúrate de manejar esto adecuadamente
      pdf: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
    });

  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formEditRepuesto.patchValue({ [controlName]: file });
    }
  }

  ngOnInit(): void {
    this.formEditRepuesto.patchValue(this.data);

    this.equiposService.allCategorias().subscribe((data) => {
      console.log('categorias :', data);
      this.categorias = data;
    });


  }

  // loadImageFromServer(url: string, controlName: string): void {
  //   if (url) {
  //     const fullUrl = `http://localhost:3000/${url}`;
  //     this.http.get(fullUrl, { responseType: 'blob' }).subscribe(blob => {
  //       const file = new File([blob], url.split('/').pop()!, { type: blob.type });
  //       this.formEditRepuesto.patchValue({ [controlName]: file });
  //       if (controlName === 'img') {
  //         this.imgFile = file;
  //         this.imgFileURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  //       }
  //     });
  //   }
  // }

  save(): void {
    if (this.formEditRepuesto.valid) {
      const formData = new FormData();
      const repuestoData = this.formEditRepuesto.value;

      Object.keys(repuestoData).forEach(key => {
        if (key === 'img') {
          const file = repuestoData[key];
          if (file instanceof File) {
            formData.append(key, file, file.name);
          } else {
            formData.append(key, file); // Aquí puedes ajustar según sea necesario
          }
        } else {
          formData.append(key, repuestoData[key]);
        }
      });

      // Usa this.data.id para obtener el ID del producto a editar
      this.equiposService.putRepuesto(formData, this.data.id).subscribe({
        next: (response) => {
          console.log('Producto editado exitosamente:', response);
          this.dialogRef.close(true); // Cierra el diálogo indicando éxito
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al editar el producto:', err);
        }
      });
    } else {
      console.error('Formulario inválido:', this.formEditRepuesto);
    }
  }
}
