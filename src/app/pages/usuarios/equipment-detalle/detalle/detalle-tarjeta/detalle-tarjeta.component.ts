import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-tarjeta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-tarjeta.component.html',
  styleUrl: './detalle-tarjeta.component.css'
})
export class DetalleTarjetaComponent implements OnInit, OnChanges{

@Input() productoId?: string; // Recibe el ID del producto como input

  producto?: IProductoAG;
  cargando: boolean = false;
  error: boolean = false;

  constructor(
    private productoService: ProductoAGService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    if (this.productoId) {
      this.cargarProducto(this.productoId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se ejecuta cuando cambia el productoId desde el componente padre
    if (changes['productoId'] && changes['productoId'].currentValue) {
      this.cargarProducto(changes['productoId'].currentValue);
    }
  }

  cargarProducto(id?: string): void {
    if (!id) return;

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

  agregarAlCarrito(producto: IProductoAG): void {
    try {
      this.carritoService.agregarProducto(producto, 1);

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

  // Método para reintentar la carga (usado en el template)
  reintentarCarga(): void {
    if (this.productoId) {
      this.cargarProducto(this.productoId);
    }
  }
}
