import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';;
import { CarritoWeb } from 'app/core/models/carritoWeb.model';
import { CarritoService } from 'app/core/services/carrito.service';
import { UserService } from 'app/core/services/user.service';
import { CotizacionPdfService } from 'app/core/services/cotizacion-pdf.service';
import Swal from 'sweetalert2';

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
  preciosOriginales: number[] = [];
  totalPrecioProductos: number = 0;
  carritoId: string = '';
  cotizacionExistente: boolean = false;
  estadoCotizacion: string = '';

  formasPago: string[] = ['Contado', 'Crédito 30 días', 'Crédito 60 días'];

  monedas: string[] = ['PEN', 'USD'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
    private authService: UserService,
    private pdfService: CotizacionPdfService
  ) {
    this.cotizacionForm = this.fb.group({
      carrito_id: ['', Validators.required],
      periodo: [new Date().toISOString().substring(0, 7), Validators.required],
      serie: ['001', Validators.required], // Valor por defecto '001'
      numero: [1],
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
      user_id: ['', Validators.required],
      observaciones: [''],
    });
  }

  ngOnInit(): void {
    this.carritoId = this.route.snapshot.paramMap.get('id') || '';

    // Primero verificamos si ya existe una cotización para este carrito
    this.carritoService.contarCotizaciones().subscribe((cotizaciones) => {
      console.log('Cotizaciones disponibles:', cotizaciones);
      // Buscar cotización por carrito_id (asegurando que ambos sean del mismo tipo)
      const cotizacionExistente = cotizaciones.find(c => String(c.carrito_id) === this.carritoId);

      if (cotizacionExistente) {
        console.log('Cotización existente encontrada:', cotizacionExistente);
        this.cotizacionExistente = true;
        this.cargarCotizacion(cotizacionExistente);
      } else {
        console.log('No se encontró cotización para el carrito:', this.carritoId);
        // Solo cargamos datos del carrito si no existe cotización
        this.cargarDatosCarrito(this.carritoId);
      }
    }, error => {
      console.error('Error al buscar cotizaciones:', error);
      // En caso de error, mostramos el carrito
      this.cargarDatosCarrito(this.carritoId);
    });

    this.cotizacionForm.get('moneda')?.valueChanges.subscribe((nuevaMoneda) => {
      this.convertirPrecios(nuevaMoneda);
    });

  }

  cargarCotizacion(cotizacion: any): void {
    if (!cotizacion) return;
    this.estadoCotizacion = cotizacion.estado || '';
    if (this.estadoCotizacion === 'COTIZADO') {
      this.cotizacionForm.disable();
    }

    console.log('Cargando cotización:', cotizacion);

    this.cotizacionForm.patchValue({
      carrito_id: cotizacion.carrito_id,
      serie: cotizacion.serie || '001',
      numero: cotizacion.numero || 1,
      periodo: cotizacion.periodo,
      fecha: cotizacion.fecha ? cotizacion.fecha.substring(0, 10) : new Date().toISOString().substring(0, 10),
      tipo_cambio: cotizacion.tipo_cambio || 3.75,
      punto_venta: cotizacion.punto_venta || 'Lima',
      razon_social: cotizacion.razon_social || '',
      ruc: cotizacion.ruc || '',
      nombre_contacto: cotizacion.nombre_contacto || '',
      dni_persona: cotizacion.dni_persona || '',
      email: cotizacion.email || '',
      telefono: cotizacion.telefono || '',
      forma_pago: cotizacion.forma_pago || 'Contado',
      dias_ofertas: cotizacion.dias_ofertas || '',
      moneda: cotizacion.moneda || 'PEN',
      user_id: cotizacion.user_id || this.authService.getCurrentUserId(),
      observaciones: cotizacion.observaciones || '',
    });

    // Cargar productos
    try {
      if (cotizacion.productos) {
        let productosArray;

        // El problema está aquí - productos viene como string con doble escape
        if (typeof cotizacion.productos === 'string') {
          // Primero parseamos el string exterior
          const productosParsed = JSON.parse(cotizacion.productos);

          // Si el resultado sigue siendo un string (caso de doble escape), lo parseamos de nuevo
          if (typeof productosParsed === 'string') {
            productosArray = JSON.parse(productosParsed);
          } else {
            productosArray = productosParsed;
          }
        } else {
          productosArray = cotizacion.productos;
        }

        if (Array.isArray(productosArray)) {
          this.productos = productosArray.map((prod: any) => ({
            ...prod,
            descuento: prod.descuento || 0,
            precio_descuento: prod.precio_descuento || prod.precio,
            sub_total: (prod.precio_descuento || prod.precio) * prod.cantidad,
          }));
          console.log('Productos procesados correctamente:', this.productos);
        } else {
          console.error('Formato de productos no válido:', productosArray);
          this.productos = [];
        }
      } else {
        this.productos = [];
      }

      // Calcular el total
      this.calcularTotales();
    } catch (error) {
      console.error('Error al procesar los productos de la cotización:', error);
      this.productos = [];
    }
  }

  cargarDatosCarrito(carritoId: string): void {
    this.carritoService.getCarritoById(carritoId).subscribe(
      (carrito: CarritoWeb) => {
        this.carrito = carrito;
        try {
          if (typeof carrito.productos === 'string') {
            this.productos = JSON.parse(carrito.productos);
            console.log('Productos parseados:', this.productos);
          } else {
            this.productos = carrito.productos as any[];
            console.log('Productos como array:', this.productos);
          }

          this.productos = this.productos.map(prod => {
            return {
              ...prod,
              descuento: 0,
              precio_descuento: prod.precio,
              sub_total: prod.precio * prod.cantidad
            };
          });

          this.calcularTotales();
        } catch (error) {
          console.error('Error al procesar productos:', error);
          this.productos = [];
        }

        this.cotizacionForm.patchValue({
          carrito_id: carritoId,  // Asegúrate de establecer el ID del carrito
          razon_social: carrito.empresa || '',
          ruc: carrito.ruc || '',
          dni_persona: carrito.dni || '',
          nombre_contacto: carrito.nombre || '',
          email: carrito.email || '',
          telefono: carrito.telefono || '',
          user_id: this.authService.getCurrentUserId() // Asegúrate de que este campo se establezca
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

    producto.sub_total = producto.precio_descuento * cantidad;

    this.calcularTotales();
  }

  calcularTotales(): void {
    this.totalPrecioProductos = this.productos.reduce((total, producto) => {
      return total + producto.sub_total;
    }, 0);
  }

  convertirPrecios(nuevaMoneda: string): void {
    const tipoCambio = this.cotizacionForm.get('tipo_cambio')?.value || 1;

    if (this.preciosOriginales.length === 0) {
      // Guardamos los precios originales solo una vez
      this.preciosOriginales = this.productos.map(p => p.precio);
    }

    if (nuevaMoneda === 'USD') {
      this.productos = this.productos.map((producto, i) => {
        const precioUSD = this.preciosOriginales[i] * tipoCambio;
        const precio_descuento = precioUSD * (1 - producto.descuento / 100);
        return {
          ...producto,
          precio: parseFloat(precioUSD.toFixed(2)),
          precio_descuento: parseFloat(precio_descuento.toFixed(2)),
          sub_total: parseFloat((precio_descuento * producto.cantidad).toFixed(2))
        };
      });
    } else {
      this.productos = this.productos.map((producto, i) => {
        const precioPEN = this.preciosOriginales[i];
        const precio_descuento = precioPEN * (1 - producto.descuento / 100);
        return {
          ...producto,
          precio: parseFloat(precioPEN.toFixed(2)),
          precio_descuento: parseFloat(precio_descuento.toFixed(2)),
          sub_total: parseFloat((precio_descuento * producto.cantidad).toFixed(2))
        };
      });
    }

    this.calcularTotales();
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

    // Asegurarnos de usar el ID del carrito correcto
    const carritoId = this.carritoId || this.carrito?.carrito_id;

    if (!carritoId) {
      alert('No se pudo obtener el ID del carrito.');
      return;
    }

    const cotizacion = {
      ...this.cotizacionForm.value,
      productos: JSON.stringify(this.productos), // Asegurarnos de enviar productos como cadena JSON
      total_precio_productos: this.totalPrecioProductos,
      carrito_id: carritoId,
      vendedor_asignado_id: vendedorId
    };

    console.log('Datos de cotización a enviar:', cotizacion);

    this.carritoService.guardarCotizacion(cotizacion).subscribe(
      (response) => {
        Swal.fire(
          'Éxito!',
          'La cotización se creó correctamente.',
          'success'
        );
        this.router.navigate(['/admin/cotizacionWeb']);
      },
      (error) => {
        console.error('Error al guardar la cotización:', error);
        Swal.fire(
          'Error!',
          'Hubo un problema al crear la cotización: ' +
          (error.error?.message || error.message || 'Error desconocido'),
          'error'
        );
      }
    );
  }

  generarPDF(): void {
    if (this.cotizacionForm.invalid) {
      alert('Por favor complete todos los campos requeridos antes de generar el PDF.');
      return;
    }

    if (this.productos.length === 0) {
      alert('No hay productos para incluir en la cotización.');
      return;
    }

    this.pdfService.generarPDF(this.cotizacionForm, this.productos, this.totalPrecioProductos);
  }
}
