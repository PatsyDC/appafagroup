export interface ICliente {
  cliente_id: number;
  codigo_ruc: string;
  tipo_persona: string;
  razon_social: string;
  tipo_empleador: string;
  documento_ruc: string;
  nro_dni?: string;
  nombre_persona?: string;
  pais: string;
  direccion: string;
  telefono?: string;
  correo: string;
}

