import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'app/core/services/carrito.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { UserService } from 'app/core/services/user.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  totalTrabajadores: number = 0;
  totalProductos: number = 0;
  totalCotizaciones: number = 0;


  constructor(
    private userService: UserService,
    private productoAGService: ProductoAGService,
    private cotizacionService: CarritoService
  ) {}

  ngOnInit(): void {
    this.loadTrabajadores();
    this.loadProductos();
    this.loadCotizaciones();
  }

  loadTrabajadores(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.totalTrabajadores = users.length;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  loadProductos(): void {
    this.productoAGService.allProductos().subscribe({
      next: (productos) => {
        this.totalProductos = productos.length;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  loadCotizaciones(): void {
    this.cotizacionService.contarCotizaciones().subscribe({
      next: (cotizaciones) => {
        this.totalCotizaciones = cotizaciones.length;
      },
      error: (err) => {
        console.error('Error al cargar cotizaciones:', err);
      }
    });
  }


}
