import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICliente } from 'app/core/models/cliente.model';
import { ClienteService } from 'app/core/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-cliente.component.html',
  styleUrl: './edit-cliente.component.css'
})
export class EditClienteComponent {

  formEditCliente: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    public dialogRef: MatDialogRef<EditClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICliente
  ){
    this.formEditCliente = this.formBuilder.group({
      codigo_ruc: ['', [Validators.required]],
      tipo_persona: ['', [Validators.required]],
      razon_social: ['', [Validators.required]],
      tipo_empleador: ['', [Validators.required]],
      documento_ruc: ['', [Validators.required]],
      nro_dni: [''],
      nombre_persona: [''],
      pais: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: [''],
      correo: ['', [Validators.required]],
    })
  };

  ngOnInit(): void {
    this.formEditCliente.patchValue(this.data);
  }

  save(): void {
      if (this.formEditCliente.valid) {
        const categoria: ICliente = this.formEditCliente.value;
        this.clienteService.putCliente(categoria, this.data.cliente_id).subscribe(
          (res) => {
            console.log("Cliente actualizada:", res);
            this.dialogRef.close(res);
            Swal.fire(
              'Éxito!',
              'El cliente se edito correctamente.',
              'success'
            );
          },
          (error) => {
            console.error("Error al actualizar cliente:", error);
            Swal.fire(
              'Error!',
              'Hubo un problema al guardar el cliente.',
              'error'
            );
          }
        );
      }
    }

  closeDialog() {
    this.dialogRef.close(); // Asegúrate de inyectar MatDialogRef en el constructor
  }


}
