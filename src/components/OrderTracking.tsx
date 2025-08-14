import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, User, Store, CreditCard, Edit, Save, X } from 'lucide-react';
import { OnlineOrder, OrderStatus } from '../types/orders';
import { Sale } from '../App';

interface OrderTrackingProps {
  orders: OnlineOrder[];
  recentSales: Sale[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus['status'], notes?: string) => void;
  currentUser: any;
}

export function OrderTracking({ orders, recentSales, onUpdateOrderStatus, currentUser }: OrderTrackingProps) {
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStatus, setEditingStatus] = useState<{ orderId: string; status: OrderStatus['status'] } | null>(null);
  const [statusNotes, setStatusNotes] = useState('');

  const filteredOrders = orders.filter(order =>
    order.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.document.includes(searchTerm)
  );

  const statusConfig = {
    pedido_realizado: { label: 'Pedido Realizado', color: 'bg-blue-100 text-blue-800', icon: Package },
    en_alistamiento: { label: 'En Alistamiento', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmado_pago: { label: 'Pago Confirmado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    enviado: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
    con_transportador: { label: 'Con Transportador', color: 'bg-orange-100 text-orange-800', icon: MapPin },
    entregado: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
  };

  const getStatusProgress = (status: OrderStatus['status']) => {
    const statuses = ['pedido_realizado', 'en_alistamiento', 'confirmado_pago', 'enviado', 'con_transportador', 'entregado'];
    return statuses.indexOf(status) + 1;
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus['status']) => {
    setEditingStatus({ orderId, status: newStatus });
    setStatusNotes('');
  };

  const confirmStatusUpdate = () => {
    if (editingStatus) {
      const notes = statusNotes || `Estado actualizado por ${currentUser?.name || 'Usuario'}`;
      onUpdateOrderStatus(editingStatus.orderId, editingStatus.status, notes);
      setEditingStatus(null);
      setStatusNotes('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seguimiento de Pedidos</h1>
          <p className="text-gray-600 mt-1">Gestiona el estado de los pedidos online</p>
        </div>
      </div>

      {/* Recent Sales Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Ventas</h3>
        <div className="space-y-3">
          {recentSales.slice(0, 10).map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  sale.type === 'online' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  {sale.type === 'online' ? (
                    <Store className={`w-4 h-4 ${sale.type === 'online' ? 'text-purple-600' : 'text-orange-600'}`} />
                  ) : (
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">#{sale.id}</p>
                  <p className="text-sm text-gray-500">
                    {sale.products.map(p => p.product.name).join(', ')}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{sale.customer || 'Cliente Anónimo'}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      sale.type === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {sale.type === 'online' ? 'Online' : 'POS'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${sale.total.toLocaleString('es-CO')}</p>
                <p className="text-xs text-gray-500">
                  {new Date(sale.date).toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por código de ticket, nombre o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const statusInfo = statusConfig[order.currentStatus];
          const StatusIcon = statusInfo.icon;
          const progress = getStatusProgress(order.currentStatus);
          
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.ticketCode}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <StatusIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{order.customer.name}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progreso</span>
                    <span>{progress}/6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(progress / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items:</span>
                    <span>{order.products.reduce((sum, p) => sum + p.quantity, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const isCompleted = getStatusProgress(status as any) <= progress;
                    const isCurrent = order.currentStatus === status;
                    const canUpdate = getStatusProgress(status as any) === progress + 1 || isCurrent;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => {
                          if (canUpdate && !isCurrent) {
                            handleUpdateStatus(order.id, status as any);
                          }
                        }}
                        disabled={!canUpdate}
                        className={`p-2 text-xs rounded-lg transition-colors ${
                          isCurrent 
                            ? config.color
                            : canUpdate
                            ? 'border border-gray-300 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Pedido {selectedOrder.ticketCode}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información del Cliente</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nombre:</span>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Documento:</span>
                    <p className="font-medium">{selectedOrder.customer.documentType}: {selectedOrder.customer.document}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-500 text-sm">Dirección de envío:</span>
                  <p className="font-medium">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Productos</h4>
                <div className="space-y-3">
                  {selectedOrder.products.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Historial de Estados</h4>
                <div className="space-y-3">
                  {selectedOrder.statusHistory.map((status, index) => {
                    const statusInfo = statusConfig[status.status];
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{statusInfo.label}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(status.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600 font-medium">
                            Actualizado por: {currentUser?.name || 'Sistema'}
                          </p>
                          {status.notes && (
                            <p className="text-sm text-gray-600 mt-1">{status.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {editingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Actualizar Estado</h3>
              <button
                onClick={() => setEditingStatus(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Estado
                </label>
                <div className={`p-3 rounded-lg ${statusConfig[editingStatus.status].color}`}>
                  {statusConfig[editingStatus.status].label}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agregar notas sobre el cambio de estado..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditingStatus(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Actualizar Estado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}