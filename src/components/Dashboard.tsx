import React from 'react';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { User, Product, Sale, Tenant } from '../App';

interface DashboardProps {
  user: User;
  products: Product[];
  sales: Sale[];
  tenant: Tenant;
}

export function Dashboard({ user, products, sales, tenant }: DashboardProps) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = sales.length;
  const activeProducts = products.filter(p => p.active).length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  const recentSales = sales.slice(-5).reverse();

  const stats = [
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      title: 'Órdenes',
      value: totalOrders.toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart
    },
    {
      title: 'Productos Activos',
      value: activeProducts.toString(),
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: Package
    },
    {
      title: 'Stock Bajo',
      value: lowStockProducts.toString(),
      change: '-2.3%',
      changeType: lowStockProducts > 0 ? 'negative' as const : 'positive' as const,
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido de nuevo, {user.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Plan Actual</p>
          <p className="text-lg font-semibold text-blue-600 capitalize">
            {tenant.plan}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs último mes</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Recientes</h3>
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      #{sale.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {sale.type === 'online' ? 'Tienda Online' : 'POS Local'} • {sale.customer || 'Cliente Anónimo'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${sale.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {sale.products.reduce((sum, p) => sum + p.quantity, 0)} items
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay ventas recientes</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Stock</h3>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      {product.stock} unidades
                    </p>
                    <p className="text-sm text-gray-500">Stock bajo</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">Todos los productos tienen stock suficiente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Agregar Producto</p>
          </button>
          <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors">
            <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Nueva Venta</p>
          </button>
          <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Ver Reportes</p>
          </button>
          <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-colors">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Gestionar Clientes</p>
          </button>
        </div>
      </div>
    </div>
  );
}