import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipment-detalle.component.html',
  styleUrl: './equipment-detalle.component.css'
})
export class EquipmentDetalleComponent implements OnInit {

  producto?: IProductoAG;
  cargando: boolean = false;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoAGService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  cargarProducto(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargando = true;
      this.error = false;

      this.productoService.getProductoById(id)
        .pipe(
          finalize(() => this.cargando = false)
        )
        .subscribe({
          next: (data) => {
            console.log('Producto recibido:', data);
            this.producto = data;
          },
          error: (err) => {
            console.error('Error al obtener el detalle del producto:', err);
            this.error = true;
          }
        });
    }
  }

  agregarAlCarrito(producto: IProductoAG): void {
    try {
      this.carritoService.agregarProducto(producto, 1); // Método sincrónico

      Swal.fire(
        '¡Éxito!',
        'El producto se añadió al carrito correctamente.',
        'success'
      );
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      Swal.fire(
        '¡Error!',
        'Hubo un problema al añadir el producto al carrito.',
        'error'
      );
    }
  }

}
