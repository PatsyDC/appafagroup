import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';

@Component({
  selector: 'app-detalle-p',
  standalone: true,
  imports: [],
  templateUrl: './detalle-p.component.html',
  styleUrls: ['./detalle-p.component.css']
})
export class DetallePComponent implements OnInit {
  producto?: IProducto;

  constructor(
    private route: ActivatedRoute,
    private service: ProductosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const idNumber = parseInt(id, 10);
      this.service.allProductosWithCategories().subscribe((productosConCategorias: IProducto[]) => {
        const producto = productosConCategorias.find(p => p.id === idNumber);
        if (producto) {
          this.producto = producto;
          console.log(this.producto);
        } else {
          console.error('Producto no encontrado');
        }
      });
    } else {
      console.error('ID inválido');
    }
  }
}
