import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IRepuesto } from 'app/core/models/repuesto.model';
import { RepuestoService } from 'app/core/services/repuesto.service';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './parts-list.component.html',
  styleUrl: './parts-list.component.css'
})
export class PartsListComponent {
  productos?: IRepuesto[] = [];
  public listaProductos:IRepuesto[] = [];

  constructor(private repuestoService: RepuestoService) {
  }

  ngOnInit(): void {
    this.repuestoService.allRepuestos().subscribe((data) => {
      console.log('data: ',data);
      this.productos = data;
    });
  }

}
