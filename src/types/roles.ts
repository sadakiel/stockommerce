export type UserRole = 'admin' | 'vendedor' | 'cajero' | 'cliente';

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'inventory' | 'sales' | 'reports' | 'settings' | 'documents';
}

export interface CustomUserRole {
  id: string;
  name: string;
  permissions: string[];
  tenantId: string;
  active: boolean;
  created_at: string;
}

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  customRoleId?: string;
  tenantId: string;
  active: boolean;
  created_at: string;
}

export interface RolePermissions {
  dashboard: boolean;
  inventory: boolean;
  products: boolean;
  sales: boolean;
  pos: boolean;
  reports: boolean;
  clients: boolean;
  settings: boolean;
  documents: boolean;
  taxes: boolean;
  dian: boolean;
  integrations: boolean;
  quotes: boolean;
  userManagement: boolean;
  roleManagement: boolean;
}

export const availablePermissions: UserPermission[] = [
  { id: 'dashboard_view', name: 'Ver Dashboard', description: 'Acceso al panel principal', category: 'dashboard' },
  { id: 'dashboard_edit', name: 'Editar Dashboard', description: 'Personalizar widgets del dashboard', category: 'dashboard' },
  
  { id: 'inventory_view', name: 'Ver Inventario', description: 'Consultar productos y stock', category: 'inventory' },
  { id: 'inventory_edit', name: 'Editar Inventario', description: 'Modificar productos y stock', category: 'inventory' },
  { id: 'inventory_transfer', name: 'Transferir Stock', description: 'Mover productos entre almacenes', category: 'inventory' },
  { id: 'inventory_count', name: 'Conteo Físico', description: 'Realizar inventarios físicos', category: 'inventory' },
  
  { id: 'sales_online', name: 'Ventas Online', description: 'Gestionar tienda online', category: 'sales' },
  { id: 'sales_pos', name: 'POS Local', description: 'Usar punto de venta', category: 'sales' },
  { id: 'sales_quotes', name: 'Cotizaciones', description: 'Crear y enviar cotizaciones', category: 'sales' },
  
  { id: 'reports_view', name: 'Ver Reportes', description: 'Consultar reportes de ventas', category: 'reports' },
  { id: 'reports_export', name: 'Exportar Reportes', description: 'Descargar reportes en diferentes formatos', category: 'reports' },
  
  { id: 'documents_view', name: 'Ver Documentos', description: 'Consultar plantillas y documentos', category: 'documents' },
  { id: 'documents_edit', name: 'Editar Documentos', description: 'Modificar plantillas de documentos', category: 'documents' },
  
  { id: 'settings_general', name: 'Configuración General', description: 'Modificar configuración de la tienda', category: 'settings' },
  { id: 'settings_users', name: 'Gestión de Usuarios', description: 'Administrar usuarios y roles', category: 'settings' },
  { id: 'settings_dian', name: 'Configuración DIAN', description: 'Configurar facturación electrónica', category: 'settings' }
];

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    dashboard: true,
    inventory: true,
    products: true,
    sales: true,
    pos: true,
    reports: true,
    clients: true,
    settings: true,
    documents: true,
    taxes: true,
    dian: true,
    integrations: true,
    quotes: true,
    userManagement: true,
    roleManagement: true
  },
  vendedor: {
    dashboard: true,
    inventory: false,
    products: true,
    sales: true,
    pos: false,
    reports: false,
    clients: false,
    settings: false,
    documents: false,
    taxes: false,
    dian: false,
    integrations: false,
    quotes: true,
    userManagement: false,
    roleManagement: false
  },
  cajero: {
    dashboard: true,
    inventory: false,
    products: true,
    sales: false,
    pos: true,
    reports: false,
    clients: false,
    settings: false,
    documents: false,
    taxes: false,
    dian: false,
    integrations: false,
    quotes: false,
    userManagement: false,
    roleManagement: false
  },
  cliente: {
    dashboard: false,
    inventory: false,
    products: false,
    sales: false,
    pos: false,
    reports: false,
    clients: false,
    settings: false,
    documents: false,
    taxes: false,
    dian: false,
    integrations: false,
    quotes: false,
    userManagement: false,
    roleManagement: false
  }
};