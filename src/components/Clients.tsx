import React, { useState } from 'react';
import { Users, Edit, Settings, Plus, Check, X } from 'lucide-react';
import { Tenant } from '../App';

interface ClientsProps {
  tenants: Tenant[];
  onUpdateTenant: (id: string, updates: Partial<Tenant>) => void;
}

export function Clients({ tenants, onUpdateTenant }: ClientsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  
  const [newTenant, setNewTenant] = useState({
    name: '',
    plan: 'basic' as const,
    settings: {
      storeName: '',
      currency: 'USD',
      theme: 'blue',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
      address: '',
      phone: '',
      email: ''
    },
    active: true
  });

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const tenant: Tenant = {
      ...newTenant,
      id: Date.now().toString(),
      settings: {
        ...newTenant.settings,
        storeName: newTenant.settings.storeName || newTenant.name
      }
    };
    // This would typically call an API
    console.log('Adding tenant:', tenant);
    setShowAddModal(false);
    setNewTenant({
      name: '',
      plan: 'basic',
      settings: {
        storeName: '',
        currency: 'USD',
        theme: 'blue',
        logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
        address: '',
        phone: '',
        email: ''
      },
      active: true
    });
  };

  const handleUpdateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTenant) {
      onUpdateTenant(editingTenant.id, editingTenant);
      setEditingTenant(null);
    }
  };

  const planColors = {
    basic: 'bg-gray-100 text-gray-800',
    pro: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800'
  };

  const planNames = {
    basic: 'Básico',
    pro: 'Pro',
    enterprise: 'Enterprise'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">Administra todos los clientes del sistema</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Cliente</span>
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={tenant.settings.logo}
                    alt={tenant.settings.storeName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{tenant.settings.storeName}</h3>
                    <p className="text-sm text-gray-500">{tenant.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tenant.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tenant.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${planColors[tenant.plan]}`}>
                    {planNames[tenant.plan]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{tenant.settings.email || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teléfono:</span>
                  <span className="font-medium">{tenant.settings.phone || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Moneda:</span>
                  <span className="font-medium">{tenant.settings.currency}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => setEditingTenant(tenant)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onUpdateTenant(tenant.id, { active: !tenant.active })}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    tenant.active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {tenant.active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Agregar Cliente</h3>
            <form onSubmit={handleAddTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
                <input
                  type="text"
                  required
                  value={newTenant.settings.storeName}
                  onChange={(e) => setNewTenant({...newTenant, settings: {...newTenant.settings, storeName: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  value={newTenant.plan}
                  onChange={(e) => setNewTenant({...newTenant, plan: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="basic">Básico</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newTenant.settings.email}
                  onChange={(e) => setNewTenant({...newTenant, settings: {...newTenant.settings, email: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={newTenant.settings.phone}
                  onChange={(e) => setNewTenant({...newTenant, settings: {...newTenant.settings, phone: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea
                  value={newTenant.settings.address}
                  onChange={(e) => setNewTenant({...newTenant, settings: {...newTenant.settings, address: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {editingTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Editar Cliente</h3>
            <form onSubmit={handleUpdateTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({...editingTenant, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
                <input
                  type="text"
                  required
                  value={editingTenant.settings.storeName}
                  onChange={(e) => setEditingTenant({
                    ...editingTenant, 
                    settings: {...editingTenant.settings, storeName: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  value={editingTenant.plan}
                  onChange={(e) => setEditingTenant({...editingTenant, plan: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="basic">Básico</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingTenant.settings.email}
                  onChange={(e) => setEditingTenant({
                    ...editingTenant, 
                    settings: {...editingTenant.settings, email: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={editingTenant.settings.phone}
                  onChange={(e) => setEditingTenant({
                    ...editingTenant, 
                    settings: {...editingTenant.settings, phone: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea
                  value={editingTenant.settings.address}
                  onChange={(e) => setEditingTenant({
                    ...editingTenant, 
                    settings: {...editingTenant.settings, address: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active-edit"
                  checked={editingTenant.active}
                  onChange={(e) => setEditingTenant({...editingTenant, active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="active-edit" className="text-sm font-medium text-gray-700">
                  Cliente Activo
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}