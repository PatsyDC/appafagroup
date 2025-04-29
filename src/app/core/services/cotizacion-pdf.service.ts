import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { FormGroup } from '@angular/forms';
import { IMAGENES_BASE64 } from 'app/shared/imagenes-base64'

@Injectable({
  providedIn: 'root'
})
export class CotizacionPdfService {

  constructor() { }

  generarPDF(cotizacionForm: FormGroup, productos: any[], totalPrecioProductos: number) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const margin = 10; // Margins
    const contentWidth = pageWidth - margin * 2;

    // Agregar logo (aquí deberías tener una imagen base64 del logo AFA GROUP)
    // Para un caso de prueba, usaremos un rectángulo simple
    // const imgUrl = 'public/img/afa_group.png'; // URL del logo AFA GROUP
    // pdf.addImage(imgUrl, 'PNG', 10, 10, 50, 50);
    pdf.addImage(IMAGENES_BASE64.LOGO_AFA_GROUP, 'PNG', margin, 10, 30, 20);

    // Encabezado (ajustado para estar más a la derecha)
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AFA GROUP DE MAQUINARIAS Y REPUESTOS E.I.R', margin + 35, 15); // Cambiado de margin + 20 a margin + 50
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Calle Dinamarca N° 109 Urb. Monserrate', margin + 35, 20); // Cambiado de margin + 20 a margin + 50
    pdf.text('- Trujillo - La Libertad -', margin + 35, 24); // Cambiado de margin + 20 a margin + 50
    pdf.text('Perú : 949700724', margin + 35, 28); // Cambiado de margin + 20 a margin + 50

    // Recuadro para Cotización
    pdf.setDrawColor(0);
    pdf.setFillColor(220, 220, 220); // Color gris claro
    pdf.rect(155, 10, 45, 15, 'FD');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COTIZACIÓN', 167, 15);
    pdf.setFontSize(8);
    const numero = cotizacionForm.get('numero')?.value || '';
    pdf.text(`N°: ${numero}`, 167, 20);

    // Iconos servicios (simularemos con rectángulos)
    const iconWidth = 30; // Ancho de cada imagen
    const iconHeight = 13; // Alto de cada imagen
    const startX = margin + 35; // Posición inicial en X
    const iconY = 40; // Posición en Y

    // Array con las imágenes en formato Base64
    const imagenes = [
      IMAGENES_BASE64.LOGO_AFA_TRAC,
      IMAGENES_BASE64.LOGO_AFA_PARTS,
      IMAGENES_BASE64.LOGO_AFA_SPRAYERS
    ];

    // Agregar las imágenes una al lado de otra
    for (let i = 0; i < imagenes.length; i++) {
      pdf.addImage(imagenes[i], 'PNG', startX + (i * (iconWidth + 13)), iconY, iconWidth, iconHeight);
    }

