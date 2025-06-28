import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CotizacionManual } from 'app/core/models/cotizacionManual.model';
import { CotizacionProducto } from 'app/core/models/prodCM.model';
import { CotizacionManualService } from 'app/core/services/cotizacion-manual.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';

@Component({
  selector: 'app-create-cotizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-cotizacion.component.html',
  styleUrl: './create-cotizacion.component.css'
})
export class CreateCotizacionComponent {
  cotizacionForm!: FormGroup;
  productos: any[] = []; // Lista de productos seleccionados para cotizar
  totalPrecioProductos = 0;
  estadoCotizacion: string = '';
  formasPago = ['Contado', 'Crédito'];
  monedas = ['PEN', 'USD'];
  productoBuscado: string = '';
  productosFiltrados: any[] = [];
  todosLosProductos: any[] = [];


  cotizacionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cotizacionService: CotizacionManualService,
    private productoService: ProductoAGService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.cotizacionId = this.route.snapshot.paramMap.get('id');
  this.initForm();

  if (this.cotizacionId) {
    this.cargarCotizacionExistente(this.cotizacionId);
  }

  this.productoService.allProductos().subscribe((data) => {
    this.todosLosProductos = data;
  });
}

  initForm(): void {
    this.cotizacionForm = this.fb.group({
      periodo: ['', Validators.required],
      serie: [{ value: '', disabled: true }],
      numero: [{ value: '', disabled: true }],
      fecha: ['', Validators.required],
      tipo_cambio: ['', Validators.required],
      punto_venta: ['', Validators.required],
      razon_social: [''],
      ruc: [''],
      nombre_contacto: ['', Validators.required],
      dni_persona: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      forma_pago: ['', Validators.required],
      dias_ofertas: ['', Validators.required],
      moneda: ['', Validators.required],
      observaciones: [''],
      user_id: [''] // reemplazar con auth real
    });
  }

  cargarCotizacionExistente(id: string): void {
  this.cotizacionService.getCotizacionById(id).subscribe(cotizacion => {
    this.estadoCotizacion = cotizacion.estado || '';
    this.productos = cotizacion.productos || [];
    this.cotizacionForm.patchValue(cotizacion);
    this.cotizacionForm.get('serie')?.setValue(cotizacion.serie);
    this.cotizacionForm.get('numero')?.setValue(cotizacion.numero);
    this.productos = cotizacion.productos || [];
    this.recalcularTotal();
  });
}

  buscarProductos(): void {
    const termino = this.productoBuscado.toLowerCase().trim();
    if (termino.length === 0) {
      this.productosFiltrados = [];
      return;
    }

    this.productosFiltrados = this.todosLosProductos.filter((prod) =>
      prod.nombre.toLowerCase().includes(termino)
    );
  }

  agregarProducto(producto: any): void {
    const productoAñadido = {
      ...producto,
      cantidad: 1,
      descuento: 0,
      precio_descuento: producto.precio,
      sub_total: producto.precio,
    };

    this.productos.push(productoAñadido);
    this.productoBuscado = '';
    this.productosFiltrados = [];
    this.recalcularTotal();
  }

  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
    this.recalcularTotal();
  }

  obtenerProductos(): void {
    this.productoService.allProductos().subscribe(data => {
      // podrías usar esta lista para autocompletar productos en la tabla
    });
  }

  actualizarPrecio(index: number, event: any): void {
    const precio = parseFloat(event.target.value);
    this.productos[index].precio = precio;
    this.actualizarSubtotal(index);
  }

  actualizarDescuento(index: number, event: any): void {
    const descuento = parseFloat(event.target.value);
    this.productos[index].descuento = descuento;
    this.actualizarSubtotal(index);
  }

  actualizarSubtotal(index: number): void {
    const p = this.productos[index];
    p.precio_descuento = p.precio * (1 - (p.descuento || 0) / 100);
    p.sub_total = p.precio_descuento * p.cantidad;
    this.recalcularTotal();
  }

  recalcularTotal(): void {
    this.totalPrecioProductos = this.productos.reduce((acc, p) => acc + p.sub_total, 0);
  }

  guardarCotizacion(): void {
    if (this.cotizacionForm.invalid) return;

    const cotizacion: CotizacionManual = {
      ...this.cotizacionForm.getRawValue(),
      total_precio_productos: this.totalPrecioProductos
    };

    const productos: CotizacionProducto[] = this.productos.map(p => ({
      cotizacion_id: '', // se asigna en backend
      producto_id: p.producto_id || null,
      nombre_producto: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad,
      unidad: p.unidad,
      subtotal: p.sub_total
    }));

    this.cotizacionService.crearCotizacionConProductos(cotizacion, productos).subscribe(() => {
      this.router.navigate(['/admin/cotizacionManual']);
    });
  }
}
