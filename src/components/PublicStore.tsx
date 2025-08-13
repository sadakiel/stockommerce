import React, { useState } from 'react';
import { ShoppingCart, Plus, Search, Filter, Grid, List, ChevronLeft, ChevronRight, Star, Tag } from 'lucide-react';
import { Product, Sale, Tenant } from '../App';
import { Campaign, BannerSettings, ProductHighlight } from '../types/campaigns';
import { useTranslation } from '../hooks/useTranslation';

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
  const { t, language, changeLanguage } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

  const filteredProducts = activeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent_offers':
        const aHighlight = getProductHighlight(a.id);
        const bHighlight = getProductHighlight(b.id);
        if (aHighlight && !bHighlight) return -1;
        if (!aHighlight && bHighlight) return 1;
        return 0;
      case 'oldest_offers':
        const aHighlightOld = getProductHighlight(a.id);
        const bHighlightOld = getProductHighlight(b.id);
        if (aHighlightOld && !bHighlightOld) return 1;
        if (!aHighlightOld && bHighlightOld) return -1;
        return 0;
      case 'price_high_low':
        return getDiscountedPrice(b) - getDiscountedPrice(a);
      case 'price_low_high':
        return getDiscountedPrice(a) - getDiscountedPrice(b);
      default:
        return 0;
    }
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
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (getDiscountedPrice(item.product) * item.quantity), 0);

  const handlePurchase = () => {
    if (cart.length === 0 || !customerInfo.name || !customerInfo.email) return;

    const sale: Omit<Sale, 'id' | 'tenantId'> = {
      products: cart.map(item => ({ product: item.product, quantity: item.quantity })),
      total: getTotalPrice(),
      date: new Date().toISOString(),
      type: 'online',
      customer: customerInfo.name
    };

    onPurchase(sale);
    setCart([]);
    setShowCart(false);
    setCustomerInfo({ name: '', email: '', address: '' });
    alert(t('orderCreatedSuccessfully') || '¡Compra realizada exitosamente!');
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`;
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
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as 'es' | 'en')}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
              </select>
              <button
                onClick={() => setShowCart(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{t('cart')} ({getTotalItems()})</span>
              </button>
              <button
                onClick={onShowLogin}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </header>

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
          
          {/* Navigation */}
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

      {/* Default Hero */}
      {(!bannerSettings.showBanner || activeCampaigns.length === 0) && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              {t('welcomeMessage')} {tenant.settings.storeName}
            </h2>
            <p className="text-xl opacity-90 mb-8">{t('bestProducts')}</p>
          </div>
        </div>
      )}

      {/* Categories Section - Grainger Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('allCategories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`p-4 rounded-lg border-2 transition-colors text-center ${
              selectedCategory === '' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Grid className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-sm font-medium">{t('allCategories')}</p>
            <p className="text-xs text-gray-500">{activeProducts.length} {language === 'es' ? 'productos' : 'products'}</p>
          </button>
          {categories.map(category => {
            const categoryProducts = activeProducts.filter(p => p.category === category);
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-lg border-2 transition-colors text-center ${
                  selectedCategory === category 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Tag className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">{category}</p>
                <p className="text-xs text-gray-500">{categoryProducts.length} {language === 'es' ? 'productos' : 'products'}</p>
              </button>
            );
          })}
        </div>

        {/* Highlighted Products */}
        {highlightedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'es' ? 'Productos Destacados' : 'Featured Products'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {highlightedProducts.slice(0, 4).map((product) => {
                const highlight = getProductHighlight(product.id);
                const discountedPrice = getDiscountedPrice(product);
                const hasDiscount = discountedPrice < product.price;
                
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 mb-1 text-sm line-clamp-2">
                        {highlight?.title || product.name}
                      </h3>
                      <div className="mb-2">
                        {hasDiscount ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-red-600">
                              {formatPrice(discountedPrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('addToCart')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'es' ? 'Buscar productos...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{language === 'es' ? 'Ordenar por' : 'Sort by'}</option>
                <option value="recent_offers">{t('recentOffers')}</option>
                <option value="oldest_offers">{t('oldestOffers')}</option>
                <option value="price_high_low">{t('priceHighToLow')}</option>
                <option value="price_low_high">{t('priceLowToHigh')}</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - Grainger Style */}
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => {
            const highlight = getProductHighlight(product.id);
            const discountedPrice = getDiscountedPrice(product);
            const hasDiscount = discountedPrice < product.price;
            
            if (viewMode === 'list') {
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      {highlight && (
                        <span 
                          className="absolute -top-1 -right-1 px-1 py-0.5 text-xs font-bold text-white rounded-full"
                          style={{ backgroundColor: highlight.badgeColor }}
                        >
                          {highlight.badgeText}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {hasDiscount ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-red-600">
                                {formatPrice(discountedPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{t('addToCart')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {highlight && (
                    <div className="absolute top-1 left-1">
                      <span 
                        className="px-1 py-0.5 text-xs font-bold text-white rounded-full"
                        style={{ backgroundColor: highlight.badgeColor }}
                      >
                        {highlight.badgeText}
                      </span>
                    </div>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-bold">
                      -{Math.round(((product.price - discountedPrice) / product.price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 mb-1 text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mb-2">
                    {hasDiscount ? (
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {product.stock} {language === 'es' ? 'disponibles' : 'available'}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t('addToCart')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'es' ? 'No se encontraron productos' : 'No products found'}
            </p>
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
              <h4 className="font-semibold mb-4">
                {language === 'es' ? 'Contacto' : 'Contact'}
              </h4>
              <p className="text-gray-400 mb-2">Email: {tenant.settings.email}</p>
              <p className="text-gray-400">
                {language === 'es' ? 'Teléfono' : 'Phone'}: {tenant.settings.phone}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">
                {language === 'es' ? 'Información' : 'Information'}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>{language === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions'}</li>
                <li>{language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}</li>
                <li>{language === 'es' ? 'Política de Devoluciones' : 'Return Policy'}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {tenant.settings.storeName}. {language === 'es' ? 'Todos los derechos reservados' : 'All rights reserved'}.</p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">{t('cart')}</h3>
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
                        <p className="text-gray-600">{formatPrice(getDiscountedPrice(item.product))} c/u</p>
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
                        <p className="font-semibold">{formatPrice(getDiscountedPrice(item.product) * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>{t('total')}:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold">
                    {language === 'es' ? 'Información del Cliente' : 'Customer Information'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
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
                    placeholder={language === 'es' ? 'Dirección de entrega' : 'Delivery address'}
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
                    {language === 'es' ? 'Vaciar Carrito' : 'Clear Cart'}
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={!customerInfo.name || !customerInfo.email}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('checkout')}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {language === 'es' ? 'El carrito está vacío' : 'Cart is empty'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}