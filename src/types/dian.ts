export interface DianConfiguration {
  tenantId: string;
  nit: string;
  razonSocial: string;
  nombreComercial: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  telefono: string;
  email: string;
  
  // Certificados digitales
  certificadoDigital: string;
  passwordCertificado: string;
  
  // Configuración técnica
  ambientePruebas: boolean;
  urlWebService: string;
  prefijoFacturacion: string;
  numeroResolucion: string;
  fechaResolucionDesde: string;
  fechaResolucionHasta: string;
  rangoNumeracionDesde: number;
  rangoNumeracionHasta: number;
  
  // Configuración de impuestos
  regimenTributario: 'SIMPLIFICADO' | 'COMUN' | 'GRAN_CONTRIBUYENTE';
  responsabilidadesFiscales: string[];
  
  active: boolean;
}

export interface DianInvoice {
  id: string;
  tenantId: string;
  numeroFactura: string;
  prefijo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  
  // Cliente
  clienteNit: string;
  clienteNombre: string;
  clienteDireccion: string;
  clienteCiudad: string;
  clienteEmail: string;
  clienteTelefono: string;
  
  // Productos/Servicios
  items: DianInvoiceItem[];
  
  // Totales
  subtotal: number;
  totalImpuestos: number;
  totalDescuentos: number;
  total: number;
  
  // DIAN
  cufe: string;
  qrCode: string;
  xmlSigned: string;
  pdfUrl: string;
  estadoDian: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO';
  mensajeDian?: string;
  
  created_at: string;
}

export interface DianInvoiceItem {
  codigo: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: string;
  valorUnitario: number;
  valorTotal: number;
  impuestos: DianTax[];
  descuentos?: number;
}

export interface DianTax {
  tipo: string;
  codigo: string;
  base: number;
  tarifa: number;
  valor: number;
}