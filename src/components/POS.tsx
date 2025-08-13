import React, { useState } from 'react';
import { Search, ShoppingCart, Trash2, Calculator, CreditCard, User, Mail, Printer, FileText, X, Plus, Minus } from 'lucide-react';
import { Product, Sale } from '../App';
import { POSCustomer, POSPayment, POSSale, POSItem, POSTax, POSTicket } from '../types/pos';

interface POSProps {
  products: Product[];
  onSale: (sale: Omit<Sale, 'id' | 'tenantId'>) => void;
  tenantSettings: any;
  currentUser: any;
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export function POS({ products, onSale, tenantSettings, currentUser }: POSProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState<POSCustomer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [completedSale, setCompletedSale] = useState<POSSale | null>(null);
  
  const [customerForm, setCustomerForm] = useState<POSCustomer>({
    name: '',
    email: '',
    phone: '',
    document: '',
    documentType: 'CC',
    address: '',
    city: '',
    requiresInvoice: false
  });

  const [payment, setPayment] = useState<POSPayment>({
    method: 'cash',
    amount: 0,
    cashReceived: 0,
    change: 0
  });

  const activeProducts = products.filter(p => p.active && p.stock > 0);
  
  const filteredProducts = activeProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev;
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const maxQuantity = Math.min(quantity, item.product.stock);
        return { ...item, quantity: maxQuantity };
      }
      return item;
    }));
  };

  const updateDiscount = (productId: string, discount: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, discount: Math.max(0, Math.min(100, discount)) } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setPayment({ method: 'cash', amount: 0, cashReceived: 0, change: 0 });
  };

  const calculateItemTotal = (item: CartItem) => {
    const subtotal = item.product.price * item.quantity;
    const discountAmount = (subtotal * item.discount) / 100;
    return subtotal - discountAmount;
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getSubtotal = () => cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const getTaxes = () => getSubtotal() * 0.19; // 19% IVA
  const getTotalPrice = () => getSubtotal() + getTaxes();

  const handleAddCustomer = () => {
    setCustomer(customerForm);
    setShowCustomerModal(false);
    resetCustomerForm();
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      document: '',
      documentType: 'CC',
      address: '',
      city: '',
      requiresInvoice: false
    });
  };

  const handlePayment = () => {
    if (cart.length === 0) return;

    const total = getTotalPrice();
    const updatedPayment = { ...payment, amount: total };
    
    if (payment.method === 'cash') {
      updatedPayment.change = Math.max(0, (payment.cashReceived || 0) - total);
    }

    // Create POS sale
    const posSale: POSSale = {
      id: Date.now().toString(),
      number: `POS-${Date.now()}`,
      customer: customer || undefined,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.product.price,
        discount: item.discount,
        subtotal: item.product.price * item.quantity,
        taxes: [{
          type: 'IVA',
          rate: 19,
          base: calculateItemTotal(item),
          amount: calculateItemTotal(item) * 0.19
        }],
        total: calculateItemTotal(item) + (calculateItemTotal(item) * 0.19)
      })),
      subtotal: getSubtotal(),
      taxes: [{
        type: 'IVA',
        rate: 19,
        base: getSubtotal(),
        amount: getTaxes()
      }],
      total: getTotalPrice(),
      payment: updatedPayment,
      date: new Date().toISOString(),
      cashier: currentUser?.name || 'Cajero',
      tenantId: currentUser?.tenantId || 'tenant1'
    };

    // Generate electronic invoice if customer requires it
    if (customer?.requiresInvoice) {
      posSale.electronicInvoice = {
        cufe: generateCUFE(),
        qrCode: generateQRCode(posSale),
        xmlUrl: '',
        pdfUrl: '',
        status: 'pending'
      };
    }

    setCompletedSale(posSale);
    setShowPaymentModal(false);
    setShowTicketModal(true);

    // Convert to legacy sale format for compatibility
    const legacySale: Omit<Sale, 'id' | 'tenantId'> = {
      products: cart.map(item => ({ product: item.product, quantity: item.quantity })),
      total: getTotalPrice(),
      date: new Date().toISOString(),
      type: 'pos',
      customer: customer?.name
    };

    onSale(legacySale);
  };

  const generateCUFE = () => {
    // Mock CUFE generation - in production, this would be generated by DIAN
    return 'CUFE' + Date.now().toString(36).toUpperCase();
  };

  const generateQRCode = (sale: POSSale) => {
    // Mock QR code generation - in production, this would contain DIAN data
    return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" fill="black">QR</text></svg>`)}`;
  };

  const printTicket = () => {
    window.print();
  };

  const sendEmailInvoice = async () => {
    if (completedSale?.customer?.email) {
      // Mock email sending - in production, integrate with email service
      alert(`Factura enviada a ${completedSale.customer.email}`);
      
      if (completedSale.electronicInvoice) {
        completedSale.electronicInvoice.status = 'sent';
      }
    }
  };

  const finalizeSale = () => {
    clearCart();
    setCompletedSale(null);
    setShowTicketModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 h-full overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate group-hover:text-blue-700">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Venta POS</span>
          </h3>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Customer Section */}
        <div className="mb-4">
          {customer ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-green-900">{customer.name}</p>
                  <p className="text-sm text-green-700">{customer.document}</p>
                  {customer.requiresInvoice && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Requiere Factura
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setCustomer(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomerModal(true)}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
            >
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Agregar Cliente</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} c/u</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                        className="w-12 px-1 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Descuento %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => updateDiscount(item.product.id, parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${calculateItemTotal(item).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Selecciona productos para iniciar la venta</p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items: {getTotalItems()}</span>
                <span>Subtotal: ${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (19%):</span>
                <span>${getTaxes().toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-xl font-bold text-blue-800">
                <span>TOTAL:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
            >
              <CreditCard className="w-5 h-5" />
              <span>PROCESAR PAGO</span>
            </button>
          </div>
        )}
      </div>

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Datos del Cliente</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
                  <select
                    value={customerForm.documentType}
                    onChange={(e) => setCustomerForm({...customerForm, documentType: e.target.value as any})}
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
                    value={customerForm.document}
                    onChange={(e) => setCustomerForm({...customerForm, document: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiresInvoice"
                  checked={customerForm.requiresInvoice}
                  onChange={(e) => setCustomerForm({...customerForm, requiresInvoice: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="requiresInvoice" className="ml-2 text-sm font-medium text-gray-700">
                  Requiere Factura Electrónica
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={!customerForm.name || !customerForm.document}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Procesar Pago</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total a Pagar:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <select
                  value={payment.method}
                  onChange={(e) => setPayment({...payment, method: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                  <option value="transfer">Transferencia</option>
                  <option value="mixed">Mixto</option>
                </select>
              </div>
              
              {payment.method === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Efectivo Recibido</label>
                  <input
                    type="number"
                    step="0.01"
                    value={payment.cashReceived || ''}
                    onChange={(e) => setPayment({...payment, cashReceived: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  {(payment.cashReceived || 0) >= getTotalPrice() && (
                    <p className="mt-2 text-green-600 font-medium">
                      Cambio: ${Math.max(0, (payment.cashReceived || 0) - getTotalPrice()).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
              
              {payment.method !== 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Referencia</label>
                  <input
                    type="text"
                    value={payment.reference || ''}
                    onChange={(e) => setPayment({...payment, reference: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Número de transacción"
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                disabled={payment.method === 'cash' && (payment.cashReceived || 0) < getTotalPrice()}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && completedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Venta Completada</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={printTicket}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir</span>
                  </button>
                  {completedSale.customer?.email && (
                    <button
                      onClick={sendEmailInvoice}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Enviar Email</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Ticket Content */}
            <div className="p-6" id="ticket-content">
              <div className="text-center mb-6">
                <img
                  src={tenantSettings?.logo}
                  alt="Logo"
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <h2 className="text-xl font-bold">{tenantSettings?.storeName}</h2>
                <p className="text-sm text-gray-600">{tenantSettings?.address}</p>
                <p className="text-sm text-gray-600">{tenantSettings?.phone}</p>
              </div>
              
              <div className="border-t border-b border-gray-300 py-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Ticket: {completedSale.number}</span>
                  <span>{new Date(completedSale.date).toLocaleString()}</span>
                </div>
                <div className="text-sm">
                  <span>Cajero: {completedSale.cashier}</span>
                </div>
                {completedSale.customer && (
                  <div className="text-sm mt-2">
                    <p>Cliente: {completedSale.customer.name}</p>
                    <p>Documento: {completedSale.customer.document}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                {completedSale.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${completedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (19%):</span>
                  <span>${completedSale.taxes[0]?.amount.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL:</span>
                  <span>${completedSale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pago ({completedSale.payment.method}):</span>
                  <span>${completedSale.payment.amount.toFixed(2)}</span>
                </div>
                {completedSale.payment.change && completedSale.payment.change > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Cambio:</span>
                    <span>${completedSale.payment.change.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {completedSale.electronicInvoice && (
                <div className="mt-6 text-center border-t border-gray-300 pt-4">
                  <p className="text-sm font-medium mb-2">Factura Electrónica</p>
                  <p className="text-xs text-gray-600 mb-2">CUFE: {completedSale.electronicInvoice.cufe}</p>
                  <img
                    src={completedSale.electronicInvoice.qrCode}
                    alt="QR Code"
                    className="w-20 h-20 mx-auto"
                  />
                </div>
              )}
              
              <div className="text-center mt-6 text-xs text-gray-500">
                <p>¡Gracias por su compra!</p>
                <p>Software ERP - Sistema de Gestión</p>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={finalizeSale}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}