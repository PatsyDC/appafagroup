import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cotizacion } from 'app/core/models/cotizacion.model';
import { CotizacionesService } from 'app/core/services/cotizaciones.service';

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css'
})
export class CotizacionComponent implements OnInit {

  cotizacionForm!: FormGroup;

  cotizaciones: Cotizacion[] = [];

  editingCotizacion: Cotizacion | null = null;

  constructor(private cotizacionService: CotizacionesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cotizacionService.getCotizaciones().subscribe((data: Cotizacion[]) => {
      this.cotizaciones = data;
    });

    this.initForm();
  }

  initForm(): void {
    this.cotizacionForm = this.fb.group({
      periodo: ['', Validators.required],
      serie: ['', Validators.required],
      numero: [null, [Validators.required, Validators.min(1)]],
      fecha: ['', Validators.required],
      TC: [null, [Validators.required, Validators.min(0)]],
      punto_venta: ['', Validators.required],
      dni_ruc: ['', Validators.required],
      razon_social: ['', Validators.required],
      gmail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      forma_pago: ['', Validators.required],
      dias_oferta: [null, Validators.required],
      moneda: ['', Validators.required],
      observacion: [''],
      id_producto: [null, Validators.required],
      cantidad_producto: [null, [Validators.required, Validators.min(1)]],
      precio_producto: [null, [Validators.required, Validators.min(0)]],
      descuento: [null, [Validators.min(0)]],
      precio_total: [{value: null, disabled: true}, Validators.required]
    });

    this.cotizacionForm.get('cantidad_producto')?.valueChanges.subscribe(() => this.calcularPrecioTotal());
    this.cotizacionForm.get('precio_producto')?.valueChanges.subscribe(() => this.calcularPrecioTotal());
    this.cotizacionForm.get('descuento')?.valueChanges.subscribe(() => this.calcularPrecioTotal());
  }

  calcularPrecioTotal(): void {
    const cantidad = this.cotizacionForm.get('cantidad_producto')?.value || 0;
    const precio = this.cotizacionForm.get('precio_producto')?.value || 0;
    const descuento = this.cotizacionForm.get('descuento')?.value || 0;

    const precioTotal = (cantidad * precio) - descuento;

    this.cotizacionForm.patchValue({
      precio_total: precioTotal
    }, { emitEvent: false });
  }

  onSubmit(): void {
    this.cotizacionForm.get('precio_total')?.enable();

    if (this.cotizacionForm.valid) {
      const cotizacion: Cotizacion = this.cotizacionForm.value;

      if (this.editingCotizacion) {
        // Modo edición
        cotizacion.id = this.editingCotizacion.id;
        this.cotizacionService.putCotizacion(cotizacion).subscribe(
          response => {
            console.log('Cotización actualizada con éxito', response);
            const index = this.cotizaciones.findIndex(c => c.id === cotizacion.id);
            if (index !== -1) {
              this.cotizaciones[index] = cotizacion;
            }
            this.resetForm();
          },
          error => {
            console.error('Error al actualizar la cotización', error);
          }
        );
      } else {
        // Modo creación
        this.cotizacionService.postCotizacion(cotizacion).subscribe(
          response => {
            console.log('Cotización creada con éxito', response);
            this.cotizaciones.push(response);
            this.resetForm();
          },
          error => {
            console.error('Error al crear la cotización', error);
          }
        );
      }
    }
  }

  editCotizacion(cotizacion: Cotizacion): void {
    this.editingCotizacion = cotizacion;
    this.cotizacionForm.patchValue(cotizacion);
  }

  resetForm(): void {
    this.cotizacionForm.reset();
    this.editingCotizacion = null;
  }

  deleteCotizacion(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta cotización?')) {
      this.cotizacionService.deleteCotizacion(id).subscribe(
        response => {
          console.log('Cotización eliminada con éxito', response);
          this.cotizaciones = this.cotizaciones.filter(cotizacion => cotizacion.id !== id);
        },
        error => {
          console.error('Error al eliminar la cotización', error);
        }
      );
    }
  }
}
