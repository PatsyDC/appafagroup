import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { CotizacionManual } from '../models/cotizacionManual.model';
import { CotizacionProducto } from '../models/prodCM.model';

interface CotizacionesPorMes {
  [mes: string]: number;
}

interface DatosMes {
  mes: string;
  cantidad: number;
}

function formatMonth(fecha: Date | string): string {
  const date = new Date(fecha);
  const mes = date.toLocaleDateString('es-ES', { month: 'long' });
  const anio = date.getFullYear();
  return `${mes} ${anio}`.toUpperCase(); // Ej: "JUNIO 2025"
}

@Injectable({
  providedIn: 'root'
})

export class CotizacionManualService {

  private _refresh$ = new Subject<void>();
    get refresh$() {
      return this._refresh$;
    }

  //private url: string = 'http://localhost:3000/api/v1/'
  private url: string = 'https://afagroup-api-1cml.onrender.com/api/v1/'

  constructor(private http: HttpClient) { }

  getCotizaciones(): Observable<CotizacionManual[]> {
    return this.http.get<CotizacionManual[]>(`${this.url}cotizaciones/`);
  }

  getCotizacionesGrafica(): Observable<CotizacionManual[]> {
  return this.http.get<{ ok: boolean, status: number, body: CotizacionManual[] }>(`${this.url}cotizaciones/`)
    .pipe(
      map(res => res.body || [])
    );
}

  getCotizacionById(id: string): Observable<{ body: CotizacionManual }> {
    return this.http.get<{ body: CotizacionManual }>(`${this.url}cotizaciones/${id}`);
  }

  createCotizacion(cotizacion: CotizacionManual): Observable<CotizacionManual> {
    return this.http.post<CotizacionManual>(`${this.url}cotizaciones/`, cotizacion);
  }

  updateCotizacion(id: string, cotizacion: CotizacionManual): Observable<any> {
    return this.http.put(`${this.url}cotizaciones/${id}`, cotizacion);
  }

  deleteCotizacion(id: string): Observable<any> {
    return this.http.delete(`${this.url}cotizaciones/${id}`);
  }

  // === PRODUCTOS DE COTIZACIÓN ===

getProductosByCotizacion(cotizacion_id: string): Observable<{ok: boolean, status: number, body: CotizacionProducto[]}> {
  console.log('🔍 Solicitando productos para cotización ID:', cotizacion_id);
  return this.http.get<{ok: boolean, status: number, body: CotizacionProducto[]}>(`${this.url}cotizacion-productos/cotizacion/${cotizacion_id}`);
}

getProductosByCotizacionDebug(cotizacion_id: string): Observable<any> {
  console.log('🔍 Solicitando productos para cotización ID:', cotizacion_id);
  return this.http.get<any>(`${this.url}cotizacion-productos/cotizacion/${cotizacion_id}`).pipe(
    tap(response => {
      console.log('📡 Respuesta cruda del backend para productos:', response);
    })
  );
}

  createProductoCotizado(producto: CotizacionProducto): Observable<CotizacionProducto> {
    return this.http.post<CotizacionProducto>(`${this.url}cotizacion-productos/`, producto);
  }

  updateProductoCotizado(id: string, producto: CotizacionProducto): Observable<any> {
    return this.http.put(`${this.url}cotizacion-productos/${id}`, producto);
  }

  deleteProductoCotizado(id: string): Observable<any> {
    return this.http.delete(`${this.url}cotizacion-productos/${id}`);
  }

