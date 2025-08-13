export interface OrderStatus {
  id: string;
  status: 'pedido_realizado' | 'en_alistamiento' | 'confirmado_pago' | 'enviado' | 'con_transportador' | 'entregado';
  timestamp: string;
  notes?: string;
}

export interface OnlineOrder {
  id: string;
  ticketCode: string;
  customer: CustomerInfo;
  products: { product: any; quantity: number }[];
  total: number;
  currentStatus: OrderStatus['status'];
  statusHistory: OrderStatus[];
  paymentMethod: 'card' | 'transfer' | 'cash_on_delivery';
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  tenantId: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerInfo {
  id?: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'CC' | 'NIT' | 'CE' | 'PP';
  address: string;
  city: string;
}

export interface Commission {
  id: string;
  userId: string;
  userName: string;
  saleId: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  date: string;
  tenantId: string;
}