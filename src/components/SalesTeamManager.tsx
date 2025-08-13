import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Target, Plus, Edit, Trash2, Save, X, Award, BarChart3 } from 'lucide-react';
import { SalesTeam, SalesPerformance } from '../types/sales';
import { Commission } from '../types/orders';
import { Sale } from '../App';

interface SalesTeamManagerProps {
  salesTeam: SalesTeam[];
  commissions: Commission[];
  sales: Sale[];
  onCreateSeller: (seller: Omit<SalesTeam, 'id' | 'tenantId' | 'created_at'>) => void;
  onUpdateSeller: (id: string, updates: Partial<SalesTeam>) => void;
  onDeleteSeller: (id: string) => void;
}

export function SalesTeamManager({ 
  salesTeam, 
  commissions, 
  sales, 
  onCreateSeller, 
  onUpdateSeller, 
  onDeleteSeller 
}: SalesTeamManagerProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'performance' | 'commissions'>('team');
  const [showModal, setShowModal] = useState(false);
  const [editingSeller, setEditingSeller] = useState<SalesTeam | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  
  const [sellerForm, setSellerForm] = useState({
    name: '',
    email: '',
    commissionRate: 5,
    isOnlineChannel: false,
    active: true
  });

  const calculatePerformance = (): SalesPerformance[] => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const cutoffDate = {
      today: startOfDay,
      week: startOfWeek,
      month: startOfMonth
    }[selectedPeriod] || startOfDay;

    const periodSales = sales.filter(sale => new Date(sale.date) >= cutoffDate);
    const periodCommissions = commissions.filter(c => new Date(c.date) >= cutoffDate);

    // Add online channel as a virtual seller
    const allSellers = [
      ...salesTeam,
      {
        id: 'online-channel',
        name: 'Canal Online',
        email: 'online@system.com',
        commissionRate: 0,
        isOnlineChannel: true,
        active: true,
        tenantId: 'tenant1',
        created_at: new Date().toISOString()
      }
    ];

    return allSellers.map(seller => {
      const sellerSales = seller.isOnlineChannel 
        ? periodSales.filter(s => s.type === 'online')
        : periodSales.filter(s => s.type === 'pos'); // Assuming POS sales are from team members

      const sellerCommissions = periodCommissions.filter(c => c.userId === seller.id);
      
      const totalRevenue = sellerSales.reduce((sum, sale) => sum + sale.total, 0);
      const totalCommissions = sellerCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
      const averageOrderValue = sellerSales.length > 0 ? totalRevenue / sellerSales.length : 0;

      return {
        sellerId: seller.id,
        sellerName: seller.name,
        isOnlineChannel: seller.isOnlineChannel,
        totalSales: sellerSales.length,
        totalRevenue,
        totalCommissions,
        averageOrderValue,
        conversionRate: 0, // Would be calculated with more data
        period: selectedPeriod
      };
    });
  };

  const performance = calculatePerformance();
  const todayCommissions = commissions.filter(c => {
    const today = new Date().toDateString();
    return new Date(c.date).toDateString() === today;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSeller) {
      onUpdateSeller(editingSeller.id, sellerForm);
    } else {
      onCreateSeller(sellerForm);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setSellerForm({
      name: '',
      email: '',
      commissionRate: 5,
      isOnlineChannel: false,
      active: true
    });
    setEditingSeller(null);
    setShowModal(false);
  };

  const openEditModal = (seller: SalesTeam) => {
    setEditingSeller(seller);
    setSellerForm({
      name: seller.name,
      email: seller.email,
      commissionRate: seller.commissionRate,
      isOnlineChannel: seller.isOnlineChannel,
      active: seller.active
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuerza de Ventas</h1>
          <p className="text-gray-600 mt-1">Gestiona tu equipo de ventas y comisiones</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Vendedor</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'team', label: 'Equipo de Ventas', icon: Users },
            { id: 'performance', label: 'Desempeño', icon: TrendingUp },
            { id: 'commissions', label: 'Comisiones', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Online Channel Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Canal Online</h3>
                  <p className="text-sm opacity-90">Ventas automáticas</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
                Sistema
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-90">Ventas hoy:</span>
                <span className="font-semibold">
                  {sales.filter(s => s.type === 'online' && 
                    new Date(s.date).toDateString() === new Date().toDateString()).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Ingresos:</span>
                <span className="font-semibold">
                  ${sales.filter(s => s.type === 'online' && 
                    new Date(s.date).toDateString() === new Date().toDateString())
                    .reduce((sum, s) => sum + s.total, 0).toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>

          {/* Sales Team Cards */}
          {salesTeam.map((seller) => (
            <div key={seller.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {seller.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                    <p className="text-sm text-gray-500">{seller.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  seller.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {seller.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Comisión:</span>
                  <span className="font-semibold">{seller.commissionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ventas hoy:</span>
                  <span className="font-semibold">
                    {commissions.filter(c => c.userId === seller.id && 
                      new Date(c.date).toDateString() === new Date().toDateString()).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Comisiones hoy:</span>
                  <span className="font-semibold text-green-600">
                    ${commissions
                      .filter(c => c.userId === seller.id)
                      .filter(c => new Date(c.date).toDateString() === new Date().toDateString())
                      .reduce((sum, c) => sum + c.commissionAmount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openEditModal(seller)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDeleteSeller(seller.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Desempeño de Ventas</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performance.map((perf) => (
              <div key={perf.sellerId} className={`rounded-xl p-6 ${
                perf.isOnlineChannel 
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                  : 'bg-white shadow-sm border border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      perf.isOnlineChannel 
                        ? 'bg-white bg-opacity-20'
                        : 'bg-blue-100'
                    }`}>
                      {perf.isOnlineChannel ? (
                        <Target className={`w-5 h-5 ${perf.isOnlineChannel ? 'text-white' : 'text-blue-600'}`} />
                      ) : (
                        <Users className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${perf.isOnlineChannel ? 'text-white' : 'text-gray-900'}`}>
                        {perf.sellerName}
                      </h4>
                      <p className={`text-sm ${perf.isOnlineChannel ? 'text-white opacity-90' : 'text-gray-500'}`}>
                        {perf.isOnlineChannel ? 'Canal Digital' : 'Vendedor'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${perf.isOnlineChannel ? 'text-white opacity-90' : 'text-gray-500'}`}>
                      Ventas:
                    </span>
                    <span className={`font-bold ${perf.isOnlineChannel ? 'text-white' : 'text-gray-900'}`}>
                      {perf.totalSales}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${perf.isOnlineChannel ? 'text-white opacity-90' : 'text-gray-500'}`}>
                      Ingresos:
                    </span>
                    <span className={`font-bold ${perf.isOnlineChannel ? 'text-white' : 'text-green-600'}`}>
                      ${perf.totalRevenue.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${perf.isOnlineChannel ? 'text-white opacity-90' : 'text-gray-500'}`}>
                      Comisiones:
                    </span>
                    <span className={`font-bold ${perf.isOnlineChannel ? 'text-white' : 'text-green-600'}`}>
                      ${perf.totalCommissions.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${perf.isOnlineChannel ? 'text-white opacity-90' : 'text-gray-500'}`}>
                      Ticket Promedio:
                    </span>
                    <span className={`font-bold ${perf.isOnlineChannel ? 'text-white' : 'text-gray-900'}`}>
                      ${perf.averageOrderValue.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de Desempeño</h4>
            <div className="space-y-4">
              {performance.map((perf) => (
                <div key={perf.sellerId} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-gray-900">
                    {perf.sellerName}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className={`h-4 rounded-full ${
                        perf.isOnlineChannel ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (perf.totalRevenue / Math.max(...performance.map(p => p.totalRevenue))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="w-24 text-right text-sm font-semibold text-gray-900">
                    ${perf.totalRevenue.toLocaleString('es-CO')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comisiones Hoy</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${todayCommissions.reduce((sum, c) => sum + c.commissionAmount, 0).toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventas con Comisión</p>
                  <p className="text-2xl font-bold text-blue-600">{todayCommissions.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Promedio Comisión</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {todayCommissions.length > 0 
                      ? (todayCommissions.reduce((sum, c) => sum + c.commissionRate, 0) / todayCommissions.length).toFixed(1)
                      : '0'}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Vendedor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Venta</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Monto Venta</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">% Comisión</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Comisión</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{commission.userName}</td>
                      <td className="py-3 px-4 text-gray-600">#{commission.saleId}</td>
                      <td className="py-3 px-4 text-gray-600">${commission.saleAmount.toLocaleString('es-CO')}</td>
                      <td className="py-3 px-4 text-gray-600">{commission.commissionRate}%</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        ${commission.commissionAmount.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(commission.date).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Seller Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingSeller ? 'Editar Vendedor' : 'Nuevo Vendedor'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={sellerForm.name}
                  onChange={(e) => setSellerForm({...sellerForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={sellerForm.email}
                  onChange={(e) => setSellerForm({...sellerForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje de Comisión (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={sellerForm.commissionRate}
                  onChange={(e) => setSellerForm({...sellerForm, commissionRate: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={sellerForm.active}
                  onChange={(e) => setSellerForm({...sellerForm, active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                  Vendedor Activo
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSeller ? 'Actualizar' : 'Crear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}