import React, { useState } from 'react';
import { Search, Plus, Minus, Save, X, Package, CheckCircle, AlertCircle, Clipboard, BarChart3 } from 'lucide-react';
import { Product } from '../App';
import { PhysicalCount, PhysicalCountItem } from '../types/pages';

interface PhysicalInventoryProps {
  products: Product[];
  onCreatePhysicalCount: (count: Omit<PhysicalCount, 'id' | 'tenantId'>) => void;
  onBack: () => void;
  currentUser: any;
  warehouses: any[];
}

export function PhysicalInventory({ products, onCreatePhysicalCount, onBack, currentUser, warehouses }: PhysicalInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]?.id || '');
  const [countItems, setCountItems] = useState<PhysicalCountItem[]>([]);
  const [countName, setCountName] = useState(`Conteo Físico ${new Date().toLocaleDateString()}`);
  const [showSummary, setShowSummary] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProductToCount = (product: Product) => {
    const existing = countItems.find(item => item.productId === product.id);
    if (existing) {
      updateCountedQuantity(product.id, (existing.countedQuantity || 0) + 1);
    } else {
      const newItem: PhysicalCountItem = {
        id: Date.now().toString(),
        productId: product.id,
        expectedQuantity: product.stock,
        countedQuantity: 1,
        difference: 1 - product.stock,
        notes: '',
        counted: true
      };
      setCountItems(prev => [...prev, newItem]);
    }
  };

  const updateCountedQuantity = (productId: string, quantity: number) => {
    setCountItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(0, quantity);
        const difference = newQuantity - item.expectedQuantity;
        return {
          ...item,
          countedQuantity: newQuantity,
          difference,
          counted: true
        };
      }
      return item;
    }));
  };

  const updateNotes = (productId: string, notes: string) => {
    setCountItems(prev => prev.map(item =>
      item.productId === productId ? { ...item, notes } : item
    ));
  };

  const removeFromCount = (productId: string) => {
    setCountItems(prev => prev.filter(item => item.productId !== productId));
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getTotalCounted = () => countItems.length;
  const getTotalDifferences = () => countItems.filter(item => item.difference !== 0).length;
  const getTotalPositive = () => countItems.filter(item => (item.difference || 0) > 0).length;
  const getTotalNegative = () => countItems.filter(item => (item.difference || 0) < 0).length;

  const handleSaveCount = () => {
    if (countItems.length === 0) {
      alert('Debe contar al menos un producto');
      return;
    }

    const physicalCount: Omit<PhysicalCount, 'id' | 'tenantId'> = {
      name: countName,
      warehouseId: selectedWarehouse,
      status: 'completed',
      items: countItems,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      userId: currentUser?.id || '1'
    };

    onCreatePhysicalCount(physicalCount);
    
    // Create inventory movements for each counted item with differences
    countItems.forEach(item => {
      if (item.difference !== 0) {
        const product = getProductById(item.productId);
        if (product) {
          // This would trigger a movement creation in the parent component
          window.dispatchEvent(new CustomEvent('createInventoryMovement', {
            detail: {
              type: 'physical_count',
              productId: item.productId,
              warehouseId: selectedWarehouse,
              quantity: Math.abs(item.difference || 0),
              reason: `Conteo físico: ${countName}. ${item.notes || 'Ajuste de inventario'}`,
              isPositive: (item.difference || 0) > 0
            }
          }));
        }
      }
    });
    
    alert('Conteo físico guardado exitosamente');
    onBack();
  };

  const clearCount = () => {
    setCountItems([]);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conteo Físico de Inventario</h1>
            <p className="text-gray-600 mt-1">Escanea o busca productos para registrar las cantidades contadas</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSummary(true)}
            disabled={countItems.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Ver Resumen</span>
          </button>
          <button
            onClick={handleSaveCount}
            disabled={countItems.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Guardar Conteo</span>
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Conteo</label>
            <input
              type="text"
              value={countName}
              onChange={(e) => setCountName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Almacén</label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearCount}
              disabled={countItems.length === 0}
              className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Limpiar Conteo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar Productos</h3>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => {
              const isInCount = countItems.some(item => item.productId === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => addProductToCount(product)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    isInCount 
                      ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                      : 'border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      <p className="text-sm text-gray-600">Stock Sistema: {product.stock}</p>
                    </div>
                    {isInCount && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Count Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Productos Contados</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clipboard className="w-4 h-4" />
              <span>{getTotalCounted()} productos</span>
            </div>
          </div>

          {countItems.length > 0 ? (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {countItems.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                const difference = item.difference || 0;
                const isDifferent = difference !== 0;

                return (
                  <div key={item.id} className={`p-4 border rounded-lg ${
                    isDifferent 
                      ? difference > 0 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCount(item.productId)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Sistema</label>
                        <div className="px-2 py-1 bg-gray-100 rounded text-center font-medium">
                          {item.expectedQuantity}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Contado</label>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateCountedQuantity(item.productId, (item.countedQuantity || 0) - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={item.countedQuantity || 0}
                            onChange={(e) => updateCountedQuantity(item.productId, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          />
                          <button
                            onClick={() => updateCountedQuantity(item.productId, (item.countedQuantity || 0) + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Diferencia</label>
                        <div className={`px-2 py-1 rounded text-center font-medium ${
                          difference === 0 ? 'bg-gray-100 text-gray-700' :
                          difference > 0 ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {difference > 0 ? '+' : ''}{difference}
                        </div>
                      </div>
                    </div>

                    {isDifferent && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Notas (opcional)</label>
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => updateNotes(item.productId, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Motivo de la diferencia..."
                        />
                      </div>
                    )}

                    {isDifferent && (
                      <div className="mt-2 flex items-center space-x-2">
                        {difference > 0 ? (
                          <AlertCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          difference > 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {difference > 0 ? 'Sobrante' : 'Faltante'}: {Math.abs(difference)} unidades
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Busca y selecciona productos para iniciar el conteo</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {countItems.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Conteo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{getTotalCounted()}</p>
              <p className="text-sm text-blue-700">Productos Contados</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{getTotalDifferences()}</p>
              <p className="text-sm text-yellow-700">Con Diferencias</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{getTotalPositive()}</p>
              <p className="text-sm text-green-700">Sobrantes</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{getTotalNegative()}</p>
              <p className="text-sm text-red-700">Faltantes</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Resumen del Conteo Físico</h3>
                <button
                  onClick={() => setShowSummary(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{getTotalCounted()}</p>
                  <p className="text-sm text-blue-700">Total Contados</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{getTotalDifferences()}</p>
                  <p className="text-sm text-yellow-700">Con Diferencias</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">+{countItems.reduce((sum, item) => sum + Math.max(0, item.difference || 0), 0)}</p>
                  <p className="text-sm text-green-700">Total Sobrantes</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{countItems.reduce((sum, item) => sum + Math.min(0, item.difference || 0), 0)}</p>
                  <p className="text-sm text-red-700">Total Faltantes</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Producto</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Sistema</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Contado</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Diferencia</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countItems.map((item) => {
                      const product = getProductById(item.productId);
                      if (!product) return null;

                      const difference = item.difference || 0;
                      
                      return (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">{item.expectedQuantity}</td>
                          <td className="py-3 px-4 text-center font-medium">{item.countedQuantity}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold ${
                              difference === 0 ? 'text-gray-700' :
                              difference > 0 ? 'text-green-600' :
                              'text-red-600'
                            }`}>
                              {difference > 0 ? '+' : ''}{difference}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.notes || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowSummary(false);
                  handleSaveCount();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Conteo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}