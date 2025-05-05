import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICategoriaP } from 'app/core/models/categoria.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { CategoriaService } from 'app/core/services/categoria.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';

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
    this.carritoService.agregarProducto(producto, 1);
  }
}
