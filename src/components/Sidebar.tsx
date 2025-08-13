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
  Hash,
  ChevronDown,
  ChevronUp,
  User
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

interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
  permission: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  permission: boolean;
}

export function Sidebar({ 
  currentView, 
  setCurrentView, 
  userRole, 
  isCollapsed, 
  setIsCollapsed,
  customPages 
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main', 'sales', 'management']);
  const permissions = rolePermissions[userRole];

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) return;
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const menuGroups: MenuGroup[] = [
    {
      id: 'main',
      label: 'Principal',
      icon: LayoutDashboard,
      permission: true,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: permissions.dashboard },
        { id: 'profile', label: 'Mi Perfil', icon: User, permission: true }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: Package,
      permission: permissions.inventory || permissions.products,
      items: [
        { id: 'inventory', label: 'Inventario Avanzado', icon: Warehouse, permission: permissions.inventory },
        { id: 'products', label: 'Productos', icon: Package, permission: permissions.products }
      ]
    },
    {
      id: 'sales',
      label: 'Ventas',
      icon: ShoppingCart,
      permission: permissions.sales || permissions.pos || permissions.quotes,
      items: [
        { id: 'sales', label: 'Tienda Online', icon: Store, permission: permissions.sales },
        { id: 'orders', label: 'Seguimiento', icon: TrendingUp, permission: permissions.sales },
        { id: 'pos', label: 'POS Local', icon: CreditCard, permission: permissions.pos },
        { id: 'quotes', label: 'Cotizaciones', icon: FileEdit, permission: permissions.quotes }
      ]
    },
    {
      id: 'reports',
      label: 'Reportes y Docs',
      icon: BarChart3,
      permission: permissions.reports || permissions.documents,
      items: [
        { id: 'reports', label: 'Reportes', icon: BarChart3, permission: permissions.reports },
        { id: 'documents', label: 'Documentos', icon: FileText, permission: permissions.documents }
      ]
    },
    {
      id: 'management',
      label: 'Administración',
      icon: Settings,
      permission: permissions.settings || permissions.clients || permissions.userManagement,
      items: [
        { id: 'clients', label: 'Clientes', icon: Users, permission: permissions.clients },
        { id: 'users', label: 'Usuarios', icon: Users, permission: permissions.userManagement },
        { id: 'sales-team', label: 'Fuerza de Ventas', icon: TrendingUp, permission: permissions.userManagement }
      ]
    },
    {
      id: 'config',
      label: 'Configuración',
      icon: Settings,
      permission: permissions.settings || permissions.taxes || permissions.dian,
      items: [
        { id: 'settings', label: 'General', icon: Settings, permission: permissions.settings },
        { id: 'taxes', label: 'Impuestos', icon: Calculator, permission: permissions.taxes },
        { id: 'dian', label: 'DIAN', icon: Building2, permission: permissions.dian },
        { id: 'campaigns', label: 'Campañas', icon: Megaphone, permission: permissions.settings },
        { id: 'integrations', label: 'Integraciones', icon: MessageSquare, permission: permissions.integrations },
        { id: 'pages', label: 'Páginas', icon: FileEdit, permission: permissions.settings },
        { id: 'numbering', label: 'Numeración', icon: Hash, permission: permissions.settings }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem, isGroupItem = false) => {
    if (!item.permission) return null;
    
    const Icon = item.icon;
    const isActive = currentView === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => setCurrentView(item.id)}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors relative ${
          isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        } ${isGroupItem && !isCollapsed ? 'ml-6' : ''}`}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
        {!isCollapsed && (
          <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
        )}
      </button>
    );
  };

  const renderMenuGroup = (group: MenuGroup) => {
    if (!group.permission) return null;
    
    const Icon = group.icon;
    const isExpanded = expandedGroups.includes(group.id);
    const hasActiveItem = group.items.some(item => item.id === currentView);
    
    if (isCollapsed) {
      // In collapsed mode, show items directly without grouping
      return group.items.map(item => renderMenuItem(item, false));
    }
    
    return (
      <div key={group.id} className="space-y-1">
        <button
          onClick={() => toggleGroup(group.id)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
            hasActiveItem
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 flex-shrink-0 ${hasActiveItem ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className="font-medium">{group.label}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="space-y-1">
            {group.items.map(item => renderMenuItem(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen sticky top-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-white rounded"></div>
                <div className="w-4 h-0.5 bg-white rounded"></div>
                <div className="w-4 h-0.5 bg-white rounded"></div>
              </div>
            </div>
            <span className="font-bold text-gray-900">Stockommerce</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          {isCollapsed ? (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
                <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
                <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
              </div>
            </div>
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuGroups.map(group => renderMenuGroup(group))}

        {/* Custom Pages */}
        {customPages.length > 0 && !isCollapsed && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
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
                      ? 'bg-blue-600 text-white'
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