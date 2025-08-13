export interface POSCustomer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'CC' | 'NIT' | 'CE' | 'PP';
  address?: string;
  city?: string;
  requiresInvoice: boolean;
}

export interface POSPayment {
  method: 'cash' | 'card' | 'transfer' | 'mixed';
  amount: number;
  reference?: string;
  cashReceived?: number;
  change?: number;
}

export interface POSSale {
  id: string;
  number: string;
  customer?: POSCustomer;
  items: POSItem[];
  subtotal: number;
  taxes: POSTax[];
  total: number;
  payment: POSPayment;
  date: string;
  cashier: string;
  tenantId: string;
  electronicInvoice?: {
    cufe: string;
    qrCode: string;
    xmlUrl: string;
    pdfUrl: string;
    status: 'pending' | 'sent' | 'accepted' | 'rejected';
  };
}

export interface POSItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  taxes: POSTax[];
  total: number;
}

export interface POSTax {
  type: string;
  rate: number;
  base: number;
  amount: number;
}

export interface POSTicket {
  sale: POSSale;
  template: 'thermal' | 'letter';
  includeQR: boolean;
  includeLogo: boolean;
}