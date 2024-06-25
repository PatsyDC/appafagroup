import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';


@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './parts-list.component.html',
  styleUrl: './parts-list.component.css'
})
export class PartsListComponent {
  productosFiltradosCategoria4?: IProducto[] = [];
  productosFiltradosCategoria5?: IProducto[] = [];
  productosFiltradosCategoria6?: IProducto[] = [];
  productosFiltradosCategoria7?: IProducto[] = [];
  productosFiltradosCategoria8?: IProducto[] = [];
  productosFiltradosCategoria9?: IProducto[] = [];
  productosFiltradosCategoria10?: IProducto[] = [];
  productosFiltradosCategoria11?: IProducto[] = [];
  productosFiltradosCategoria12?: IProducto[] = [];
  public listaProductos: IProducto[] = [];

  constructor(private productoService: ProductosService) {}

  ngOnInit(): void {
    this.productoService.allProductosWithCategories().subscribe((productosConCategorias) => {
      this.productosFiltradosCategoria4 = productosConCategorias.filter(producto => producto.categoria_id === 4);
      this.productosFiltradosCategoria5 = productosConCategorias.filter(producto => producto.categoria_id === 5);
      this.productosFiltradosCategoria6 = productosConCategorias.filter(producto => producto.categoria_id === 6);
      this.productosFiltradosCategoria7 = productosConCategorias.filter(producto => producto.categoria_id === 7);
      this.productosFiltradosCategoria8 = productosConCategorias.filter(producto => producto.categoria_id === 8);
      this.productosFiltradosCategoria9 = productosConCategorias.filter(producto => producto.categoria_id === 9);
      this.productosFiltradosCategoria10 = productosConCategorias.filter(producto => producto.categoria_id === 10);
      this.productosFiltradosCategoria11 = productosConCategorias.filter(producto => producto.categoria_id === 11);
      this.productosFiltradosCategoria12 = productosConCategorias.filter(producto => producto.categoria_id === 12);

    });
  }

}
