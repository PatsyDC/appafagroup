import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProducto } from 'app/core/models/producto.model';
import { ProductosService } from 'app/core/services/productos.service';

@Component({
  selector: 'app-detalle-p',
  standalone: true,
  imports: [],
  templateUrl: './detalle-p.component.html',
  styleUrl: './detalle-p.component.css'
})
export class DetallePComponent implements OnInit{
  producto?: IProducto;

  constructor(
    private router: ActivatedRoute,
    private service: ProductosService
  ){}

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id');
    this.service.getProductoById(id).subscribe((data) =>{
      this.producto = data;
      console.log(data);
    })
  }

}
