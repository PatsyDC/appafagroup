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
      this.service.getProductoById(idNumber).subscribe((data: IProducto) => {
        this.producto = data;
        console.log(data);
      });
    } else {
      console.error('Invalid ID');
    }
  }
}
