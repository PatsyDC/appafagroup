
import { IProducto } from './../../core/models/producto.model';
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../core/services/productos.service';

@Component({
  selector: 'app-parts-list',
  // standalone: true,
  // imports: [HttpClientModule],
  templateUrl: './parts-list.component.html',
  styleUrl: './parts-list.component.css'
})
export class PartsListComponent {
  productos?: IProducto[] = [];
  public listaProductos:IProducto[] = [];

  constructor(private productoService: ProductosService) {
  }

  ngOnInit(): void {
    this.productoService.allProductos().subscribe((data) => {
      console.log('data: ',data);
      this.productos = data;
    });
  }

}
