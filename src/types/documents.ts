export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'factura' | 'cotizacion' | 'nota_credito' | 'recibo' | 'ticket_pos';
  tenantId: string;
  htmlTemplate: string;
  cssStyles: string;
  fields: DocumentField[];
  dianCompliant: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'image' | 'qr' | 'table';
  required: boolean;
  defaultValue?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  type: string;
  documentNumber: string;
  data: any;
  htmlContent: string;
  pdfUrl?: string;
  emailSent: boolean;
  tenantId: string;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  tenantId: string;
  type: 'cotizacion' | 'factura' | 'recibo';
  active: boolean;
}

export interface WhatsAppIntegration {
  id: string;
  tenantId: string;
  phoneNumber: string;
  apiKey: string;
  webhookUrl: string;
  aiEnabled: boolean;
  aiPrompt: string;
  active: boolean;
}

export interface SocialMediaIntegration {
  id: string;
  tenantId: string;
  platform: 'facebook' | 'instagram' | 'twitter';
  accessToken: string;
  pageId?: string;
  aiEnabled: boolean;
  active: boolean;
}