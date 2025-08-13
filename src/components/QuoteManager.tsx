import React, { useState } from 'react';
import { Plus, Mail, FileText, Eye, Edit, Send } from 'lucide-react';
import { Product } from '../App';

interface Quote {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { product: Product; quantity: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes: string;
  tenantId: string;
  created_at: string;
}

interface QuoteManagerProps {
  products: Product[];
  quotes: Quote[];
  onCreateQuote: (quote: Omit<Quote, 'id' | 'tenantId' | 'created_at'>) => void;
  onUpdateQuote: (id: string, updates: Partial<Quote>) => void;
  onSendQuote: (quoteId: string, email: string) => void;
}

export function QuoteManager({ products, quotes, onCreateQuote, onUpdateQuote, onSendQuote }: QuoteManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number; price: number }[]>([]);
  
  const [quoteForm, setQuoteForm] = useState({
    number: `COT-${Date.now()}`,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft' as const,
    notes: ''
  });

  const [emailModal, setEmailModal] = useState<{ show: boolean; quote: Quote | null }>({
    show: false,
    quote: null
  });

  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const addProductToQuote = (product: Product) => {
    const existing = selectedProducts.find(item => item.product.id === product.id);
    if (existing) {
      setSelectedProducts(prev => prev.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedProducts(prev => [...prev, { product, quantity: 1, price: product.price }]);
    }
  };

  const removeProductFromQuote = (productId: string) => {
    setSelectedProducts(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromQuote(productId);
      return;
    }
    setSelectedProducts(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const updateProductPrice = (productId: string, price: number) => {
    setSelectedProducts(prev => prev.map(item =>
      item.product.id === productId ? { ...item, price } : item
    ));
  };

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateQuote = () => {
    const { subtotal, tax, total } = calculateTotals();
    
    const quote = {
      ...quoteForm,
      items: selectedProducts,
      subtotal,
      tax,
      total
    };
    
    onCreateQuote(quote);
    resetForm();
  };

  const resetForm = () => {
    setQuoteForm({
      number: `COT-${Date.now()}`,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      notes: ''
    });
    setSelectedProducts([]);
    setEditingQuote(null);
    setShowModal(false);
  };

  const openEmailModal = (quote: Quote) => {
    setEmailModal({ show: true, quote });
    setEmailForm({
      to: quote.customerEmail,
      subject: `Cotización ${quote.number} - ${quote.customerName}`,
      message: `Estimado/a ${quote.customerName},\n\nAdjunto encontrará la cotización ${quote.number} por un valor total de $${quote.total.toFixed(2)}.\n\nEsta cotización es válida hasta el ${new Date(quote.validUntil).toLocaleDateString()}.\n\nQuedamos atentos a sus comentarios.\n\nSaludos cordiales.`
    });
  };

  const handleSendEmail = () => {
    if (emailModal.quote) {
      onSendQuote(emailModal.quote.id, emailForm.to);
      setEmailModal({ show: false, quote: null });
      alert('Cotización enviada por correo electrónico');
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Quote['status']) => {
    const labels = {
      draft: 'Borrador',
      sent: 'Enviada',
      accepted: 'Aceptada',
      rejected: 'Rechazada',
      expired: 'Vencida'
    };
    return labels[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
          <p className="text-gray-600 mt-1">Crear y enviar cotizaciones por email</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Cotización</span>
        </button>
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Número</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Válida hasta</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{quote.number}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{quote.customerName}</p>
                      <p className="text-sm text-gray-500">{quote.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ${quote.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-800 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEmailModal(quote)}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quote Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Nueva Cotización</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Cotización
                  </label>
                  <input
                    type="text"
                    value={quoteForm.number}
                    onChange={(e) => setQuoteForm({...quoteForm, number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    value={quoteForm.customerName}
                    onChange={(e) => setQuoteForm({...quoteForm, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Válida hasta
                  </label>
                  <input
                    type="date"
                    value={quoteForm.validUntil}
                    onChange={(e) => setQuoteForm({...quoteForm, validUntil: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email del Cliente
                  </label>
                  <input
                    type="email"
                    value={quoteForm.customerEmail}
                    onChange={(e) => setQuoteForm({...quoteForm, customerEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono del Cliente
                  </label>
                  <input
                    type="tel"
                    value={quoteForm.customerPhone}
                    onChange={(e) => setQuoteForm({...quoteForm, customerPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Seleccionar Productos</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {products.filter(p => p.active).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => addProductToQuote(product)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Productos en Cotización</h4>
                  <div className="space-y-3">
                    {selectedProducts.map((item) => (
                      <div key={item.product.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <button
                            onClick={() => removeProductFromQuote(item.product.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateProductQuantity(item.product.id, parseInt(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Precio Unit.</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateProductPrice(item.product.id, parseFloat(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="font-semibold text-gray-900">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${calculateTotals().subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IVA (19%):</span>
                          <span>${calculateTotals().tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${calculateTotals().total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Términos y condiciones, notas especiales..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateQuote}
                disabled={selectedProducts.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Crear Cotización
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModal.show && emailModal.quote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Enviar Cotización por Email</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para:
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto:
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje:
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setEmailModal({ show: false, quote: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}