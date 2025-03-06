import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { AgregarProductoComponent } from './modals/agregar-producto/agregar-producto.component';

@Component({
  selector: 'app-repuestos',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent {

  readonly dialog = inject(MatDialog);

  producto: IProductoAG[] = [];
  categorias: ICategoriaP[] = [];

  constructor(
    private service: ProductoAGService) {}

  ngOnInit(): void {
    this.service.allProductos().subscribe((data) => {
      console.log('data :' ,data);
      this.producto = data;
    })
  }

  openDialogAdd(): void{
    const dialogReAdd = this.dialog.open(AgregarProductoComponent, {
      // disableClose: true
    });
    // dialogReAdd.componentInstance.dataSaved.subscribe((success: boolean) => {
    //   if (success) {
    //     dialogReAdd.close();
    //     this.ngOnInit;
    //   }
    // })
  }

  onDelete(producto_id: number): void {
    this.service.deleteProducto(producto_id).subscribe({
      next: () => {
        this.ngOnInit(); // Recarga los datos después de eliminar
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
      }
    });
  }



  // openDialogEdit(repuesto: IRepuesto) {
  //   const dialogRefEdit = this.dialog.open(EditRepuestoComponent, {
  //     data: repuesto
  //   });

  //   dialogRefEdit.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getRepuesto();
  //     }
  //   });
  // }

  // deleteRepuesto(id: number) {
  //   if (confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
  //     this.RepuestoService.deleteRepuesto(id).subscribe(
  //       () => {
  //         console.log('Repuesto eliminado correctamente');
  //         this.getRepuesto(); // Recargar la lista después de eliminar
  //       },
  //       error => {
  //         console.error('Error al eliminar el repuesto:', error);
  //       }
  //     );
  //   }
  // }
}
