import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ICarrito, IItemCarrito } from 'app/core/models/carrito.model';
import { CarritoService } from 'app/core/services/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit {
  carrito: ICarrito;
  checkoutForm: FormGroup;
  procesandoOrden = false;
  ordenCompletada = false;
  errorOrden = '';

  constructor(
    private carritoService: CarritoService,
    private fb: FormBuilder,
  ) {
    this.carrito = this.carritoService.getCarritoValue();
    this.checkoutForm = this.fb.group({
      empresa: [''],
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      ruc : [''],
      ocupacion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carritoService.getCarrito().subscribe(carrito => {
      this.carrito = carrito;
    });
  }

  actualizarCantidad(item: IItemCarrito, cantidad: number): void {
    this.carritoService.actualizarCantidad(item.producto.producto_id, cantidad);
  }

  eliminarProducto(productoId: string): void {
    this.carritoService.eliminarProducto(productoId);
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
  }

  finalizarCompra(): void {
    if (this.checkoutForm.invalid) {
      this.errorOrden = 'Por favor, completa todos los campos.';
      return;
    }

    this.procesandoOrden = true;
    this.errorOrden = '';

    // Crear el objeto con los datos del carrito y del formulario
    const orden = {
      productos: this.carrito.items.map(item => ({
        producto_id: item.producto.producto_id,
        nombre: item.producto.nombre_producto,
        cantidad: item.cantidad,
        precio: item.producto.precio
      })),
      total: this.carrito.total,
      nombre: this.checkoutForm.value.nombre,
      dni: this.checkoutForm.value.dni,
      empresa: this.checkoutForm.value.empresa,
      ruc: this.checkoutForm.value.ruc,
      ocupacion: this.checkoutForm.value.ocupacion,
      email: this.checkoutForm.value.email,
      telefono: this.checkoutForm.value.telefono,
      direccion: this.checkoutForm.value.direccion
    };

    // Agregar el console.log para ver qué datos estás enviando
    console.log('Datos de la orden:', orden);

    // Enviar la orden al backend
    this.carritoService.guardarCarrito(orden).subscribe({
      next: response => {
        console.log('Orden guardada:', response);
        this.ordenCompletada = true;
        Swal.fire( // Muestra la alerta
          'Éxito!',
          'La cotización se envió correctamente, nos pondremos en contacto con usted!',
          'success'
        );
        this.carritoService.vaciarCarrito(); // Vaciar el carrito después de guardar
        this.checkoutForm.reset();
      },
      error: error => {
        console.error('Error al guardar la orden:', error);
        this.errorOrden = 'Hubo un error al procesar la orden.';
        Swal.fire( // Muestra la alerta
          'Error!',
          'Hubo un error al enviar la cotización.',
          'error'
        );
      },
      complete: () => {
        this.procesandoOrden = false;
      }
    });
  }

}
