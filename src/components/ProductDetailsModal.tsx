import React, { useState } from 'react';
import { X, Star, ShoppingCart, Plus, Minus, Share2, Facebook, Instagram, Twitter, Youtube, Play, FileText, Package, Truck, Shield, Eye, ExternalLink, Copy, Check } from 'lucide-react';
import { EnhancedProduct, TechnicalSpec, ProductVideo } from '../types/product';

interface ProductDetailsModalProps {
  product: EnhancedProduct;
  onClose: () => void;
  onAddToCart: (product: any) => void;
  currency: string;
  getDiscountedPrice?: (product: any) => number;
  getProductHighlight?: (productId: string) => any;
}

export function ProductDetailsModal({ 
  product, 
  onClose, 
  onAddToCart, 
  currency,
  getDiscountedPrice,
  getProductHighlight 
}: ProductDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'videos' | 'social'>('overview');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '$';
  const highlight = getProductHighlight?.(product.id);
  const discountedPrice = getDiscountedPrice?.(product) || selectedVariant.price;
  const hasDiscount = discountedPrice < selectedVariant.price;

  const handleAddToCart = () => {
    // Convert to legacy format for compatibility
    const legacyProduct = {
      ...product,
      price: selectedVariant.price,
      cost: selectedVariant.cost,
      stock: selectedVariant.stock,
      sku: selectedVariant.sku,
      image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || ''
    };
    
    for (let i = 0; i < quantity; i++) {
      onAddToCart(legacyProduct);
    }
    
    alert(`${quantity} ${product.name} agregado al carrito`);
  };

  const shareProduct = async (platform: string) => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const text = product.socialMedia?.[platform as keyof typeof product.socialMedia]?.postTemplate || 
                 `¡Mira este increíble producto! ${product.name} - ${currencySymbol}${discountedPrice.toFixed(2)}`;
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`,
      instagram: productUrl, // Instagram doesn't support direct sharing, just copy link
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + productUrl)}`
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(productUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error('Failed to copy link');
      }
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const groupedSpecs = product.technicalSpecs?.reduce((acc, spec) => {
    if (!acc[spec.category]) {
      acc[spec.category] = [];
    }
    acc[spec.category].push(spec);
    return acc;
  }, {} as Record<string, TechnicalSpec[]>) || {};

  const getVideoThumbnail = (video: ProductVideo) => {
    if (video.thumbnail) return video.thumbnail;
    if (video.type === 'youtube') {
      const videoId = video.url.split('v=')[1]?.split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=300';
  };

  const openVideo = (video: ProductVideo) => {
    window.open(video.url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => shareProduct('facebook')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => shareProduct('twitter')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => shareProduct('whatsapp')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <span className="w-4 h-4 text-green-600">📱</span>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => shareProduct('copy')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                    <span>{copiedLink ? 'Copiado!' : 'Copiar enlace'}</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(95vh-80px)]">
          {/* Left Side - Images */}
          <div className="lg:w-1/2 p-6">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={product.images[selectedImage]?.url || product.images[0]?.url || ''}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {highlight && (
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-3 py-1 text-sm font-bold text-white rounded-full"
                      style={{ backgroundColor: highlight.badgeColor }}
                    >
                      {highlight.badgeText}
                    </span>
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{Math.round(((selectedVariant.price - discountedPrice) / selectedVariant.price) * 100)}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Product Info */}
            <div className="p-6 border-b">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  {hasDiscount ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-red-600">
                        {currencySymbol}{discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {currencySymbol}{selectedVariant.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {currencySymbol}{selectedVariant.price.toFixed(2)}
                    </span>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>SKU: {selectedVariant.sku}</span>
                    <span>Stock: {selectedVariant.stock} disponibles</span>
                  </div>
                </div>

                {/* Variant Selection */}
                {product.variants.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variante:
                    </label>
                    <select
                      value={selectedVariant.id}
                      onChange={(e) => {
                        const variant = product.variants.find(v => v.id === e.target.value);
                        if (variant) setSelectedVariant(variant);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {product.variants.map(variant => (
                        <option key={variant.id} value={variant.id}>
                          {variant.name} - {currencySymbol}{variant.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad:
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stock === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Agregar al Carrito</span>
                </button>

                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Envío gratis</p>
                    <p className="text-xs text-gray-500">Pedidos +$100</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Garantía</p>
                    <p className="text-xs text-gray-500">12 meses</p>
                  </div>
                  <div className="text-center">
                    <Package className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Devolución</p>
                    <p className="text-xs text-gray-500">30 días</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex px-6">
                {[
                  { id: 'overview', label: 'Descripción', icon: FileText },
                  { id: 'specs', label: 'Especificaciones', icon: Package },
                  { id: 'videos', label: 'Videos', icon: Play },
                  { id: 'social', label: 'Compartir', icon: Share2 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Descripción Detallada</h4>
                    <div className="prose max-w-none text-gray-700">
                      {product.longDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                      ) : (
                        <p>{product.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Características Principales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.technicalSpecs?.slice(0, 6).map(spec => (
                        <div key={spec.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">{spec.name}:</span>
                          <span className="font-medium">{spec.value} {spec.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Google Merchant Info */}
                  {product.googleMerchant?.enabled && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Información del Producto</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Marca:</span>
                          <span className="font-medium">{product.googleMerchant.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Condición:</span>
                          <span className="font-medium capitalize">{product.googleMerchant.condition}</span>
                        </div>
                        {product.googleMerchant.color && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Color:</span>
                            <span className="font-medium">{product.googleMerchant.color}</span>
                          </div>
                        )}
                        {product.googleMerchant.material && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Material:</span>
                            <span className="font-medium">{product.googleMerchant.material}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-6">
                  {Object.entries(groupedSpecs).map(([category, specs]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-gray-900 mb-3 capitalize">{category}</h4>
                      <div className="space-y-2">
                        {specs.sort((a, b) => a.order - b.order).map(spec => (
                          <div key={spec.id} className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{spec.name}</span>
                            <span className="font-medium text-gray-900">
                              {spec.value} {spec.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(groupedSpecs).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay especificaciones técnicas disponibles</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="space-y-6">
                  {product.videos && product.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.videos.sort((a, b) => a.order - b.order).map(video => (
                        <div key={video.id} className="bg-gray-50 rounded-lg overflow-hidden">
                          <div className="relative">
                            <img
                              src={getVideoThumbnail(video)}
                              alt={video.title}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              onClick={() => openVideo(video)}
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-60 transition-colors"
                            >
                              <div className="bg-white bg-opacity-90 rounded-full p-3">
                                <Play className="w-6 h-6 text-gray-800" />
                              </div>
                            </button>
                            {video.duration && (
                              <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                                {video.duration}
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <h5 className="font-medium text-gray-900 mb-1">{video.title}</h5>
                            {video.description && (
                              <p className="text-sm text-gray-600">{video.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              {video.type === 'youtube' && <Youtube className="w-4 h-4 text-red-600" />}
                              <span className="text-xs text-gray-500 capitalize">{video.type}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay videos disponibles para este producto</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Compartir en Redes Sociales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => shareProduct('facebook')}
                        className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Facebook className="w-6 h-6 text-blue-600" />
                        <div className="text-left">
                          <p className="font-medium">Facebook</p>
                          <p className="text-sm text-gray-500">Compartir en Facebook</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => shareProduct('twitter')}
                        className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Twitter className="w-6 h-6 text-blue-400" />
                        <div className="text-left">
                          <p className="font-medium">Twitter</p>
                          <p className="text-sm text-gray-500">Compartir en Twitter</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => shareProduct('whatsapp')}
                        className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                      >
                        <span className="text-2xl">📱</span>
                        <div className="text-left">
                          <p className="font-medium">WhatsApp</p>
                          <p className="text-sm text-gray-500">Enviar por WhatsApp</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => shareProduct('copy')}
                        className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        {copiedLink ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : (
                          <Copy className="w-6 h-6 text-gray-600" />
                        )}
                        <div className="text-left">
                          <p className="font-medium">{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</p>
                          <p className="text-sm text-gray-500">Copiar URL del producto</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Social Media Templates */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Plantillas de Publicación</h4>
                    <div className="space-y-4">
                      {Object.entries(product.socialMedia || {}).map(([platform, config]) => {
                        if (!config.enabled) return null;
                        
                        const icons = {
                          facebook: Facebook,
                          instagram: Instagram,
                          twitter: Twitter
                        };
                        
                        const Icon = icons[platform as keyof typeof icons];
                        
                        return (
                          <div key={platform} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className="w-5 h-5 text-blue-600" />
                              <span className="font-medium capitalize">{platform}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{config.postTemplate}</p>
                            <div className="flex flex-wrap gap-1">
                              {config.hashtags?.map((tag: string, index: number) => (
                                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}