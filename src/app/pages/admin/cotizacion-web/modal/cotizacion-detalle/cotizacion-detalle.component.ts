import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';;
import { CarritoWeb } from 'app/core/models/carritoWeb.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { UserService } from 'app/core/services/user.service';

@Component({
  selector: 'app-cotizacion-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cotizacion-detalle.component.html',
  styleUrl: './cotizacion-detalle.component.css'
})
export class CotizacionDetalleComponent implements OnInit {

  cotizacionForm: FormGroup;
  carrito: CarritoWeb | null = null;
  productos: any[] = [];
  totalPrecioProductos: number = 0;

  // Lista de vendedores (puedes cargarla desde una API)
  vendedores: string[] = ['Juan Pérez', 'María López', 'Carlos Rodríguez'];

  // Opciones para formas de pago
  formasPago: string[] = ['Contado', 'Crédito 30 días', 'Crédito 60 días', 'Leasing'];

  // Monedas disponibles
  monedas: string[] = ['PEN', 'USD'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
    private authService: UserService,
  ) {
    this.cotizacionForm = this.fb.group({
      periodo: [new Date().toISOString().substring(0, 7), Validators.required],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      tipo_cambio: [3.75, [Validators.required, Validators.min(0.01)]],
      punto_venta: ['Lima', Validators.required],
      razon_social: [''],
      ruc: [''],
      nombre_contacto: ['', Validators.required],
      dni_persona: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      forma_pago: ['Contado', Validators.required],
      dias_ofertas: ['', Validators.required],
      moneda: ['PEN', Validators.required],
      vendedor_trabajador: [this.vendedores[0], Validators.required],
      observaciones: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const carritoId = params['id'];
      if (carritoId) {
        this.cargarDatosCarrito(carritoId);
      }
    });
  }

  cargarDatosCarrito(carritoId: string): void {
    this.carritoService.getCarritoById(carritoId).subscribe(
      (carrito: CarritoWeb) => {
        this.carrito = carrito;

        // Parsear productos del carrito (que viene como string JSON)
        if (typeof carrito.productos === 'string') {
          this.productos = JSON.parse(carrito.productos);
        } else {
          this.productos = carrito.productos as any[];
        }

        // Agregar campos adicionales a cada producto
        this.productos = this.productos.map(prod => {
          return {
            ...prod,
            descuento: 0,
            precio_descuento: prod.precio,
            sub_total: prod.precio * prod.cantidad
          };
        });

        this.calcularTotales();

        // Actualizar el formulario con los datos del carrito
        this.cotizacionForm.patchValue({
          razon_social: carrito.empresa || '',
          ruc: carrito.ruc || '',
          dni_persona: carrito.dni || '',
          nombre_contacto: carrito.nombre || '',
          email: carrito.email || '',
          telefono: carrito.telefono || ''
        });
      },
      error => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

  actualizarDescuento(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const descuento = parseFloat(input.value);

    const producto = this.productos[index];
    producto.descuento = descuento;

    // Calcular precio con descuento
    const descuentoDecimal = descuento / 100;
    producto.precio_descuento = producto.precio * (1 - descuentoDecimal);

    // Calcular subtotal
    producto.sub_total = producto.precio_descuento * producto.cantidad;

    this.calcularTotales();
  }

  actualizarPrecio(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nuevoPrecio = parseFloat(input.value);

    const producto = this.productos[index];
    producto.precio = nuevoPrecio;

    // Si hay descuento aplicado, actualizamos el precio con descuento
    if (producto.descuento > 0) {
      const descuentoDecimal = producto.descuento / 100;
      producto.precio_descuento = nuevoPrecio * (1 - descuentoDecimal);
    } else {
      producto.precio_descuento = nuevoPrecio;
    }

    // Recalcular subtotal
    producto.sub_total = producto.precio_descuento * producto.cantidad;

    this.calcularTotales();
  }

  actualizarCantidad(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const cantidad = parseInt(input.value, 10);

    const producto = this.productos[index];
    producto.cantidad = cantidad;

    // Recalcular subtotal
    producto.sub_total = producto.precio_descuento * cantidad;

    this.calcularTotales();
  }

  calcularTotales(): void {
    this.totalPrecioProductos = this.productos.reduce((total, producto) => {
      return total + producto.sub_total;
    }, 0);
  }

  guardarCotizacion(): void {
    if (this.cotizacionForm.invalid) {
      Object.keys(this.cotizacionForm.controls).forEach(key => {
        const control = this.cotizacionForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const vendedorId = this.authService.getCurrentUserId();

    if (!vendedorId) {
      alert('No se pudo obtener el ID del usuario. Inicie sesión nuevamente.');
      return;
    }

    const cotizacion = {
      ...this.cotizacionForm.value,
      productos: this.productos,
      total_precio_productos: this.totalPrecioProductos,
      carrito_id: this.carrito?.carrito_id,
      vendedor_asignado_id: vendedorId
    };

    this.carritoService.guardarCotizacion(cotizacion).subscribe(
      (response) => {
        alert('Cotización guardada con éxito');
        this.router.navigate(['cotizaciones']);
      },
      (error) => {
        console.error('Error al guardar la cotización:', error);
        alert('Error al guardar la cotización. Por favor, intente nuevamente.');
      }
    );
  }
}
