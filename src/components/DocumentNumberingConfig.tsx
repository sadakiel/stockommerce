import React, { useState } from 'react';
import { FileText, Hash, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { DocumentNumbering } from '../types/sales';

interface DocumentNumberingConfigProps {
  numberings: DocumentNumbering[];
  onCreateNumbering: (numbering: Omit<DocumentNumbering, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => void;
  onUpdateNumbering: (id: string, updates: Partial<DocumentNumbering>) => void;
  onDeleteNumbering: (id: string) => void;
}

export function DocumentNumberingConfig({ 
  numberings, 
  onCreateNumbering, 
  onUpdateNumbering, 
  onDeleteNumbering 
}: DocumentNumberingConfigProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingNumbering, setEditingNumbering] = useState<DocumentNumbering | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'quote' as DocumentNumbering['type'],
    prefix: '',
    currentNumber: 1,
    minNumber: 1,
    maxNumber: 999999,
    active: true
  });

  const documentTypes = [
    { value: 'invoice', label: 'Facturas DIAN', icon: '📄', description: 'Numeración para facturas electrónicas' },
    { value: 'quote', label: 'Cotizaciones', icon: '💰', description: 'Numeración para cotizaciones comerciales' },
    { value: 'purchase', label: 'Órdenes de Compra', icon: '🛒', description: 'Numeración para compras a proveedores' },
    { value: 'support_ticket', label: 'Tickets de Soporte', icon: '🎫', description: 'Numeración para tickets de atención' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNumbering) {
      onUpdateNumbering(editingNumbering.id, formData);
    } else {
      onCreateNumbering(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'quote',
      prefix: '',
      currentNumber: 1,
      minNumber: 1,
      maxNumber: 999999,
      active: true
    });
    setEditingNumbering(null);
    setShowModal(false);
  };

  const openEditModal = (numbering: DocumentNumbering) => {
    setEditingNumbering(numbering);
    setFormData({
      type: numbering.type,
      prefix: numbering.prefix,
      currentNumber: numbering.currentNumber,
      minNumber: numbering.minNumber,
      maxNumber: numbering.maxNumber,
      active: numbering.active
    });
    setShowModal(true);
  };

  const generateNextNumber = (numbering: DocumentNumbering) => {
    return `${numbering.prefix}${numbering.currentNumber.toString().padStart(6, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Numeración de Documentos</h2>
          <p className="text-gray-600 mt-1">
            Configura la numeración automática para cotizaciones, compras y tickets
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Numeración</span>
        </button>
      </div>

      {/* Numbering Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {numberings.map((numbering) => {
          const docType = documentTypes.find(t => t.value === numbering.type);
          return (
            <div key={numbering.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{docType?.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{docType?.label}</h3>
                    <p className="text-sm text-gray-500">{docType?.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  numbering.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {numbering.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Prefijo:</span>
                  <span className="font-medium text-gray-900">{numbering.prefix}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Número Actual:</span>
                  <span className="font-medium text-gray-900">{numbering.currentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Próximo:</span>
                  <span className="font-bold text-blue-600">{generateNextNumber(numbering)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Rango:</span>
                  <span className="font-medium text-gray-900">
                    {numbering.minNumber} - {numbering.maxNumber}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(numbering)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDeleteNumbering(numbering.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Numbering Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingNumbering ? 'Editar Numeración' : 'Nueva Numeración'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefijo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prefix}
                  onChange={(e) => setFormData({...formData, prefix: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="COT, COMP, TKT"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número Inicial *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.currentNumber}
                    onChange={(e) => setFormData({...formData, currentNumber: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número Máximo *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.maxNumber}
                    onChange={(e) => setFormData({...formData, maxNumber: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
                  Numeración Activa
                </label>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Vista previa:</strong> {formData.prefix}{formData.currentNumber.toString().padStart(6, '0')}
                </p>
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
                  <span>{editingNumbering ? 'Actualizar' : 'Crear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}