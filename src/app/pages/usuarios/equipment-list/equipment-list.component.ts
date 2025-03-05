import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// import { IProducto } from 'app/core/models/producto.model';
// import { ProductosService } from 'app/core/services/productos.service';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css']
})
export class EquipmentListComponent {
  // productosFiltradosCategoria1?: IProducto[] = [];
  // productosFiltradosCategoria2?: IProducto[] = [];
  // productosFiltradosCategoria3?: IProducto[] = [];

  // public listaProductos: IProducto[] = [];

  // constructor(private productoService: ProductosService) {}

  // ngOnInit(): void {
  //   this.productoService.allProductosWithCategories().subscribe((productosConCategorias) => {
  //     this.productosFiltradosCategoria1 = productosConCategorias.filter(producto => producto.categoria_id === 1);
  //     this.productosFiltradosCategoria2 = productosConCategorias.filter(producto => producto.categoria_id === 2);
  //     this.productosFiltradosCategoria3 = productosConCategorias.filter(producto => producto.categoria_id === 3);

  //   });
  // }
}
