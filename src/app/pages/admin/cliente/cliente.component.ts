import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICliente } from 'app/core/models/cliente.model';
import { ClienteService } from 'app/core/services/cliente.service';
import { CreateClienteComponent } from './modal/create-cliente/create-cliente.component';
import { EditClienteComponent } from './modal/edit-cliente/edit-cliente.component';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {

  readonly dialog = inject(MatDialog);
  clientes: ICliente[] = [];

  constructor(
    private clienteService: ClienteService,
  ){}

  ngOnInit(): void{
    this.clienteService.allClientes().subscribe((data) => {
      console.log('data :' ,data);
      this.clientes = data;
    })
  }

  openDialogCreate(): void{
    const dialogRefCreate = this.dialog.open(CreateClienteComponent);
  }

  openDialogEdit(cliente: ICliente){
    const dialogRefEdit = this.dialog.open(EditClienteComponent, {
      data: cliente
    });
  }

  deleteCliente(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe(
        () => {
          console.log('cliente eliminado correctamente');
          this.ngOnInit(); // Recargar la lista después de eliminar
        },
        error => {
          console.error('Error al eliminar el cliente:', error);
        }
      );
    }
  }

}
