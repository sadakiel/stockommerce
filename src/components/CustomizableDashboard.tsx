import React, { useState } from 'react';
import { Plus, Settings, X, BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { DashboardWidget } from '../types/pages';

interface CustomizableDashboardProps {
  widgets: DashboardWidget[];
  onUpdateWidgets: (widgets: DashboardWidget[]) => void;
  salesData: any;
  productsData: any;
  revenueData: any;
}

export function CustomizableDashboard({ 
  widgets, 
  onUpdateWidgets, 
  salesData, 
  productsData, 
  revenueData 
}: CustomizableDashboardProps) {
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);

  const availableWidgets = [
    { type: 'revenue_card', title: 'Ingresos Totales', icon: DollarSign, description: 'Muestra los ingresos del período' },
    { type: 'sales_chart', title: 'Gráfico de Ventas', icon: BarChart3, description: 'Gráfico de ventas por período' },
    { type: 'inventory_alert', title: 'Alertas de Inventario', icon: Package, description: 'Productos con stock bajo' },
    { type: 'recent_orders', title: 'Órdenes Recientes', icon: ShoppingCart, description: 'Últimas ventas realizadas' },
    { type: 'top_products', title: 'Productos Top', icon: TrendingUp, description: 'Productos más vendidos' },
    { type: 'quick_actions', title: 'Acciones Rápidas', icon: Users, description: 'Botones de acceso rápido' }
  ];

  const addWidget = (type: string) => {
    const widgetConfig = availableWidgets.find(w => w.type === type);
    if (!widgetConfig) return;

    const newWidget: DashboardWidget = {
      id: Date.now().toString(),
      type: type as any,
      title: widgetConfig.title,
      position: { x: 0, y: 0 },
      size: { width: type === 'sales_chart' ? 2 : 1, height: 1 },
      config: {},
      visible: true
    };

    onUpdateWidgets([...widgets, newWidget]);
    setShowAddWidget(false);
  };

  const removeWidget = (widgetId: string) => {
    onUpdateWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    onUpdateWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  };

  const renderWidget = (widget: DashboardWidget) => {
    const baseClasses = `bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${
      widget.size.width === 2 ? 'col-span-2' : 'col-span-1'
    } ${widget.size.height === 2 ? 'row-span-2' : 'row-span-1'}`;

    switch (widget.type) {
      case 'revenue_card':
        return (
          <div key={widget.id} className={baseClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">${revenueData?.total || '0.00'}</p>
                <p className="text-sm text-green-600">+12.5% vs mes anterior</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              {editMode && (
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );

      case 'sales_chart':
        return (
          <div key={widget.id} className={baseClasses}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ventas por Canal</h3>
              {editMode && (
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Tienda Online</p>
                  <p className="text-sm text-purple-600">{salesData?.online || 0} ventas</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-900">${salesData?.onlineRevenue || '0.00'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">POS Local</p>
                  <p className="text-sm text-orange-600">{salesData?.pos || 0} ventas</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-900">${salesData?.posRevenue || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'inventory_alert':
        return (
          <div key={widget.id} className={baseClasses}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock</h3>
              {editMode && (
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {productsData?.lowStock?.slice(0, 3).map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{product.stock} unidades</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Stock suficiente</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'quick_actions':
        return (
          <div key={widget.id} className={baseClasses}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
              {editMode && (
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <Package className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-600">Nuevo Producto</p>
              </button>
              <button className="p-3 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-600">Nueva Venta</p>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Personaliza tu vista del negocio</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddWidget(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Widget</span>
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              editMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>{editMode ? 'Salir' : 'Editar'}</span>
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.filter(w => w.visible).map(renderWidget)}
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Agregar Widget</h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableWidgets.map((widget) => {
                const Icon = widget.icon;
                const isAdded = widgets.some(w => w.type === widget.type);
                
                return (
                  <button
                    key={widget.type}
                    onClick={() => !isAdded && addWidget(widget.type)}
                    disabled={isAdded}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      isAdded
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`w-6 h-6 ${isAdded ? 'text-gray-400' : 'text-blue-600'}`} />
                      <h4 className={`font-medium ${isAdded ? 'text-gray-500' : 'text-gray-900'}`}>
                        {widget.title}
                      </h4>
                    </div>
                    <p className={`text-sm ${isAdded ? 'text-gray-400' : 'text-gray-600'}`}>
                      {widget.description}
                    </p>
                    {isAdded && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                        Ya agregado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}