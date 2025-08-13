import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Store, 
  CreditCard, 
  BarChart3, 
  FileText, 
  Calculator, 
  Building2, 
  Settings, 
  Users, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  Warehouse,
  TrendingUp,
  Megaphone,
  Hash
} from 'lucide-react';
import { UserRole, rolePermissions } from '../types/roles';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  customPages: any[];
}

export function Sidebar({ 
  currentView, 
  setCurrentView, 
  userRole, 
  isCollapsed, 
  setIsCollapsed,
  customPages 
}: SidebarProps) {
  const permissions = rolePermissions[userRole];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: permissions.dashboard },
    { id: 'inventory', label: 'Inventario', icon: Warehouse, permission: permissions.inventory },
    { id: 'products', label: 'Productos', icon: Package, permission: permissions.products },
    { id: 'sales', label: 'Ventas Online', icon: Store, permission: permissions.sales },
    { id: 'orders', label: 'Seguimiento Pedidos', icon: TrendingUp, permission: permissions.sales },
    { id: 'pos', label: 'POS Local', icon: CreditCard, permission: permissions.pos },
    { id: 'quotes', label: 'Cotizaciones', icon: FileEdit, permission: permissions.quotes },
    { id: 'reports', label: 'Reportes', icon: BarChart3, permission: permissions.reports },
    { id: 'documents', label: 'Documentos', icon: FileText, permission: permissions.documents },
    { id: 'taxes', label: 'Impuestos', icon: Calculator, permission: permissions.taxes },
    { id: 'dian', label: 'DIAN', icon: Building2, permission: permissions.dian },
    { id: 'campaigns', label: 'Campañas', icon: Megaphone, permission: permissions.settings },
    { id: 'integrations', label: 'Integraciones', icon: MessageSquare, permission: permissions.integrations },
    { id: 'clients', label: 'Clientes', icon: Users, permission: permissions.clients },
    { id: 'pages', label: 'Páginas', icon: FileEdit, permission: permissions.settings },
    { id: 'sales-team', label: 'Fuerza de Ventas', icon: TrendingUp, permission: permissions.userManagement },
    { id: 'numbering', label: 'Numeración', icon: Hash, permission: permissions.settings },
    { id: 'users', label: 'Usuarios', icon: Users, permission: permissions.userManagement },
    { id: 'settings', label: 'Configuración', icon: Settings, permission: permissions.settings },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen sticky top-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-gray-900">ERP Sistema</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          if (!item.permission) return null;
          
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
              {!isCollapsed && (
                <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              )}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r"></div>
              )}
            </button>
          );
        })}

        {/* Custom Pages */}
        {customPages.length > 0 && !isCollapsed && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Páginas Personalizadas
            </p>
            {customPages
              .filter(page => page.showInMenu)
              .sort((a, b) => a.menuPosition - b.menuPosition)
              .map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentView(`page-${page.id}`)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentView === `page-${page.id}`
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{page.title}</span>
                </button>
              ))}
          </div>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">
                {userRole === 'admin' ? 'A' : userRole === 'vendedor' ? 'V' : userRole === 'cajero' ? 'C' : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 capitalize">
                {userRole}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}