import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICliente } from 'app/core/models/cliente.model';
import { ClienteService } from 'app/core/services/cliente.service';
import { CreateClienteComponent } from './modal/create-cliente/create-cliente.component';
import { EditClienteComponent } from './modal/edit-cliente/edit-cliente.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {

  readonly dialog = inject(MatDialog);
  clientes: ICliente[] = [];

  //Barra de busqueda
  filteredClientes: ICliente[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private clienteService: ClienteService,
  ){}

  ngOnInit(): void{
    this.clienteService.allClientes().subscribe((data) => {
      console.log('data :' ,data);
      this.clientes = data;
      this.filteredClientes = [...this.clientes];
      this.calculateTotalPages();
    })
  }

  getClientes(){
    this.clienteService.allClientes().subscribe(cliente => {
      this.clientes = cliente;
      this.applyFilter();
    })
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClientes = [...this.clientes];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredClientes = this.clientes.filter(cat =>
        cat.razon_social.toLowerCase().includes(searchTermLower) ||
        cat.codigo_ruc.toLowerCase().includes(searchTermLower)
      );
    }
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredClientes.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Si hay menos páginas que el máximo visible, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas alrededor de la actual
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      // Ajustar si estamos cerca del final
      if (end === this.totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  }

  openDialogCreate(): void{
    const dialogRefCreate = this.dialog.open(CreateClienteComponent);

    dialogRefCreate.afterClosed().subscribe(result => {
      if(result){
        this.getClientes();
      }
    })
  }

  openDialogEdit(cliente: ICliente){
    const dialogRefEdit = this.dialog.open(EditClienteComponent, {
      data: cliente
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if(result){
        this.getClientes();
      }
    });
  }

      deleteCliente(id: number) {
        Swal.fire({
          title: '¿Estás seguro de que quieres eliminar este cliente?',
          text: "Una vez eliminada, no podrás recuperarla.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.clienteService.deleteCliente(id).subscribe(
              () => {
                console.log('Cliente eliminado correctamente');
                this.ngOnInit(); // Recargar la lista después de eliminar
              },
              error => {
                console.error('Error al eliminar el sondeo:', error);
              }
            );
          }
        });
      }
    }
