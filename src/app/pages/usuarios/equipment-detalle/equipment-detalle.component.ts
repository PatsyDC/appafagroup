import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { finalize, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DetalleTarjetaComponent } from "./detalle/detalle-tarjeta/detalle-tarjeta.component";

@Component({
  selector: 'app-equipment-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, DetalleTarjetaComponent],
  templateUrl: './equipment-detalle.component.html',
  styleUrl: './equipment-detalle.component.css',
})
export class EquipmentDetalleComponent implements OnInit, OnDestroy {

  productoIdActual?: string;
  productosSimilares: IProductoAG[] = [];
  cargandoSimilares: boolean = false;

  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoAGService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de parámetros de la ruta
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productoIdActual = id;
        this.cargarProductosSimilares(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  cargarProductosSimilares(productoId: string): void {
    this.cargandoSimilares = true;

    // Primero obtener el producto actual para conocer su categoría
    this.productoService.getProductoById(productoId).subscribe({
      next: (producto) => {
        // Luego cargar productos similares
        this.productoService.allProductos().subscribe({
          next: (productos) => {
            this.productosSimilares = productos.filter(
              p => p.categoria_id === producto.categoria_id && p.producto_id !== productoId
            );
            this.cargandoSimilares = false;
          },
          error: (err) => {
            console.error('Error al cargar productos similares:', err);
            this.cargandoSimilares = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener producto principal:', err);
        this.cargandoSimilares = false;
      }
    });
  }

  // Método para cambiar el producto sin recargar la página
  seleccionarProducto(productoId: string): void {
    this.productoIdActual = productoId;
    this.cargarProductosSimilares(productoId);

    // Opcional: scroll hacia arriba para mostrar el nuevo producto
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

}
