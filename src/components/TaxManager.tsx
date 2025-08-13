import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { TaxType } from '../types/product';

interface TaxManagerProps {
  taxes: TaxType[];
  onAddTax: (tax: Omit<TaxType, 'id'>) => void;
  onUpdateTax: (id: string, updates: Partial<TaxType>) => void;
  onDeleteTax: (id: string) => void;
}

export function TaxManager({ taxes, onAddTax, onUpdateTax, onDeleteTax }: TaxManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxType | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    rate: 0,
    type: 'IVA' as TaxType['type'],
    dianCode: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTax) {
      onUpdateTax(editingTax.id, formData);
    } else {
      onAddTax(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rate: 0,
      type: 'IVA',
      dianCode: '',
      active: true
    });
    setEditingTax(null);
    setShowModal(false);
  };

  const openEditModal = (tax: TaxType) => {
    setEditingTax(tax);
    setFormData({
      name: tax.name,
      rate: tax.rate,
      type: tax.type,
      dianCode: tax.dianCode,
      active: tax.active
    });
    setShowModal(true);
  };

  const taxTypes = [
    { value: 'IVA', label: 'IVA - Impuesto al Valor Agregado' },
    { value: 'ICA', label: 'ICA - Impuesto de Industria y Comercio' },
    { value: 'RETEFUENTE', label: 'Retención en la Fuente' },
    { value: 'RETEICA', label: 'Retención ICA' },
    { value: 'CONSUMO', label: 'Impuesto al Consumo' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Impuestos</h2>
          <p className="text-gray-600 mt-1">Configura los impuestos para facturación DIAN</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Impuesto</span>
        </button>
      </div>

      {/* Taxes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Tarifa</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Código DIAN</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((tax) => (
                <tr key={tax.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{tax.name}</td>
                  <td className="py-3 px-4 text-gray-600">{tax.type}</td>
                  <td className="py-3 px-4 text-gray-600">{tax.rate}%</td>
                  <td className="py-3 px-4 text-gray-600">{tax.dianCode}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tax.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tax.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(tax)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTax(tax.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingTax ? 'Editar Impuesto' : 'Nuevo Impuesto'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Impuesto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej. IVA 19%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Impuesto *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as TaxType['type']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {taxTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarifa (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.rate}
                  onChange={(e) => setFormData({...formData, rate: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="19.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código DIAN *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dianCode}
                  onChange={(e) => setFormData({...formData, dianCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                  Impuesto Activo
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
                  <span>{editingTax ? 'Actualizar' : 'Crear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}