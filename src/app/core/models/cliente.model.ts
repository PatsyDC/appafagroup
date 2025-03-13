export interface ICliente {
  cliente_id: number;  // UUID
  codigo_ruc: string;  // Asegura que sea un string numérico entre 8 y 11 caracteres
  tipo_persona: string;
  razon_social: string;
  tipo_empleador: string;
  documento_ruc: string;  // Asegura que sea un string numérico entre 8 y 11 caracteres
  nro_dni?: string;  // Permite que sea opcional (puede ser null o un string numérico de 8 caracteres)
  nombre_persona?: string;  // Opcional, puede ser null
  pais: string;
  direccion: string;
  telefono?: string;  // Opcional, solo numérico con 9 caracteres
  correo: string;  // Validación de email
}

