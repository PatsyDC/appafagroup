import { Component } from '@angular/core';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';

@Component({
  selector: 'app-repuestos',
  standalone: true,
  imports: [],
  templateUrl: './repuestos.component.html',
  styleUrl: './repuestos.component.css'
})
export class RepuestosComponent {
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
