import React, { useState } from 'react';
import { Plus, Mail, FileText, Eye, Edit, Send, Download, Printer, X } from 'lucide-react';
import { Product } from '../App';
import { CustomerSearch } from './CustomerSearch';
import { CustomerInfo } from '../types/orders';
import jsPDF from 'jspdf';

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
  customers: CustomerInfo[];
  onCreateCustomer: (customer: CustomerInfo) => void;
}

export function QuoteManager({ products, quotes, onCreateQuote, onUpdateQuote, onSendQuote, customers, onCreateCustomer }: QuoteManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number; price: number }[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  
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
  
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);

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

  const generateQuotePDF = (quote: Quote) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('COTIZACIÓN', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Número: ${quote.number}`, 20, 45);
    pdf.text(`Fecha: ${new Date(quote.created_at).toLocaleDateString()}`, 20, 55);
    pdf.text(`Válida hasta: ${new Date(quote.validUntil).toLocaleDateString()}`, 20, 65);
    
    // Customer info
    pdf.setFontSize(14);
    pdf.text('CLIENTE:', 20, 85);
    
    pdf.setFontSize(10);
    pdf.text(`Nombre: ${quote.customerName}`, 20, 100);
    pdf.text(`Email: ${quote.customerEmail}`, 20, 110);
    pdf.text(`Teléfono: ${quote.customerPhone}`, 20, 120);
    
    // Items
    pdf.setFontSize(14);
    pdf.text('PRODUCTOS:', 20, 140);
    
    pdf.setFontSize(10);
    let yPos = 155;
    quote.items.forEach((item, index) => {
      pdf.text(`${index + 1}. ${item.product.name}`, 20, yPos);
      pdf.text(`Cantidad: ${item.quantity}`, 30, yPos + 10);
      pdf.text(`Precio: $${item.price.toFixed(2)}`, 30, yPos + 20);
      pdf.text(`Total: $${(item.price * item.quantity).toFixed(2)}`, 30, yPos + 30);
      yPos += 45;
    });
    
    // Totals
    yPos += 10;
    pdf.setFontSize(12);
    pdf.text(`Subtotal: $${quote.subtotal.toFixed(2)}`, 20, yPos);
    pdf.text(`IVA (19%): $${quote.tax.toFixed(2)}`, 20, yPos + 15);
    pdf.text(`TOTAL: $${quote.total.toFixed(2)}`, 20, yPos + 30);
    
    // Notes
    if (quote.notes) {
      pdf.setFontSize(10);
      pdf.text('Notas:', 20, yPos + 50);
      pdf.text(quote.notes, 20, yPos + 65);
    }
    
    pdf.save(`cotizacion-${quote.number}.pdf`);
  };

  const printQuote = (quote: Quote) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cotización ${quote.number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .customer-info { background: #f5f5f5; padding: 15px; margin: 20px 0; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items-table th { background-color: #f2f2f2; }
              .totals { text-align: right; margin: 20px 0; }
              .notes { margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>COTIZACIÓN</h1>
              <p>Número: ${quote.number}</p>
              <p>Fecha: ${new Date(quote.created_at).toLocaleDateString()}</p>
              <p>Válida hasta: ${new Date(quote.validUntil).toLocaleDateString()}</p>
            </div>
            
            <div class="customer-info">
              <h3>INFORMACIÓN DEL CLIENTE</h3>
              <p><strong>Nombre:</strong> ${quote.customerName}</p>
              <p><strong>Email:</strong> ${quote.customerEmail}</p>
              <p><strong>Teléfono:</strong> ${quote.customerPhone}</p>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${quote.items.map(item => `
                  <tr>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <p>Subtotal: $${quote.subtotal.toFixed(2)}</p>
              <p>IVA (19%): $${quote.tax.toFixed(2)}</p>
              <p><strong>TOTAL: $${quote.total.toFixed(2)}</strong></p>
            </div>
            
            ${quote.notes ? `<div class="notes"><h4>Notas:</h4><p>${quote.notes}</p></div>` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
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
                      <button 
                        onClick={() => setViewingQuote(quote)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => generateQuotePDF(quote)}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => printQuote(quote)}
                        className="text-purple-600 hover:text-purple-800 p-1"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-800 p-1">
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente
                  </label>
                  <CustomerSearch
                    customers={customers}
                    onSelectCustomer={(customer) => {
                      setSelectedCustomer(customer);
                      setQuoteForm({
                        ...quoteForm,
                        customerName: customer.name,
                        customerEmail: customer.email,
                        customerPhone: customer.phone
                      });
                    }}
                    onCreateCustomer={(customer) => {
                      onCreateCustomer(customer);
                      setSelectedCustomer(customer);
                      setQuoteForm({
                        ...quoteForm,
                        customerName: customer.name,
                        customerEmail: customer.email,
                        customerPhone: customer.phone
                      });
                    }}
                    selectedCustomer={selectedCustomer}
                    onClearCustomer={() => {
                      setSelectedCustomer(null);
                      setQuoteForm({
                        ...quoteForm,
                        customerName: '',
                        customerEmail: '',
                        customerPhone: ''
                      });
                    }}
                  />
                </div>
              </div>
              
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
                    disabled={!!selectedCustomer}
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
                    disabled={!!selectedCustomer}
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
                    disabled={!!selectedCustomer}
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

      {/* View Quote Modal */}
      {viewingQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Cotización {viewingQuote.number}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => generateQuotePDF(viewingQuote)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => printQuote(viewingQuote)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir</span>
                  </button>
                  <button
                    onClick={() => setViewingQuote(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6" id="quote-content">
              {/* Quote Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">COTIZACIÓN</h1>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Número:</span>
                    <p className="font-semibold">{viewingQuote.number}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <p className="font-semibold">{new Date(viewingQuote.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Válida hasta:</span>
                    <p className="font-semibold">{new Date(viewingQuote.validUntil).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">INFORMACIÓN DEL CLIENTE</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nombre:</span>
                    <p className="font-medium">{viewingQuote.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{viewingQuote.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium">{viewingQuote.customerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">PRODUCTOS COTIZADOS</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Cantidad</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Precio Unit.</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingQuote.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">${item.price.toFixed(2)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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

              {/* Totals */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${viewingQuote.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (19%):</span>
                    <span>${viewingQuote.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span>${viewingQuote.total.toFixed(2)}</span>
                  </div>
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
              {/* Notes */}
              {viewingQuote.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Notas:</h4>
                  <p className="text-gray-700">{viewingQuote.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}