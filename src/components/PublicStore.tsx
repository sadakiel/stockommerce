import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, Filter, User, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Sale, Tenant } from '../App';
import { Campaign, BannerSettings, ProductHighlight } from '../types/campaigns';

interface PublicStoreProps {
  products: Product[];
  tenant: Tenant;
  campaigns: Campaign[];
  bannerSettings: BannerSettings;
  productHighlights: ProductHighlight[];
  onPurchase: (sale: Omit<Sale, 'id' | 'tenantId'>) => void;
  onShowLogin: () => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function PublicStore({ products, tenant, campaigns, bannerSettings, productHighlights, onPurchase, onShowLogin }: PublicStoreProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentCampaignIndex, setCurrentCampaignIndex] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  });

  // Auto-rotate campaigns
  React.useEffect(() => {
    if (bannerSettings.autoRotate && campaigns.length > 1) {
      const interval = setInterval(() => {
        setCurrentCampaignIndex(prev => (prev + 1) % campaigns.length);
      }, bannerSettings.rotationInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [bannerSettings.autoRotate, bannerSettings.rotationInterval, campaigns.length]);

  const activeCampaigns = campaigns.filter(c => c.active).sort((a, b) => b.priority - a.priority);
  const activeHighlights = productHighlights.filter(h => h.active);
  const highlightedProducts = products.filter(p => 
    activeHighlights.some(h => h.productId === p.id)
  );

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

  const getProductHighlight = (productId: string) => {
    return activeHighlights.find(h => h.productId === productId);
  };

  const getDiscountedPrice = (product: Product) => {
    const highlight = getProductHighlight(product.id);
    if (highlight?.specialPrice && highlight.specialPrice > 0) {
      return highlight.specialPrice;
    }
    if (highlight?.discountPercentage && highlight.discountPercentage > 0) {
      return product.price * (1 - highlight.discountPercentage / 100);
    }
    return product.price;
  };

  const handlePurchase = () => {
    if (cart.length === 0 || !customerInfo.name || !customerInfo.email) return;

    const sale: Omit<Sale, 'id' | 'tenantId'> = {
      products: cart,
      total: getTotalPrice(),
      date: new Date().toISOString(),
      type: 'online',
      customer: customerInfo.name
    };

    onPurchase(sale);
    setCart([]);
    setShowCart(false);
    setCustomerInfo({ name: '', email: '', address: '' });
    alert('¡Compra realizada exitosamente!');
  };

  const themeColors = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    purple: 'from-purple-600 to-purple-800',
    red: 'from-red-600 to-red-800'
  };

  const buttonColors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    red: 'bg-red-600 hover:bg-red-700'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src={tenant.settings.logo}
                alt={tenant.settings.storeName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {tenant.settings.storeName}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className={`${buttonColors[tenant.settings.theme]} text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Carrito ({getTotalItems()})</span>
              </button>
              <button
                onClick={onShowLogin}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {/* Campaign Banner */}
      {bannerSettings.showBanner && activeCampaigns.length > 0 && (
        <div className={`relative ${
          bannerSettings.height === 'small' ? 'h-48' : 
          bannerSettings.height === 'medium' ? 'h-64' : 'h-80'
        } overflow-hidden`}>
          {activeCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentCampaignIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${campaign.imageUrl})`,
                backgroundColor: campaign.backgroundColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center px-6" style={{ color: campaign.textColor }}>
                  <h2 className="text-4xl font-bold mb-4">{campaign.title}</h2>
                  {campaign.subtitle && (
                    <p className="text-xl opacity-90 mb-8">{campaign.subtitle}</p>
                  )}
                  {campaign.buttonText && (
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-lg">
                      {campaign.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation Arrows */}
          {bannerSettings.showArrows && activeCampaigns.length > 1 && (
            <>
              <button
                onClick={() => setCurrentCampaignIndex(prev => 
                  prev === 0 ? activeCampaigns.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => setCurrentCampaignIndex(prev => 
                  (prev + 1) % activeCampaigns.length
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}
          
          {/* Indicators */}
          {bannerSettings.showIndicators && activeCampaigns.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {activeCampaigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCampaignIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentCampaignIndex 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Default Hero if no campaigns */}
      {(!bannerSettings.showBanner || activeCampaigns.length === 0) && (
        <div className={`bg-gradient-to-r ${themeColors[tenant.settings.theme]} text-white py-16`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Bienvenido a {tenant.settings.storeName}</h2>
            <p className="text-xl opacity-90 mb-8">Encuentra los mejores productos al mejor precio</p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Envío gratis en compras mayores a $100</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Garantía de satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Highlighted Products Section */}
      {highlightedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Productos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {highlightedProducts.map((product) => {
              const highlight = getProductHighlight(product.id);
              const discountedPrice = getDiscountedPrice(product);
              const hasDiscount = discountedPrice < product.price;
              
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {highlight && (
                      <div className="absolute top-2 left-2">
                        <span 
                          className="px-2 py-1 text-xs font-bold text-white rounded-full"
                          style={{ backgroundColor: highlight.badgeColor }}
                        >
                          {highlight.badgeText}
                        </span>
                      </div>
                    )}
                    {hasDiscount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{Math.round(((product.price - discountedPrice) / product.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {highlight?.title || product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {highlight?.description || product.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        {hasDiscount ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-red-600">
                              {tenant.settings.currency === 'USD' ? '$' : tenant.settings.currency} {discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            {tenant.settings.currency === 'USD' ? '$' : tenant.settings.currency} {product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full ${buttonColors[tenant.settings.theme]} disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar al Carrito</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {getProductHighlight(product.id) && (
                  <div className="absolute top-2 left-2">
                    <span 
                      className="px-2 py-1 text-xs font-bold text-white rounded-full"
                      style={{ backgroundColor: getProductHighlight(product.id)?.badgeColor }}
                    >
                      {getProductHighlight(product.id)?.badgeText}
                    </span>
                  </div>
                )}
                {getDiscountedPrice(product) < product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{Math.round(((product.price - getDiscountedPrice(product)) / product.price) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    {getDiscountedPrice(product) < product.price ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          {tenant.settings.currency === 'USD' ? '$' : tenant.settings.currency} {getDiscountedPrice(product).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        {tenant.settings.currency === 'USD' ? '$' : tenant.settings.currency} {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {product.stock} disponibles
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full ${buttonColors[tenant.settings.theme]} disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
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
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={tenant.settings.logo}
                  alt={tenant.settings.storeName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <h3 className="text-lg font-semibold">{tenant.settings.storeName}</h3>
              </div>
              <p className="text-gray-400">{tenant.settings.address}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400 mb-2">Email: {tenant.settings.email}</p>
              <p className="text-gray-400">Teléfono: {tenant.settings.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Información</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
                <li>Política de Devoluciones</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {tenant.settings.storeName}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Carrito de Compras</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
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
                        <p className="text-gray-600">
                          {tenant.settings.currency === 'USD' ? '$' : tenant.settings.currency} {item.product.price.toFixed(2)} c/u
                        </p>
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
                        <p className="font-semibold">
                          {tenant.settings.currency === 'USD' ? '$' : tenant.settings.currency} {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span>
                      {tenant.settings.currency === 'USD' ? '$' : tenant.settings.currency} {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold">Información del Cliente</h4>
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
                  <input
                    type="text"
                    placeholder="Dirección de entrega"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                    disabled={!customerInfo.name || !customerInfo.email}
                    className={`flex-1 ${buttonColors[tenant.settings.theme]} disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors`}
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