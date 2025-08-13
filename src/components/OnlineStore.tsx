import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, Filter } from 'lucide-react';
import { Product, Sale, Tenant } from '../App';
import { CustomerSearch } from './CustomerSearch';
import { OnlineOrder, CustomerInfo, OrderStatus } from '../types/orders';

interface OnlineStoreProps {
  products: Product[];
  tenant: Tenant;
  onPurchase: (sale: Omit<Sale, 'id' | 'tenantId'>) => void;
  onCreateOrder: (order: Omit<OnlineOrder, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => void;
  customers: CustomerInfo[];
  onCreateCustomer: (customer: CustomerInfo) => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function OnlineStore({ products, tenant, onPurchase, onCreateOrder, customers, onCreateCustomer }: OnlineStoreProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'cash_on_delivery'>('card');

  const activeProducts = products.filter(p => p.active && p.stock > 0);
  const categories = [...new Set(activeProducts.map(p => p.category))];

  const filteredProducts = activeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handlePurchase = () => {
    if (cart.length === 0 || (!selectedCustomer && (!customerInfo.name || !customerInfo.email))) return;

    const customer = selectedCustomer || {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: '',
      document: '',
      documentType: 'CC' as const,
      address: customerInfo.address,
      city: ''
    };

    // Generate ticket code
    const ticketCode = `TKT-${Date.now().toString().slice(-8)}`;

    // Create order with tracking
    const order: Omit<OnlineOrder, 'id' | 'tenantId' | 'created_at' | 'updated_at'> = {
      ticketCode,
      customer,
      products: cart,
      total: getTotalPrice(),
      currentStatus: 'pedido_realizado',
      statusHistory: [{
        id: '1',
        status: 'pedido_realizado',
        timestamp: new Date().toISOString(),
        notes: 'Pedido creado desde tienda online'
      }],
      paymentMethod,
      shippingAddress: customer.address,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    onCreateOrder(order);

    // Legacy sale for compatibility
    const sale: Omit<Sale, 'id' | 'tenantId'> = {
      products: cart,
      total: getTotalPrice(),
      date: new Date().toISOString(),
      type: 'online',
      customer: customer.name
    };

    onPurchase(sale);
    setCart([]);
    setShowCart(false);
    setCustomerInfo({ name: '', email: '', address: '' });
    setSelectedCustomer(null);
    alert(`¡Pedido creado exitosamente! Código de seguimiento: ${ticketCode}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl">
        <h1 className="text-4xl font-bold mb-2">{tenant.settings.storeName}</h1>
        <p className="text-xl opacity-90">Tu tienda online personalizada</p>
      </div>

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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Carrito ({getTotalItems()})</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">{product.stock} disponibles</span>
              </div>
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Carrito de Compras</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {cart.length > 0 ? (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-gray-600">${item.product.price.toFixed(2)} c/u</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item.product)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold">Información del Cliente</h4>
                  <CustomerSearch
                    customers={customers}
                    onSelectCustomer={setSelectedCustomer}
                    onCreateCustomer={onCreateCustomer}
                    selectedCustomer={selectedCustomer}
                    onClearCustomer={() => setSelectedCustomer(null)}
                  />
                  
                  {!selectedCustomer && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                  
                  <input
                    type="text"
                    placeholder="Dirección de entrega"
                    value={selectedCustomer?.address || customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="card">Tarjeta de Crédito/Débito</option>
                      <option value="transfer">Transferencia Bancaria</option>
                      <option value="cash_on_delivery">Pago Contra Entrega</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={!selectedCustomer && (!customerInfo.name || !customerInfo.email)}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">El carrito está vacío</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}