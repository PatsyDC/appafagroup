import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICliente } from 'app/core/models/cliente.model';
import { ClienteService } from 'app/core/services/cliente.service';

@Component({
  selector: 'app-create-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-cliente.component.html',
  styleUrl: './create-cliente.component.css'
})
export class CreateClienteComponent {

  readonly dialog = inject(MatDialog);

  cliente: ICliente[] = [];
  formCliente: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateClienteComponent>
  ){
    this.formCliente = this.formBuilder.group({
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
  }

  save(){
    if(this.formCliente.valid){
      const value = this.formCliente.value;
      this.clienteService.postCliente(value).subscribe( res => {
        if(res){
          console.log("Cliente guardado: ", res);
          this.dialogRef.close(res);
        }
      }, error => {
        console.error("Error al guardar cliente:", error);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close(); // Asegúrate de inyectar MatDialogRef en el constructor
  }
}