    // Recuadro principal de la cotización
    pdf.setDrawColor(0);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, 55, contentWidth, 80, 'D');

    // Información del cliente (dentro del recuadro)
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0);
    pdf.text('CLIENTE:', margin + 5, 65);
    pdf.setFont('helvetica', 'normal');
    pdf.text(cotizacionForm.get('razon_social')?.value || '', margin + 40, 65);

    pdf.setFont('helvetica', 'bold');
    pdf.text('RUC:', margin + 5, 75);
    pdf.setFont('helvetica', 'normal');
    pdf.text(cotizacionForm.get('ruc')?.value || '', margin + 40, 75);

    pdf.setFont('helvetica', 'bold');
    pdf.text('CONTACTO:', margin + 5, 85);
    pdf.setFont('helvetica', 'normal');
    const contactoInfo = `${cotizacionForm.get('nombre_contacto')?.value || ''} / ${cotizacionForm.get('email')?.value || ''} / ${cotizacionForm.get('telefono')?.value || ''}`;
    pdf.text(contactoInfo, margin + 40, 85);

    pdf.setFont('helvetica', 'bold');
    pdf.text('LUGAR ENTREGA:', margin + 5, 95);
    pdf.setFont('helvetica', 'normal');
    pdf.text(cotizacionForm.get('punto_venta')?.value || '', margin + 40, 95);

    pdf.setFont('helvetica', 'bold');
    pdf.text('FECHA:', margin + 110, 95);
    pdf.setFont('helvetica', 'normal');
    const fechaFormateada = this.formatearFecha(cotizacionForm.get('fecha')?.value);
    pdf.text(fechaFormateada, margin + 140, 95);

    pdf.setFont('helvetica', 'bold');
    pdf.text('VENDEDOR:', margin + 5, 105);
    pdf.setFont('helvetica', 'normal');
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');
    const nombreVendedor = usuario?.user_name || '';
    pdf.text(nombreVendedor, margin + 40, 105);


    // Tabla de productos
    pdf.setFillColor(220, 220, 220);
    pdf.rect(margin, 140, contentWidth, 8, 'FD');

    // Encabezados de la tabla
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('CANTIDAD', margin + 2, 145);
    pdf.text('UM', margin + 22, 145);
    pdf.text('CÓDIGO', margin + 38, 145);
    pdf.text('PRODUCTO', margin + 60, 145);
    pdf.text('DISPONIBILIDAD', margin + 120, 145);
    pdf.text('V.UNIT DSCTO', margin + 150, 145);
    pdf.text('IMPORTE', margin + 176, 145);

    // Crear celdas vacías de la tabla
    pdf.rect(margin, 148, contentWidth, 80, 'D'); // Rectángulo grande para la tabla

    // Líneas verticales para dividir la tabla
    pdf.line(margin + 20, 140, margin + 20, 228); // Después de CANTIDAD
    pdf.line(margin + 35, 140, margin + 35, 228); // Después de UM
    pdf.line(margin + 55, 140, margin + 55, 228); // Después de CÓDIGO
    pdf.line(margin + 115, 140, margin + 115, 228); // Después de PRODUCTO
    pdf.line(margin + 145, 140, margin + 145, 228); // Después de DISPONIBILIDAD
    pdf.line(margin + 175, 140, margin + 175, 228); // Después de V.UNIT DSCTO

    // Añadir los productos a la tabla
    let startY = 155;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    for (let i = 0; i < productos.length && i < 10; i++) { // Limitamos a 10 productos por página
      const producto = productos[i];
      pdf.text(producto.cantidad.toString(), margin + 5, startY);
      pdf.text(producto.unidad_medida || 'UND', margin + 25, startY);
      pdf.text(producto.codigo || 'N/A', margin + 40, startY);
      pdf.text(this.limitarTexto(producto.nombre, 40), margin + 60, startY); // Ajustado para la nueva columna
      pdf.text(producto.disponibilidad || 'Inmediata', margin + 125, startY);
      pdf.text(producto.precio_descuento.toFixed(2), margin + 155, startY);
      pdf.text(producto.sub_total.toFixed(2), margin + 178, startY);
      startY += 8;
    }

    // Tabla de condiciones y totales
    const yCondiciones = 235;
    pdf.rect(margin, yCondiciones, contentWidth * 0.6, 40, 'D');
    pdf.rect(margin + contentWidth * 0.6, yCondiciones, contentWidth * 0.4, 40, 'D');

    // Título de condiciones
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, yCondiciones, contentWidth * 0.6, 8, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Condiciones :', margin + 5, yCondiciones + 6);

    // Detalle de condiciones
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Los precios NO incluyen IGV', margin + 50, yCondiciones + 6);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Forma de Pago:', margin + 5, yCondiciones + 15);
    pdf.setFont('helvetica', 'normal');
    pdf.text(cotizacionForm.get('forma_pago')?.value || '', margin + 50, yCondiciones + 15);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Tiempo de entrega:', margin + 5, yCondiciones + 23);
    pdf.setFont('helvetica', 'normal');
    pdf.text(cotizacionForm.get('dias_ofertas')?.value + ' días hábiles' || '0 días hábiles', margin + 50, yCondiciones + 23);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Validez de la oferta:', margin + 5, yCondiciones + 31);
    pdf.setFont('helvetica', 'normal');
    pdf.text(cotizacionForm.get('dias_ofertas')?.value + ' días' || '0 días', margin + 50, yCondiciones + 31);

    // Totales en la tabla derecha
    // Encabezados
    pdf.setFillColor(220, 220, 220);
    pdf.rect(margin + contentWidth * 0.6, yCondiciones, contentWidth * 0.4, 8, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESCUENTO', margin + contentWidth * 0.6 + 5, yCondiciones + 6);
    pdf.text(cotizacionForm.get('moneda')?.value || 'USD', margin + contentWidth - 15, yCondiciones + 6);

    // Líneas para dividir las secciones de totales
    pdf.line(margin + contentWidth * 0.6, yCondiciones + 16, margin + contentWidth, yCondiciones + 16);
    pdf.line(margin + contentWidth * 0.6, yCondiciones + 24, margin + contentWidth, yCondiciones + 24);
    pdf.line(margin + contentWidth * 0.6, yCondiciones + 32, margin + contentWidth, yCondiciones + 32);

    // Valores
    pdf.setFont('helvetica', 'normal');
    pdf.text('SUBTOTAL', margin + contentWidth * 0.6 + 5, yCondiciones + 14);
    pdf.text(cotizacionForm.get('moneda')?.value || 'USD', margin + contentWidth - 15, yCondiciones + 14);

    pdf.text('IGV (18%)', margin + contentWidth * 0.6 + 5, yCondiciones + 22);
    pdf.text(cotizacionForm.get('moneda')?.value || 'USD', margin + contentWidth - 15, yCondiciones + 22);

    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL', margin + contentWidth * 0.6 + 5, yCondiciones + 30);
    pdf.text(cotizacionForm.get('moneda')?.value || 'USD', margin + contentWidth - 30, yCondiciones + 30);
    pdf.text(totalPrecioProductos.toFixed(2), margin + contentWidth - 15, yCondiciones + 30);

    // Guardar PDF
    pdf.save('cotizacion.pdf');
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  private limitarTexto(texto: string, longitud: number): string {
    if (!texto) return '';
    return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
  }

  private calcularDescuento(productos: any[]): number {
    return productos.reduce((total, producto) => {
      return total + (producto.precio - producto.precio_descuento) * producto.cantidad;
    }, 0);
  }

  private calcularSubtotal(productos: any[]): number {
    return productos.reduce((total, producto) => {
      return total + producto.precio_descuento * producto.cantidad;
    }, 0);
  }

  private calcularIGV(subtotal: number): number {
    return subtotal * 0.18;
  }
}
