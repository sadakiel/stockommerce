import React, { useState } from 'react';
import { Plus, ArrowRightLeft, History, Clipboard, Search, Filter, Package, Warehouse as WarehouseIcon } from 'lucide-react';
import { Warehouse, InventoryMovement, PhysicalCount } from '../types/pages';
import { Product } from '../App';
import { PhysicalInventory } from './PhysicalInventory';

interface AdvancedInventoryProps {
  products: Product[];
  warehouses: Warehouse[];
  movements: InventoryMovement[];
  physicalCounts: PhysicalCount[];
  onAddStock: (productId: string, warehouseId: string, quantity: number, reason: string) => void;
  onTransferStock: (productId: string, fromWarehouseId: string, toWarehouseId: string, quantity: number) => void;
  onCreatePhysicalCount: (count: Omit<PhysicalCount, 'id' | 'tenantId'>) => void;
  onAddWarehouse: (warehouse: Omit<Warehouse, 'id' | 'tenantId'>) => void;
}

export function AdvancedInventory({
  products,
  warehouses,
  movements,
  physicalCounts,
  onAddStock,
  onTransferStock,
  onCreatePhysicalCount,
  onAddWarehouse
}: AdvancedInventoryProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'transfer' | 'physical' | 'warehouses'>('overview');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPhysicalCountModal, setShowPhysicalCountModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showPhysicalInventory, setShowPhysicalInventory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const [stockForm, setStockForm] = useState({
    productId: '',
    warehouseId: '',
    quantity: 0,
    reason: ''
  });

  const [transferForm, setTransferForm] = useState({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: 0
  });

  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    code: '',
    address: '',
    isMain: false,
    active: true
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStock(stockForm.productId, stockForm.warehouseId, stockForm.quantity, stockForm.reason);
    setStockForm({ productId: '', warehouseId: '', quantity: 0, reason: '' });
    setShowAddStockModal(false);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    onTransferStock(transferForm.productId, transferForm.fromWarehouseId, transferForm.toWarehouseId, transferForm.quantity);
    setTransferForm({ productId: '', fromWarehouseId: '', toWarehouseId: '', quantity: 0 });
    setShowTransferModal(false);
  };

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWarehouse(warehouseForm);
    setWarehouseForm({ name: '', code: '', address: '', isMain: false, active: true });
    setShowWarehouseModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario Avanzado</h1>
          <p className="text-gray-600 mt-1">Gestión completa de inventario multi-almacén</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddStockModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Stock</span>
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ArrowRightLeft className="w-5 h-5" />
            <span>Transferir</span>
          </button>
          <button
            onClick={() => setShowPhysicalCountModal(true)}
            onClick={() => setShowPhysicalInventory(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Clipboard className="w-5 h-5" />
            <span>Conteo Físico</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen', icon: Package },
            { id: 'movements', label: 'Movimientos', icon: History },
            { id: 'warehouses', label: 'Almacenes', icon: WarehouseIcon }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los almacenes</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">SKU: {product.sku}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Stock Total:</span>
                      <span className={`font-semibold ${
                        product.stock < 10 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </div>
                    
                    {/* Stock por almacén */}
                    {warehouses.map(warehouse => (
                      <div key={warehouse.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">{warehouse.name}:</span>
                        <span className="text-gray-600">
                          {Math.floor(product.stock / warehouses.length)} {/* Mock distribution */}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        setStockForm({...stockForm, productId: product.id});
                        setShowAddStockModal(true);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      + Stock
                    </button>
                    <button
                      onClick={() => {
                        setTransferForm({...transferForm, productId: product.id});
                        setShowTransferModal(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Transferir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movements Tab */}
      {activeTab === 'movements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar movimientos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los almacenes</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Producto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Cantidad</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Almacén</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Motivo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {movements
                  .filter(movement => {
                    const product = products.find(p => p.id === movement.productId);
                    const matchesSearch = !searchTerm || 
                      product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      movement.reason.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesWarehouse = selectedWarehouse === 'all' || 
                      movement.toWarehouseId === selectedWarehouse ||
                      movement.fromWarehouseId === selectedWarehouse;
                    return matchesSearch && matchesWarehouse;
                  })
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((movement) => {
                  const product = products.find(p => p.id === movement.productId);
                  const warehouse = warehouses.find(w => w.id === movement.toWarehouseId || w.id === movement.fromWarehouseId);
                  return (
                    <tr key={movement.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(movement.created_at).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        <div>
                          <p>{product?.name || 'Producto eliminado'}</p>
                          <p className="text-xs text-gray-500">SKU: {product?.sku || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          movement.type === 'in' ? 'bg-green-100 text-green-800' :
                          movement.type === 'out' ? 'bg-red-100 text-red-800' :
                          movement.type === 'transfer' ? 'bg-blue-100 text-blue-800' :
                          movement.type === 'physical_count' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {movement.type === 'in' ? 'Entrada' :
                           movement.type === 'out' ? 'Salida' :
                           movement.type === 'transfer' ? 'Transferencia' :
                           movement.type === 'physical_count' ? 'Conteo Físico' :
                           'Ajuste'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span className={movement.type === 'out' || (movement.type === 'physical_count' && movement.quantity < 0) ? 'text-red-600' : 'text-green-600'}>
                          {movement.type === 'out' || (movement.type === 'physical_count' && movement.quantity < 0) ? '-' : '+'}{Math.abs(movement.quantity)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {warehouse?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div>
                          <p className="text-sm">{movement.reason}</p>
                          {movement.reference && (
                            <p className="text-xs text-gray-500">Ref: {movement.reference}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        Usuario #{movement.userId}
                      </td>
                    </tr>
                  );
                  })}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* Warehouses Tab */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowWarehouseModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Almacén</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <WarehouseIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{warehouse.name}</h3>
                      <p className="text-sm text-gray-500">Código: {warehouse.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {warehouse.isMain && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Principal
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      warehouse.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {warehouse.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Dirección:</span>
                    <p className="font-medium text-gray-900">{warehouse.address}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Productos:</span>
                    <span className="font-medium">{products.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Physical Inventory Component */}
      {showPhysicalInventory && (
        <div className="fixed inset-0 bg-white z-50">
          <PhysicalInventory
            products={products}
            onCreatePhysicalCount={onCreatePhysicalCount}
            onBack={() => setShowPhysicalInventory(false)}
            currentUser={{ id: '1', name: 'Usuario' }}
            warehouses={warehouses}
          />
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Agregar Stock</h3>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                <select
                  value={stockForm.productId}
                  onChange={(e) => setStockForm({...stockForm, productId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Almacén</label>
                <select
                  value={stockForm.warehouseId}
                  onChange={(e) => setStockForm({...stockForm, warehouseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar almacén</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({...stockForm, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
                <input
                  type="text"
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({...stockForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Compra, devolución, etc."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Transferir Stock</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                <select
                  value={transferForm.productId}
                  onChange={(e) => setTransferForm({...transferForm, productId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desde Almacén</label>
                <select
                  value={transferForm.fromWarehouseId}
                  onChange={(e) => setTransferForm({...transferForm, fromWarehouseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar almacén origen</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hacia Almacén</label>
                <select
                  value={transferForm.toWarehouseId}
                  onChange={(e) => setTransferForm({...transferForm, toWarehouseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar almacén destino</option>
                  {warehouses.filter(w => w.id !== transferForm.fromWarehouseId).map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({...transferForm, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Transferir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warehouse Modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Nuevo Almacén</h3>
            <form onSubmit={handleAddWarehouse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({...warehouseForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
                <input
                  type="text"
                  value={warehouseForm.code}
                  onChange={(e) => setWarehouseForm({...warehouseForm, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <textarea
                  value={warehouseForm.address}
                  onChange={(e) => setWarehouseForm({...warehouseForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMain"
                  checked={warehouseForm.isMain}
                  onChange={(e) => setWarehouseForm({...warehouseForm, isMain: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isMain" className="ml-2 text-sm font-medium text-gray-700">
                  Almacén Principal
                </label>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWarehouseModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}