  crearCotizacionConProductos(
    cotizacion: CotizacionManual,
    productos: CotizacionProducto[]
  ): Observable<any> {
    return this.createCotizacion(cotizacion).pipe(
      switchMap((nuevaCotizacion: any) => {
        console.log('🔍 Respuesta completa del backend:', nuevaCotizacion);

        let cotizacion_id = null;

        // La respuesta tiene la estructura: {ok: true, status: 200, body: [objeto]}
        if (nuevaCotizacion?.body && typeof nuevaCotizacion.body === 'object') {
          cotizacion_id = nuevaCotizacion.body.id || nuevaCotizacion.body.cotizacion_id;
        }
        // Fallback: otras posibles estructuras
        else if (nuevaCotizacion?.id) {
          cotizacion_id = nuevaCotizacion.id;
        }
        else if (nuevaCotizacion?.cotizacion_id) {
          cotizacion_id = nuevaCotizacion.cotizacion_id;
        }
        else if (Array.isArray(nuevaCotizacion) && nuevaCotizacion.length > 0) {
          cotizacion_id = nuevaCotizacion[0]?.id || nuevaCotizacion[0]?.cotizacion_id;
        }

        console.log('🆔 ID extraído:', cotizacion_id);
        console.log('🆔 Tipo del ID:', typeof cotizacion_id);

        if (!cotizacion_id) {
          console.error('❌ Estructura de respuesta no reconocida:', nuevaCotizacion);
          throw new Error('❌ El ID de la cotización no fue devuelto correctamente por el backend.');
        }

        // Asegurar que el ID sea string
        const cotizacion_id_string = String(cotizacion_id);

        const productosConId = productos.map(prod => ({
          ...prod,
          cotizacion_id: cotizacion_id_string
        }));

        console.log('📦 Productos con ID asignado:', productosConId);

        const peticiones = productosConId.map(prod =>
          this.createProductoCotizado(prod)
        );

        return forkJoin(peticiones);
      })
    );
  }

  getCotizacionesManualesPorMes(): Observable<DatosMes[]> {
    return this.getCotizacionesGrafica().pipe(
      map(cotizaciones => {
        console.log('📊 Datos recibidos para agrupar por mes:', cotizaciones);

        // Verificar que cotizaciones sea un array
        if (!Array.isArray(cotizaciones)) {
          console.error('getCotizaciones() no devolvió un array:', cotizaciones);
          return [];
        }

        // Usar la interfaz tipada para el acumulador
        const cotizacionesPorMes: CotizacionesPorMes = cotizaciones.reduce((acc: CotizacionesPorMes, cotizacion) => {
          // Asegurar que la cotización tenga fecha
          if (!cotizacion.fecha) {
            return acc;
          }

          // Manejar diferentes formatos de fecha
          let fecha: Date;
          if (typeof cotizacion.fecha === 'string') {
            fecha = new Date(cotizacion.fecha);
          } else {
            fecha = cotizacion.fecha;
          }

          // Verificar que la fecha sea válida
          if (isNaN(fecha.getTime())) {
            console.warn('Fecha inválida encontrada:', cotizacion.fecha);
            return acc;
          }

          const mes = formatMonth(fecha);

          if (!acc[mes]) {
            acc[mes] = 0;
          }
          acc[mes]++;

          return acc;
        }, {} as CotizacionesPorMes);

        console.log('📊 Cotizaciones agrupadas por mes:', cotizacionesPorMes);

        // Convertir a array de objetos y ordenar por fecha
        const resultado: DatosMes[] = Object.entries(cotizacionesPorMes)
          .map(([mes, cantidad]) => ({
            mes: mes,
            cantidad: cantidad
          }))
          .sort((a, b) => {
            // Ordenar por fecha (más reciente primero)
            const fechaA = new Date(a.mes);
            const fechaB = new Date(b.mes);
            return fechaB.getTime() - fechaA.getTime();
          });

        console.log('📊 Resultado final:', resultado);
        return resultado;
      }),
      catchError(error => {
        console.error('Error en getCotizacionesManualesPorMes:', error);
        return of([]); // Devolver array vacío en caso de error
      })
    );
  }

  getTodosLosProductosManuales(): Observable<any[]> {
  return this.http.get<{ ok: boolean, status: number, body: any[] }>(
    `${this.url}cotizacion-productos/`
  ).pipe(
    map(res => res.body || [])
  );
}

}
