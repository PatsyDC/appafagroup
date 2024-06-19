import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css']
})
export class EquipmentListComponent {
  productosFiltradosCategoria4?: IProducto[] = [];
  productosFiltradosCategoria5?: IProducto[] = [];
  productosFiltradosCategoria6?: IProducto[] = [];
  productosFiltradosCategoria7?: IProducto[] = [];
  public listaProductos: IProducto[] = [];

  constructor(private productoService: ProductosService) {}

  ngOnInit(): void {
    this.productoService.allProductosWithCategories().subscribe((productosConCategorias) => {
      this.productosFiltradosCategoria4 = productosConCategorias.filter(producto => producto.categoria_id === 4);
      this.productosFiltradosCategoria5 = productosConCategorias.filter(producto => producto.categoria_id === 5);
      this.productosFiltradosCategoria6 = productosConCategorias.filter(producto => producto.categoria_id === 7);
      this.productosFiltradosCategoria7 = productosConCategorias.filter(producto => producto.categoria_id === 6);
    });
  }
}
