import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, FileText, Settings } from 'lucide-react';
import { Sale, Product } from '../App';
import jsPDF from 'jspdf';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReportsProps {
  sales: Sale[];
  products: Product[];
}

export function Reports({ sales, products }: ReportsProps) {
  const [dateRange, setDateRange] = useState('month');
  const [showChartConfig, setShowChartConfig] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    type: 'sales',
    period: 'daily',
    productId: '',
    showTrend: true
  });
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const getFilteredSales = () => {
    const cutoffDate = {
      day: startOfDay,
      week: startOfWeek,
      month: startOfMonth,
      year: startOfYear
    }[dateRange];

    return sales.filter(sale => new Date(sale.date) >= cutoffDate);
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const onlineSales = filteredSales.filter(s => s.type === 'online');
  const posSales = filteredSales.filter(s => s.type === 'pos');
  
  const onlineRevenue = onlineSales.reduce((sum, sale) => sum + sale.total, 0);
  const posRevenue = posSales.reduce((sum, sale) => sum + sale.total, 0);

  // Top selling products
  const productSales = new Map<string, { product: Product; quantity: number; revenue: number }>();
  
  filteredSales.forEach(sale => {
    sale.products.forEach(({ product, quantity }) => {
      if (productSales.has(product.id)) {
        const existing = productSales.get(product.id)!;
        productSales.set(product.id, {
          product,
          quantity: existing.quantity + quantity,
          revenue: existing.revenue + (product.price * quantity)
        });
      } else {
        productSales.set(product.id, {
          product,
          quantity,
          revenue: product.price * quantity
        });
      }
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const exportReport = () => {
    const reportData = {
      period: dateRange,
      totalSales: filteredSales.length,
      totalRevenue: totalRevenue,
      onlineSales: onlineSales.length,
      onlineRevenue: onlineRevenue,
      posSales: posSales.length,
      posRevenue: posRevenue,
      topProducts: topProducts,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ventas-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Reporte de Ventas', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Período: ${dateRange}`, 20, 45);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 55);
    
    // Summary
    pdf.setFontSize(14);
    pdf.text('Resumen:', 20, 75);
    
    pdf.setFontSize(10);
    pdf.text(`Total de ventas: ${filteredSales.length}`, 20, 90);
    pdf.text(`Ingresos totales: $${totalRevenue.toFixed(2)}`, 20, 100);
    pdf.text(`Ventas online: ${onlineSales.length} ($${onlineRevenue.toFixed(2)})`, 20, 110);
    pdf.text(`Ventas POS: ${posSales.length} ($${posRevenue.toFixed(2)})`, 20, 120);
    
    // Top Products
    pdf.setFontSize(14);
    pdf.text('Productos Más Vendidos:', 20, 140);
    
    pdf.setFontSize(10);
    topProducts.slice(0, 10).forEach((item, index) => {
      const y = 155 + (index * 10);
      pdf.text(`${index + 1}. ${item.product.name}: ${item.quantity} unidades - $${item.revenue.toFixed(2)}`, 20, y);
    });
    
    pdf.save(`reporte-ventas-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateChartData = () => {
    const days = 30;
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }));
      
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      if (chartConfig.type === 'sales') {
        const daySales = sales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= dayStart && saleDate < dayEnd;
        });
        data.push(daySales.reduce((sum, sale) => sum + sale.total, 0));
      } else if (chartConfig.type === 'product' && chartConfig.productId) {
        const productSales = sales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= dayStart && saleDate < dayEnd && 
                 sale.products.some(p => p.product.id === chartConfig.productId);
        });
        const quantity = productSales.reduce((sum, sale) => {
          return sum + sale.products
            .filter(p => p.product.id === chartConfig.productId)
            .reduce((pSum, p) => pSum + p.quantity, 0);
        }, 0);
        data.push(quantity);
      }
    }
    
    return {
      labels,
      datasets: [
        {
          label: chartConfig.type === 'sales' ? 'Ventas ($)' : 'Cantidad Vendida',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes de Ventas</h1>
          <p className="text-gray-600 mt-1">Analiza el rendimiento de tu negocio</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="year">Este Año</option>
          </select>
          <button
            onClick={exportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>JSON</span>
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => setShowChartConfig(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Gráficos</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ventas</p>
              <p className="text-2xl font-bold text-gray-900">{filteredSales.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Online</p>
              <p className="text-2xl font-bold text-gray-900">{onlineSales.length}</p>
              <p className="text-sm text-gray-500">${onlineRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas POS</p>
              <p className="text-2xl font-bold text-gray-900">{posSales.length}</p>
              <p className="text-sm text-gray-500">${posRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Custom Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gráfico Personalizable - {chartConfig.type === 'sales' ? 'Ventas' : 'Producto'}
          </h3>
          <div className="h-64">
            <Line 
              data={generateChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: `Tendencia de ${chartConfig.type === 'sales' ? 'Ventas' : 'Producto'} - Últimos 30 días`
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Canal</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-900">Tienda Online</p>
                <p className="text-sm text-purple-600">{onlineSales.length} ventas</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-900">${onlineRevenue.toFixed(2)}</p>
                <p className="text-sm text-purple-600">
                  {totalRevenue > 0 ? ((onlineRevenue / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-orange-900">POS Local</p>
                <p className="text-sm text-orange-600">{posSales.length} ventas</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-900">${posRevenue.toFixed(2)}</p>
                <p className="text-sm text-orange-600">
                  {totalRevenue > 0 ? ((posRevenue / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div key={item.product.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </div>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} unidades vendidas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos de ventas para mostrar</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Canal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.slice().reverse().slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">#{sale.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(sale.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{sale.customer || 'Cliente Anónimo'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.type === 'online' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {sale.type === 'online' ? 'Online' : 'POS'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {sale.products.reduce((sum, p) => sum + p.quantity, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                      ${sale.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No hay ventas para mostrar en el período seleccionado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Configuration Modal */}
      {showChartConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Configurar Gráfico</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Gráfico</label>
                <select
                  value={chartConfig.type}
                  onChange={(e) => setChartConfig({...chartConfig, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sales">Ventas Totales</option>
                  <option value="product">Producto Específico</option>
                </select>
              </div>
              
              {chartConfig.type === 'product' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                  <select
                    value={chartConfig.productId}
                    onChange={(e) => setChartConfig({...chartConfig, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <select
                  value={chartConfig.period}
                  onChange={(e) => setChartConfig({...chartConfig, period: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowChartConfig(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => setShowChartConfig(false)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}