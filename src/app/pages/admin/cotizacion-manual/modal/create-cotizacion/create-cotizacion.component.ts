import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICliente } from 'app/core/models/cliente.model';
import { CotizacionManual } from 'app/core/models/cotizacionManual.model';
import { CotizacionProducto } from 'app/core/models/prodCM.model';
import { IProductoAG } from 'app/core/models/productoAG.model';
import { ClienteService } from 'app/core/services/cliente.service';
import { CotizacionManualService } from 'app/core/services/cotizacion-manual.service';
import { CotizacionPdfService } from 'app/core/services/cotizacion-pdf.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { UserService } from 'app/core/services/user.service';
import { debounceTime, distinctUntilChanged, forkJoin, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-cotizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './create-cotizacion.component.html',
  styleUrl: './create-cotizacion.component.css'
})
export class CreateCotizacionComponent implements OnInit {
  cotizacionForm!: FormGroup;
  productos: any[] = [];
  totalPrecioProductos = 0;
  estadoCotizacion: string = '';
  formasPago = ['Contado', 'Crédito'];
  monedas = ['PEN', 'USD'];
  userId: number | null = null;
  modoSoloLectura: boolean = false;

  productoBuscado: string = '';
  productosFiltrados: any[] = [];
  todosLosProductos: IProductoAG[] = [];
  mostrarListaProductos: boolean = false;

  nuevoProducto: any = {
    producto_id: null,
    nombre: '',
    precio: 0,
    cantidad: 1,
    descuento: 0,
    precio_descuento: 0,
    sub_total: 0,
    unidad: 'UND',
    codigo: ''
  };

  productosSugeridos: IProductoAG[] = [];
  mostrarSugerenciasProducto: boolean = false;

  clientesBuscados: ICliente[] = [];
  mostrarListaClientes: boolean = false;
  clienteSeleccionado: ICliente | null = null;

  cotizacionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cotizacionService: CotizacionManualService,
    private productoService: ProductoAGService,
    private authService: UserService,
    private clienteService: ClienteService,
    private pdfService: CotizacionPdfService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    if (!this.userId) {
      alert('Usuario no autenticado. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    this.cotizacionId = this.route.snapshot.paramMap.get('id');
    this.initForm();

    // Solo establecer fecha y periodo si estás creando una nueva cotización
    if (!this.cotizacionId) {
      const hoy = new Date();

      const fechaISO = hoy.toISOString().split('T')[0]; // yyyy-mm-dd
      const periodo = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}`; // yyyy-mm

      this.cotizacionForm.patchValue({
        fecha: fechaISO,
        periodo: periodo
      });
    }

    if (this.cotizacionId) {
      this.cargarCotizacionExistente(this.cotizacionId);
    }

    this.productoService.allProductos().subscribe((data: IProductoAG[]) => {
      this.todosLosProductos = data;
    });

    this.setupAutocompletadoCliente();
  }

  initForm(): void {
    this.cotizacionForm = this.fb.group({
      periodo: ['', Validators.required],
      serie: ['001'],
      numero: [{ value: '', disabled: true }],
      fecha: ['', Validators.required],
      tipo_cambio: ['', Validators.required],
      cliente_id: [null],
      punto_venta: ['', Validators.required],
      razon_social: ['', Validators.required],
      ruc: [''],
      nombre_contacto: ['', Validators.required],
      dni_persona: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      forma_pago: ['', Validators.required],
      dias_ofertas: ['', Validators.required],
      moneda: ['', Validators.required],
      observaciones: [''],
      user_id: [this.userId, Validators.required]
    });
  }

  setupAutocompletadoCliente(): void {
    this.cotizacionForm.get('razon_social')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(valor => {
        if (valor && valor.length >= 2) {
          return this.clienteService.buscarClientesPorRazonSocial(valor);
        }
        return [];
      })
    ).subscribe(clientes => {
      this.clientesBuscados = clientes;
      this.mostrarListaClientes = clientes.length > 0;
    });
  }

  seleccionarCliente(cliente: ICliente): void {
    this.clienteSeleccionado = cliente;
    this.mostrarListaClientes = false;
    this.cotizacionForm.patchValue({
      cliente_id: cliente.cliente_id,
      razon_social: cliente.razon_social,
      ruc: cliente.codigo_ruc,
      telefono: cliente.telefono || '',
      email: cliente.correo,
      nombre_contacto: cliente.nombre_persona || '',
      dni_persona: cliente.nro_dni || ''
    });
  }

  limpiarSeleccionCliente(): void {
    this.clienteSeleccionado = null;
    this.mostrarListaClientes = false;
    this.cotizacionForm.patchValue({
      cliente_id: null,
      ruc: '',
      telefono: '',
      email: '',
      nombre_contacto: '',
      dni_persona: ''
    });
  }

  ocultarListaClientes(): void {
    setTimeout(() => this.mostrarListaClientes = false, 200);
  }

  buscarProductosEnTabla(event: any): void {
    const termino = event.target.value.toLowerCase().trim();

    if (termino.length >= 2) {
      this.productosSugeridos = this.todosLosProductos.filter(prod => {
        return (prod.nombre_producto?.toLowerCase().includes(termino) ||
                prod.codigo_sunat?.toLowerCase().includes(termino) ||
                prod.nombre_comercial?.toLowerCase().includes(termino));
      }).slice(0, 8);
      this.mostrarSugerenciasProducto = this.productosSugeridos.length > 0;
    } else {
      this.productosSugeridos = [];
      this.mostrarSugerenciasProducto = false;
    }
  }

  seleccionarProductoEnTabla(producto: IProductoAG): void {
    this.nuevoProducto = {
      producto_id: producto.producto_id,
      nombre: producto.nombre_producto,
      precio: producto.precio || 0,
      cantidad: 1,
      descuento: 0,
      precio_descuento: producto.precio || 0,
      sub_total: producto.precio || 0,
      unidad: 'UND',
      codigo: producto.codigo_sunat
    };
    this.calcularSubtotalNuevo();
    this.mostrarSugerenciasProducto = false;
  }

  calcularSubtotalNuevo(): void {
    const { precio, cantidad, descuento } = this.nuevoProducto;
    const desc = descuento / 100;
    this.nuevoProducto.precio_descuento = precio * (1 - desc);
    this.nuevoProducto.sub_total = this.nuevoProducto.precio_descuento * cantidad;
  }

  agregarProductoATabla(): void {
    if (!this.esProductoValidoParaAgregar()) return;

    const existente = this.productos.find(p =>
      p.producto_id === this.nuevoProducto.producto_id && this.nuevoProducto.producto_id !== null);

    if (existente) {
      existente.cantidad += this.nuevoProducto.cantidad;
      this.actualizarSubtotalProducto(existente);
    } else {
      this.productos.push({ ...this.nuevoProducto });
    }

    this.limpiarNuevoProducto();
    this.recalcularTotal();
  }

  limpiarNuevoProducto(): void {
    this.nuevoProducto = {
      producto_id: null,
      nombre: '',
      precio: 0,
      cantidad: 1,
      descuento: 0,
      precio_descuento: 0,
      sub_total: 0,
      unidad: 'UND',
      codigo: ''
    };
  }

  esProductoValidoParaAgregar(): boolean {
    return this.nuevoProducto.nombre.trim() !== '' &&
          this.nuevoProducto.precio > 0 &&
          this.nuevoProducto.cantidad > 0;
  }

  actualizarSubtotalProducto(producto: any): void {
    const desc = producto.descuento / 100;
    producto.precio_descuento = producto.precio * (1 - desc);
    producto.sub_total = producto.precio_descuento * producto.cantidad;
  }

  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
    this.recalcularTotal();
  }

  actualizarCantidad(index: number, event: any): void {
    const cantidad = parseInt(event.target.value) || 1;
    this.productos[index].cantidad = Math.max(1, cantidad);
    this.actualizarSubtotalProducto(this.productos[index]);
    this.recalcularTotal();
  }

  actualizarPrecio(index: number, event: any): void {
    const precio = parseFloat(event.target.value) || 0;
    this.productos[index].precio = Math.max(0, precio);
    this.actualizarSubtotalProducto(this.productos[index]);
    this.recalcularTotal();
  }

  actualizarDescuento(index: number, event: any): void {
    const descuento = parseFloat(event.target.value) || 0;
    this.productos[index].descuento = Math.max(0, Math.min(100, descuento));
    this.actualizarSubtotalProducto(this.productos[index]);
    this.recalcularTotal();
  }

  recalcularTotal(): void {
    this.totalPrecioProductos = this.productos.reduce((total, p) => total + (p.sub_total || 0), 0);
  }

cargarCotizacionExistente(id: string): void {
  console.log('🆔 INICIO - ID de cotización a cargar:', id);
  console.log('🆔 INICIO - Tipo del ID:', typeof id);

  forkJoin({
    cotizacionRes: this.cotizacionService.getCotizacionById(id),
    productosRes: this.cotizacionService.getProductosByCotizacion(id)
  }).subscribe({
    next: ({ cotizacionRes, productosRes }) => {
      console.log('🔍 Respuesta completa de cotización:', cotizacionRes);
      console.log('🔍 Respuesta completa de productos:', productosRes);
      console.log('🔍 URL que debería llamarse:', `cotizacion-productos/cotizacion/${id}`);

      const cotizacion = cotizacionRes.body;

      // Extraer productos según la estructura de respuesta de tu API
      let productos: any[] = [];

      // Tu API devuelve: {ok: true, status: 200, body: [...]}
      if (productosRes && typeof productosRes === 'object' && productosRes.body) {
        productos = Array.isArray(productosRes.body) ? productosRes.body : [];
      }
      // Si la respuesta es directamente un array (fallback)
      else if (Array.isArray(productosRes)) {
        productos = productosRes;
      }
      // Si la respuesta tiene otra estructura
      else {
        console.warn('⚠️ Estructura de productos no reconocida:', productosRes);
        productos = [];
      }

      console.log('📦 Productos procesados:', productos);

      this.estadoCotizacion = cotizacion.estado || '';
      this.modoSoloLectura = this.estadoCotizacion === 'COTIZADO';
      this.productos = productos;

      // Mapear productos al formato correcto si es necesario
      this.productos = productos.map((p: any) => ({
        producto_id: p.producto_id,
        nombre: p.nombre_producto || p.nombre,
        precio: p.precio || 0,
        cantidad: p.cantidad || 1,
        descuento: p.descuento || 0,
        precio_descuento: p.precio_descuento || p.precio || 0,
        sub_total: p.subtotal || p.sub_total || 0,
        unidad: p.unidad || 'UND',
        codigo: p.codigo || ''
      }));

      this.cotizacionForm.patchValue({
        periodo: cotizacion.periodo,
        fecha: cotizacion.fecha,
        tipo_cambio: cotizacion.tipo_cambio,
        cliente_id: cotizacion.cliente_id,
        punto_venta: cotizacion.punto_venta,
        razon_social: cotizacion.razon_social,
        ruc: cotizacion.ruc,
        nombre_contacto: cotizacion.nombre_contacto,
        dni_persona: cotizacion.dni_persona,
        email: cotizacion.email,
        telefono: cotizacion.telefono,
        forma_pago: cotizacion.forma_pago,
        dias_ofertas: cotizacion.dias_ofertas,
        moneda: cotizacion.moneda,
        observaciones: cotizacion.observaciones,
        user_id: cotizacion.user_id,
      });

      this.cotizacionForm.get('serie')?.setValue(cotizacion.serie);
      this.cotizacionForm.get('numero')?.setValue(cotizacion.numero);

      this.recalcularTotal();
      if (this.modoSoloLectura) {
        this.cotizacionForm.disable();
      }

      console.log('✅ Cotización y productos cargados exitosamente');
      console.log('📊 Total calculado:', this.totalPrecioProductos);
    },
    error: (error) => {
      console.error('❌ Error al cargar cotización existente:', error);
      alert('Error al cargar la cotización: ' + (error.message || 'Error desconocido'));
    }
  });
}

guardarCotizacion(): void {
  if (this.cotizacionForm.invalid) {
    this.marcarCamposComoTocados();
    return;
  }

  if (this.productos.length === 0) {
    alert('Debe agregar al menos un producto a la cotización');
    return;
  }

  const cotizacion: CotizacionManual = {
    ...this.cotizacionForm.getRawValue(),
    total_precio_productos: this.totalPrecioProductos
  };

  const productos: CotizacionProducto[] = this.productos.map(p => ({
    cotizacion_id: '', // se asigna en backend
    producto_id: p.producto_id,
    nombre_producto: p.nombre,
    precio: p.precio,
    cantidad: p.cantidad,
    unidad: p.unidad,
    subtotal: p.sub_total
  }));

  console.log('📋 Datos de cotización a enviar:', cotizacion);
  console.log('📦 Productos a enviar:', productos);

  if (this.cotizacionId) {
    this.cotizacionService.updateCotizacion(this.cotizacionId, cotizacion).subscribe(() => {
      this.router.navigate(['/admin/cotizacionManual']);
    });
  } else {
    this.cotizacionService.crearCotizacionConProductos(cotizacion, productos).subscribe({
      next: (resultado) => {
        console.log('✅ Cotización y productos guardados exitosamente:', resultado);
        alert('Cotización creada exitosamente');
        this.router.navigate(['/admin/cotizacionManual']);
      },
      error: (err) => {
        console.error('❌ Error detallado al guardar:', err);
        console.error('❌ Error del servidor:', err.error);

        let mensajeError = 'Hubo un error al guardar la cotización';
        if (err.error?.message) {
          mensajeError += ': ' + err.error.message;
        }

        alert(mensajeError);
      }
    });
  }
}

  marcarCamposComoTocados(): void {
    Object.keys(this.cotizacionForm.controls).forEach(key => {
      const control = this.cotizacionForm.get(key);
      if (control) control.markAsTouched();
    });
  }

  generarPDF(): void {
    if (this.cotizacionForm.invalid) {
      this.marcarCamposComoTocados();
      alert('Por favor completa todos los campos requeridos antes de generar el PDF.');
      return;
    }

    if (this.productos.length === 0) {
      alert('Debe agregar al menos un producto para generar la cotización en PDF.');
      return;
    }

    console.log('📄 Generando PDF con datos:');
    console.log('🧾 Formulario:', this.cotizacionForm.getRawValue());
    console.log('📦 Productos:', this.productos);
    console.log('💵 Total:', this.totalPrecioProductos);

    this.pdfService.generarPDF(this.cotizacionForm, this.productos, this.totalPrecioProductos);
  }

}
