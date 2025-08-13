export interface SalesTeam {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
  isOnlineChannel: boolean;
  active: boolean;
  tenantId: string;
  created_at: string;
}

export interface SalesPerformance {
  sellerId: string;
  sellerName: string;
  isOnlineChannel: boolean;
  totalSales: number;
  totalRevenue: number;
  totalCommissions: number;
  averageOrderValue: number;
  conversionRate: number;
  period: string;
}

export interface DocumentNumbering {
  id: string;
  tenantId: string;
  type: 'invoice' | 'quote' | 'purchase' | 'support_ticket';
  prefix: string;
  currentNumber: number;
  minNumber: number;
  maxNumber: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  timestamp: string;
}