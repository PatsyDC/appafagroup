import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { AgregarProductoComponent } from './modals/agregar-producto/agregar-producto.component';
import { CategoriaService } from 'app/core/services/categoria.service';
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

  producto: IProductoAG[] = [];
  categorias: ICategoriaP[] = [];

  constructor(
    private service: ProductoAGService,
    private serviceCategoria: CategoriaService) {}

  ngOnInit(): void {
    this.service.allProductos().subscribe((data) => {
      console.log('data :' ,data);
      this.producto = data;
    });

    this.serviceCategoria.allCategorias().subscribe((data) => {
      console.log('Categorías:', data);
      this.categorias = data;
    });
  }

  getCategoriaNombre(categoria_id: number): string {
    const categoria = this.categorias.find(cat => cat.categoria_id === categoria_id);
    return categoria ? categoria.categoria_name : 'Desconocido';
  }

  openDialogAdd(): void{
    const dialogReAdd = this.dialog.open(AgregarProductoComponent);

    dialogReAdd.afterClosed().subscribe(result => {
      if(result){
        this.ngOnInit();
      }
    });
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

  openDialogEdit(repuesto: IProductoAG) {
    const dialogRefEdit = this.dialog.open(EditRepuestoComponent, {
      data: repuesto
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

}
