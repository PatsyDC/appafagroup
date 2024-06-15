import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProducto } from 'app/core/models/producto.model';
import { IRepuesto } from 'app/core/models/repuesto.model';
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
    private repuestoService: RepuestoService
  ){}

  ngOnInit(): void {
    this.repuestoService.allRepuestos().subscribe((data) => {
      console.log('data: ',data);
      this.repuesto = data;
    });
    this.productoService.allProductos().subscribe((data) => {
      console.log('data: ',data);
      this.producto = data;
    });
  }
}
