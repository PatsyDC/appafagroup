import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CarritoService } from 'app/core/services/carrito.service';
import { ProductoAGService } from 'app/core/services/productoAG.service';
import { Utils } from './util';
import { Chart, registerables,ChartDataset, ChartConfiguration, ChartType } from 'chart.js';
import { CotizacionManualService } from 'app/core/services/cotizacion-manual.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit, AfterViewInit {
  @ViewChild('cotizacionesWebChart', { static: false }) cotizacionesWebChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cotizacionesManualesChart', { static: false }) cotizacionesManualesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cotizacionesTotalesChart', { static: false }) cotizacionesTotalesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productosMasCotizadosChart', { static: false }) productosMasCotizadosChart!: ElementRef<HTMLCanvasElement>;

  totalTrabajadores: number = 0;
  totalProductos: number = 0;
  totalCotizacionesWeb: number = 0;
  totalCotizacionesManuales: number = 0;
  totalCotizacionesCombinadas: number = 0;

  private chartWeb: Chart | undefined;
  private chartManuales: Chart | undefined;
  private chartProductos: Chart | undefined;

  constructor(
    private productoAGService: ProductoAGService,
    private cotizacionService: CarritoService,
    private cotizacionManualService: CotizacionManualService
  ) {
    // Registrar Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadProductos();
    this.loadCotizacionesWeb();
    this.loadCotizacionesManuales();
  }

  ngAfterViewInit(): void {
    // Agregar un pequeño delay para asegurar que los elementos estén completamente renderizados
    setTimeout(() => {
      this.createCotizacionesWebChart();
      this.createCotizacionesManualesChart();
      this.createCotizacionesComparadasChart();
      this.createProductosMasCotizadosChart();
    }, 100);
  }

  actualizarTotalCotizaciones(): void {
    this.totalCotizacionesCombinadas =
      (this.totalCotizacionesWeb || 0) + (this.totalCotizacionesManuales || 0);
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

  loadCotizacionesWeb(): void {
    this.cotizacionService.contarCotizaciones().subscribe({
      next: (cotizaciones) => {
        this.totalCotizacionesWeb = cotizaciones.length;
        this.actualizarTotalCotizaciones();
      },
      error: (err) => {
        console.error('Error al cargar cotizaciones web:', err);
      }
    });
  }

  loadCotizacionesManuales(): void {
    this.cotizacionManualService.getCotizacionesGrafica().subscribe({
      next: (cotizaciones) => {
        this.totalCotizacionesManuales = cotizaciones.length;
        this.actualizarTotalCotizaciones();
      },
      error: (err) => {
        console.error('Error al cargar cotizaciones manuales:', err);
      }
    });
  }

  createCotizacionesWebChart(): void {
    if (!this.cotizacionesWebChart?.nativeElement) {
      console.warn('Elemento del gráfico web no encontrado');
      return;
    }

    this.cotizacionService.getCotizacionesPorMes().subscribe({
      next: (data) => {
        console.log('Datos recibidos para gráfico web:', data);

        // Validar que data sea un array
        if (!Array.isArray(data)) {
          console.error('Los datos recibidos no son un array:', data);
          return;
        }

        const ctx = this.cotizacionesWebChart.nativeElement.getContext('2d');
        if (ctx) {
          // Destruir chart anterior si existe
          if (this.chartWeb) {
            this.chartWeb.destroy();
          }

          // Generar arrays de colores para cada barra
          const backgroundColors = data.map((_, index) =>
            Utils.transparentize(Utils.getColorForSpecies(index), 0.7)
          );

          const borderColors = data.map((_, index) =>
            Utils.getColorForSpecies(index)
          );

          const config: ChartConfiguration = {
            type: 'bar' as ChartType,
            data: {
              labels: data.map(item => item.mes),
              datasets: [{
                label: 'Cotizaciones Web',
                data: data.map(item => item.cantidad),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Cotizaciones Web por Mes',
                  font: {
                    size: 16,
                    weight: 'bold'
                  },
                  color: Utils.CHART_COLORS.azul_noche
                },
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    color: Utils.CHART_COLORS.gris
                  },
                  grid: {
                    color: Utils.transparentize(Utils.CHART_COLORS.gris, 0.3)
                  }
                },
                x: {
                  ticks: {
                    color: Utils.CHART_COLORS.gris,
                    maxRotation: 45
                  },
                  grid: {
                    display: false
                  }
                }
              },
              elements: {
                bar: {
                  borderRadius: 8
                }
              }
            }
          };

          this.chartWeb = new Chart(ctx, config);
        }
      },
      error: (err) => {
        console.error('Error al cargar datos para la gráfica web:', err);
      }
    });
  }

  createCotizacionesManualesChart(): void {
    if (!this.cotizacionesManualesChart?.nativeElement) {
      console.warn('Elemento del gráfico manual no encontrado');
      return;
    }

    this.cotizacionManualService.getCotizacionesManualesPorMes().subscribe({
      next: (data) => {
        console.log('Datos recibidos para gráfico manual:', data);

        // Validar que data sea un array
        if (!Array.isArray(data)) {
          console.error('Los datos recibidos no son un array:', data);
          return;
        }

        const ctx = this.cotizacionesManualesChart.nativeElement.getContext('2d');
        if (ctx) {
          // Destruir chart anterior si existe
          if (this.chartManuales) {
            this.chartManuales.destroy();
          }

          // Generar arrays de colores para cada barra (empezando desde un índice diferente para variedad)
          const backgroundColors = data.map((_, index) =>
            Utils.transparentize(Utils.getColorForSpecies(index + 3), 0.7)
          );

          const borderColors = data.map((_, index) =>
            Utils.getColorForSpecies(index + 3)
          );

          const config: ChartConfiguration = {
            type: 'bar' as ChartType,
            data: {
              labels: data.map(item => item.mes),
              datasets: [{
                label: 'Cotizaciones Manuales',
                data: data.map(item => item.cantidad),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Cotizaciones Manuales por Mes',
                  font: {
                    size: 16,
                    weight: 'bold'
                  },
                  color: Utils.CHART_COLORS.azul_noche
                },
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    color: Utils.CHART_COLORS.gris
                  },
                  grid: {
                    color: Utils.transparentize(Utils.CHART_COLORS.gris, 0.3)
                  }
                },
                x: {
                  ticks: {
                    color: Utils.CHART_COLORS.gris,
                    maxRotation: 45
                  },
                  grid: {
                    display: false
                  }
                }
              },
              elements: {
                bar: {
                  borderRadius: 8
                }
              }
            }
          };

          this.chartManuales = new Chart(ctx, config);
        }
      },
      error: (err) => {
        console.error('Error al cargar datos para la gráfica manual:', err);
        console.error('Detalles del error:', err);
      }
    });
  }

  createCotizacionesComparadasChart(): void {
  forkJoin([
    this.cotizacionService.getCotizacionesPorMes(),
    this.cotizacionManualService.getCotizacionesManualesPorMes()
  ]).subscribe(([webData, manualData]) => {
    // Unificar todos los meses presentes
    const allMonthsSet = new Set([
      ...webData.map(item => item.mes),
      ...manualData.map(item => item.mes)
    ]);
    const allMonths = Array.from(allMonthsSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Mapear cantidades por mes para cada fuente
    const webMap = new Map(webData.map(item => [item.mes, item.cantidad]));
    const manualMap = new Map(manualData.map(item => [item.mes, item.cantidad]));

    const webValues = allMonths.map(mes => webMap.get(mes) || 0);
    const manualValues = allMonths.map(mes => manualMap.get(mes) || 0);

    const ctx = this.cotizacionesTotalesChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allMonths,
        datasets: [
          {
            label: 'Cotizaciones Web',
            data: webValues,
            fill: false,
            borderColor: Utils.CHART_COLORS.azul_noche,
            tension: 0.3
          },
          {
            label: 'Cotizaciones Manuales',
            data: manualValues,
            fill: false,
            borderColor: Utils.CHART_COLORS.verde,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Comparación Mensual de Cotizaciones',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
  }

  createProductosMasCotizadosChart(): void {
  if (!this.productosMasCotizadosChart?.nativeElement) {
    console.warn('Elemento del gráfico de productos no encontrado');
    return;
  }

  this.cotizacionService.getProductosMasCotizados().subscribe({
    next: (productos) => {
      console.log('Productos más cotizados:', productos);

      if (!Array.isArray(productos) || productos.length === 0) {
        console.warn('No hay datos de productos para mostrar');
        return;
      }

      const ctx = this.productosMasCotizadosChart.nativeElement.getContext('2d');
      if (ctx) {
        // Destruir chart anterior si existe
        if (this.chartProductos) {
          this.chartProductos.destroy();
        }

        // Generar colores únicos para cada producto
        const colors = productos.map((_, index) => ({
          background: Utils.transparentize(Utils.getColorForSpecies(index), 0.8),
          border: Utils.getColorForSpecies(index)
        }));

        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: productos.map(p => p.nombre),
            datasets: [{
              label: 'Cantidad Total Cotizada',
              data: productos.map(p => p.cantidad),
              backgroundColor: colors.map(c => c.background),
              borderColor: colors.map(c => c.border),
              borderWidth: 2
            }]
          },
          options: {
            indexAxis: 'y', // 👉 Esto convierte las barras en horizontales
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Top 10 - Productos Más Cotizados',
                font: {
                  size: 18,
                  weight: 'bold'
                },
                color: Utils.CHART_COLORS.azul_noche,
                padding: {
                  top: 10,
                  bottom: 20
                }
              },
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const producto = productos[context.dataIndex];
                    return [
                      `Cantidad: ${producto.cantidad} unidades`,
                      `Cotizaciones: ${producto.cotizaciones}`,
                    ];
                  }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  color: Utils.CHART_COLORS.gris
                },
                grid: {
                  color: Utils.transparentize(Utils.CHART_COLORS.gris, 0.3)
                }
              },
              y: {
                ticks: {
                  color: Utils.CHART_COLORS.gris
                },
                grid: {
                  display: false
                }
              }
            }
          }
        };

        this.chartProductos = new Chart(ctx, config);
      }
    },
    error: (err) => {
      console.error('Error al cargar datos para gráfica de productos:', err);
    }
  });
}

  ngOnDestroy(): void {
    if (this.chartWeb) {
      this.chartWeb.destroy();
    }
    if (this.chartManuales) {
      this.chartManuales.destroy();
    }
    if (this.chartProductos) {
      this.chartProductos.destroy();
    }
  }
}
