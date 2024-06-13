import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [RouterLink],
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
