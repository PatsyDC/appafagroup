import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICarrito } from 'app/core/models/carrito.model';
import { IProducto } from 'app/core/models/producto.model';
import { IRepuesto } from 'app/core/models/repuesto.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { ProductosService } from 'app/core/services/productos.service';
import { RepuestoService } from 'app/core/services/repuesto.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  producto?: IProducto[] = [];
  repuesto?: IRepuesto[] = [];

  constructor(private productoService: ProductosService,
    private repuestoService: RepuestoService,
    private carritoService: CarritoService
  ){}

  ngOnInit(): void {
    this.repuestoService.allRepuestos().subscribe((data) => {
      console.log('data: ', data);
      this.repuesto = data;
    });
    this.productoService.allProductos().subscribe((data) => {
      console.log('data: ', data);
      this.producto = data;
    });
  }

  addToCart(event: any, item: IProducto | IRepuesto): void {
    event.preventDefault(); // Evita el comportamiento predeterminado del link
    const product: ICarrito = {
      id: 0, // Este id se generará en el backend
      id_product: item.id,
      img_product: item.img,
      nombre_product: item.nombre,
      precio_product: item.precio, // Asegúrate de que tu modelo de producto tenga el precio
      cantidad: 1
    };

    this.carritoService.addProductToCart(product).subscribe(
      () => {
        this.carritoService.refresh$.next();
        console.log('Producto agregado al carrito:', item);
      },
      (error) => {
        console.error('Error adding product to cart:', error);
      }
    );
  }
}
