import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { CategoriaService } from 'app/core/services/categoria.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css']
})
export class EquipmentListComponent {

  producto: IProductoAG[] = [];
  categorias: ICategoriaP[] = [];

  constructor(
    private service: ProductoAGService,
    private serviceCategoria: CategoriaService,
    private carritoService: CarritoService,
    ) {}

  ngOnInit(): void {
    this.loadProductos();
    this.loadCategorias();
  }

  loadProductos(): void {
    this.service.allProductos().subscribe((data) => {
      console.log('data :' ,data);
      this.producto = data;
    });
  }

  loadCategorias(): void {
    this.serviceCategoria.allCategorias().subscribe((data) => {
      console.log('Categorías:', data);
      this.categorias = data;
    });
  }

  getCategoriaNombre(categoria_id: number): IProductoAG[] {
    return this.producto.filter(producto =>
      producto.categoria_id === categoria_id
    )
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
