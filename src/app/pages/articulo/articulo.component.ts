import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { IArticulo } from 'app/core/models/articulos.model';
import { ArticuloService } from 'app/core/services/articulo.service';

@Component({
  selector: 'app-articulo',
  standalone: true,
  imports: [CurrencyPipe, CommonModule ],
  templateUrl: './articulo.component.html',
  styleUrl: './articulo.component.css'
})
export class ArticuloComponent {

  articulos: IArticulo[] = [];

  constructor(private articuloService: ArticuloService) { }

  ngOnInit(): void {
    this.cargarArticulosTesla();
  }

  cargarArticulosTesla() {
    this.articuloService.getArticulosTesla().subscribe(
      data => {
        this.articulos = data.slice(0, 6); // Mostrar solo los primeros 6 artículos
        console.log(data); // Puedes ver los datos en la consola si es necesario
      },
      error => {
        console.error('Error al cargar artículos de Tesla:', error);
      }
    );
  }

}
