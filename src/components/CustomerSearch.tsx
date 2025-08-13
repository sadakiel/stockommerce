import React, { useState } from 'react';
import { Search, User, Plus, X } from 'lucide-react';
import { CustomerInfo } from '../types/orders';

interface CustomerSearchProps {
  customers: CustomerInfo[];
  onSelectCustomer: (customer: CustomerInfo) => void;
  onCreateCustomer: (customer: CustomerInfo) => void;
  selectedCustomer?: CustomerInfo | null;
  onClearCustomer?: () => void;
}

export function CustomerSearch({ 
  customers, 
  onSelectCustomer, 
  onCreateCustomer, 
  selectedCustomer,
  onClearCustomer 
}: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    document: '',
    documentType: 'CC',
    address: '',
    city: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.document.includes(searchTerm) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCustomer = (customer: CustomerInfo) => {
    onSelectCustomer(customer);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customerWithId: CustomerInfo = {
      ...newCustomer,
      id: Date.now().toString()
    };
    onCreateCustomer(customerWithId);
    onSelectCustomer(customerWithId);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      document: '',
      documentType: 'CC',
      address: '',
      city: ''
    });
    setShowCreateModal(false);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      {selectedCustomer ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-green-900">{selectedCustomer.name}</p>
              <p className="text-sm text-green-700">{selectedCustomer.documentType}: {selectedCustomer.document}</p>
              <p className="text-sm text-green-700">{selectedCustomer.email}</p>
              <p className="text-sm text-green-700">{selectedCustomer.phone}</p>
            </div>
            {onClearCustomer && (
              <button
                onClick={onClearCustomer}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar cliente por nombre, documento, teléfono o email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(e.target.value.length > 0);
              }}
              onFocus={() => setShowResults(searchTerm.length > 0)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {showResults && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                <>
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">
                            {customer.documentType}: {customer.document} • {customer.phone}
                          </p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full p-3 text-left hover:bg-blue-50 border-t border-gray-200 text-blue-600"
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="w-5 h-5" />
                      <span>Crear nuevo cliente</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 mb-3">No se encontraron clientes</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear nuevo cliente</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Nuevo Cliente</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
                  <select
                    value={newCustomer.documentType}
                    onChange={(e) => setNewCustomer({...newCustomer, documentType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CC">Cédula</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">Cédula Extranjería</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.document}
                    onChange={(e) => setNewCustomer({...newCustomer, document: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}