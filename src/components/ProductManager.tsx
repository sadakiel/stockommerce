import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Trash2, Save, X, Upload, Image as ImageIcon, Tag, Globe, Share2, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { EnhancedProduct, TaxType, ProductImage, ProductVariant, TechnicalSpec, ProductVideo } from '../types/product';
import { ProductDetailsModal } from './ProductDetailsModal';

interface ProductManagerProps {
  products: EnhancedProduct[];
  taxes: TaxType[];
  currency: string;
  onAddProduct: (product: Omit<EnhancedProduct, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => void;
  onUpdateProduct: (id: string, updates: Partial<EnhancedProduct>) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function ProductManager({ products, taxes, currency, onAddProduct, onUpdateProduct, onUploadImage }: ProductManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EnhancedProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<EnhancedProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'images' | 'specs' | 'videos' | 'google' | 'social' | 'seo'>('basic');

  const [productForm, setProductForm] = useState<Partial<EnhancedProduct>>({
    name: '',
    description: '',
    longDescription: '',
    basePrice: 0,
    baseCost: 0,
    category: '',
    baseSku: '',
    images: [],
    variants: [{
      id: '1',
      name: '',
      sku: '',
      price: 0,
      cost: 0,
      stock: 0,
      attributes: {},
      active: true
    }],
    taxes: [],
    technicalSpecs: [],
    videos: [],
    socialMedia: {
      facebook: { enabled: false, postTemplate: '', hashtags: [] },
      instagram: { enabled: false, postTemplate: '', hashtags: [] },
      twitter: { enabled: false, postTemplate: '', hashtags: [] }
    },
    googleMerchant: {
      enabled: false,
      productType: '',
      googleProductCategory: '',
      brand: '',
      condition: 'new',
      availability: 'in_stock',
      customLabels: []
    },
    seoData: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      slug: ''
    },
    unidadMedida: 'UND',
    active: true
  });

  const categories = [...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.baseSku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productForm);
    } else {
      onAddProduct(productForm as Omit<EnhancedProduct, 'id' | 'tenantId' | 'created_at' | 'updated_at'>);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      longDescription: '',
      basePrice: 0,
      baseCost: 0,
      category: '',
      baseSku: '',
      images: [],
      variants: [{
        id: '1',
        name: '',
        sku: '',
        price: 0,
        cost: 0,
        stock: 0,
        attributes: {},
        active: true
      }],
      taxes: [],
      technicalSpecs: [],
      videos: [],
      socialMedia: {
        facebook: { enabled: false, postTemplate: '', hashtags: [] },
        instagram: { enabled: false, postTemplate: '', hashtags: [] },
        twitter: { enabled: false, postTemplate: '', hashtags: [] }
      },
      googleMerchant: {
        enabled: false,
        productType: '',
        googleProductCategory: '',
        brand: '',
        condition: 'new',
        availability: 'in_stock',
        customLabels: []
      },
      seoData: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        slug: ''
      },
      unidadMedida: 'UND',
      active: true
    });
    setEditingProduct(null);
    setShowModal(false);
    setActiveTab('basic');
  };

  const openEditModal = (product: EnhancedProduct) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowModal(true);
  };

  const addImage = async (file: File) => {
    const url = await onUploadImage(file);
    const newImage: ProductImage = {
      id: Date.now().toString(),
      url,
      alt: productForm.name || 'Product image',
      isPrimary: (productForm.images?.length || 0) === 0,
      order: productForm.images?.length || 0
    };
    setProductForm(prev => ({
      ...prev,
      images: [...(prev.images || []), newImage]
    }));
  };

  const removeImage = (imageId: string) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images?.filter(img => img.id !== imageId) || []
    }));
  };

  const addTechnicalSpec = () => {
    const newSpec: TechnicalSpec = {
      id: Date.now().toString(),
      name: '',
      value: '',
      unit: '',
      category: 'general',
      order: (productForm.technicalSpecs?.length || 0) + 1
    };
    setProductForm(prev => ({
      ...prev,
      technicalSpecs: [...(prev.technicalSpecs || []), newSpec]
    }));
  };

  const updateTechnicalSpec = (specId: string, updates: Partial<TechnicalSpec>) => {
    setProductForm(prev => ({
      ...prev,
      technicalSpecs: prev.technicalSpecs?.map(spec =>
        spec.id === specId ? { ...spec, ...updates } : spec
      ) || []
    }));
  };

  const removeTechnicalSpec = (specId: string) => {
    setProductForm(prev => ({
      ...prev,
      technicalSpecs: prev.technicalSpecs?.filter(spec => spec.id !== specId) || []
    }));
  };

  const addVideo = () => {
    const newVideo: ProductVideo = {
      id: Date.now().toString(),
      title: '',
      url: '',
      type: 'youtube',
      description: '',
      order: (productForm.videos?.length || 0) + 1
    };
    setProductForm(prev => ({
      ...prev,
      videos: [...(prev.videos || []), newVideo]
    }));
  };

  const updateVideo = (videoId: string, updates: Partial<ProductVideo>) => {
    setProductForm(prev => ({
      ...prev,
      videos: prev.videos?.map(video =>
        video.id === videoId ? { ...video, ...updates } : video
      ) || []
    }));
  };

  const removeVideo = (videoId: string) => {
    setProductForm(prev => ({
      ...prev,
      videos: prev.videos?.filter(video => video.id !== videoId) || []
    }));
  };

  const addHashtag = (platform: 'facebook' | 'instagram' | 'twitter', hashtag: string) => {
    if (!hashtag.trim()) return;
    
    setProductForm(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: {
          ...prev.socialMedia?.[platform],
          hashtags: [...(prev.socialMedia?.[platform]?.hashtags || []), hashtag.replace('#', '')]
        }
      }
    }));
  };

  const removeHashtag = (platform: 'facebook' | 'instagram' | 'twitter', index: number) => {
    setProductForm(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: {
          ...prev.socialMedia?.[platform],
          hashtags: prev.socialMedia?.[platform]?.hashtags?.filter((_, i) => i !== index) || []
        }
      }
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setProductForm(prev => ({
      ...prev,
      name,
      seoData: {
        ...prev.seoData,
        slug: generateSlug(name)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">Administra tu catálogo de productos con funciones avanzadas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
          const mainVariant = product.variants[0];
          
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <img
                  src={primaryImage?.url || 'https://images.pexels.com/photos/4464207/pexels-photo-4464207.jpeg?auto=compress&cs=tinysrgb&w=300'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {product.googleMerchant?.enabled && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Google
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">SKU:</span>
                    <span className="font-medium">{product.baseSku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Precio:</span>
                    <span className="font-medium">${product.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stock:</span>
                    <span className={`font-medium ${mainVariant?.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {mainVariant?.stock || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Variantes:</span>
                    <span className="font-medium">{product.variants.length}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewingProduct(product)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex px-6 overflow-x-auto">
                {[
                  { id: 'basic', label: 'Información Básica', icon: Tag },
                  { id: 'variants', label: 'Variantes', icon: Package },
                  { id: 'images', label: 'Imágenes', icon: ImageIcon },
                  { id: 'specs', label: 'Especificaciones', icon: FileText },
                  { id: 'videos', label: 'Videos', icon: Play },
                  { id: 'google', label: 'Google Shopping', icon: Globe },
                  { id: 'social', label: 'Redes Sociales', icon: Share2 },
                  { id: 'seo', label: 'SEO', icon: Search }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
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

            <form onSubmit={handleSubmit} className="flex flex-col h-[calc(95vh-200px)]">
              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Producto *
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.name || ''}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU Base *
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.baseSku || ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, baseSku: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Corta *
                      </label>
                      <textarea
                        required
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Detallada
                      </label>
                      <textarea
                        value={productForm.longDescription || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, longDescription: e.target.value }))}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción completa del producto con características detalladas..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio Base *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={productForm.basePrice || 0}
                          onChange={(e) => setProductForm(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Costo Base *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={productForm.baseCost || 0}
                          onChange={(e) => setProductForm(prev => ({ ...prev, baseCost: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.category || ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unidad de Medida
                        </label>
                        <select
                          value={productForm.unidadMedida || 'UND'}
                          onChange={(e) => setProductForm(prev => ({ ...prev, unidadMedida: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="UND">Unidad</option>
                          <option value="KG">Kilogramo</option>
                          <option value="LT">Litro</option>
                          <option value="MT">Metro</option>
                          <option value="M2">Metro Cuadrado</option>
                          <option value="M3">Metro Cúbico</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Impuestos
                        </label>
                        <select
                          multiple
                          value={productForm.taxes || []}
                          onChange={(e) => {
                            const selectedTaxes = Array.from(e.target.selectedOptions, option => option.value);
                            setProductForm(prev => ({ ...prev, taxes: selectedTaxes }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {taxes.map(tax => (
                            <option key={tax.id} value={tax.id}>
                              {tax.name} ({tax.rate}%)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Google Shopping Tab */}
                {activeTab === 'google' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Google Shopping</h3>
                        <p className="text-gray-600">Configura tu producto para Google Merchant Center</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="google-enabled"
                        checked={productForm.googleMerchant?.enabled || false}
                        onChange={(e) => setProductForm(prev => ({
                          ...prev,
                          googleMerchant: {
                            ...prev.googleMerchant,
                            enabled: e.target.checked
                          }
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="google-enabled" className="ml-2 text-sm font-medium text-gray-700">
                        Habilitar para Google Shopping
                      </label>
                    </div>

                    {productForm.googleMerchant?.enabled && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Marca *
                            </label>
                            <input
                              type="text"
                              value={productForm.googleMerchant?.brand || ''}
                              onChange={(e) => setProductForm(prev => ({
                                ...prev,
                                googleMerchant: {
                                  ...prev.googleMerchant,
                                  brand: e.target.value
                                }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Apple, Samsung, Nike..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Condición
                            </label>
                            <select
                              value={productForm.googleMerchant?.condition || 'new'}
                              onChange={(e) => setProductForm(prev => ({
                                ...prev,
                                googleMerchant: {
                                  ...prev.googleMerchant,
                                  condition: e.target.value as any
                                }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="new">Nuevo</option>
                              <option value="used">Usado</option>
                              <option value="refurbished">Reacondicionado</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Producto
                          </label>
                          <input
                            type="text"
                            value={productForm.googleMerchant?.productType || ''}
                            onChange={(e) => setProductForm(prev => ({
                              ...prev,
                              googleMerchant: {
                                ...prev.googleMerchant,
                                productType: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Electronics > Computers > Laptops"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría de Google
                          </label>
                          <input
                            type="text"
                            value={productForm.googleMerchant?.googleProductCategory || ''}
                            onChange={(e) => setProductForm(prev => ({
                              ...prev,
                              googleMerchant: {
                                ...prev.googleMerchant,
                                googleProductCategory: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Electronics > Computer Accessories"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              MPN (Número de Parte)
                            </label>
                            <input
                              type="text"
                              value={productForm.googleMerchant?.mpn || ''}
                              onChange={(e) => setProductForm(prev => ({
                                ...prev,
                                googleMerchant: {
                                  ...prev.googleMerchant,
                                  mpn: e.target.value
                                }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              GTIN/UPC/EAN
                            </label>
                            <input
                              type="text"
                              value={productForm.googleMerchant?.gtin || ''}
                              onChange={(e) => setProductForm(prev => ({
                                ...prev,
                                googleMerchant: {
                                  ...prev.googleMerchant,
                                  gtin: e.target.value
                                }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Etiquetas Personalizadas
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {productForm.googleMerchant?.customLabels?.map((label, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                                <span>{label}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newLabels = productForm.googleMerchant?.customLabels?.filter((_, i) => i !== index) || [];
                                    setProductForm(prev => ({
                                      ...prev,
                                      googleMerchant: {
                                        ...prev.googleMerchant,
                                        customLabels: newLabels
                                      }
                                    }));
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Agregar etiqueta y presionar Enter"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.currentTarget.value.trim();
                                if (value) {
                                  const currentLabels = productForm.googleMerchant?.customLabels || [];
                                  setProductForm(prev => ({
                                    ...prev,
                                    googleMerchant: {
                                      ...prev.googleMerchant,
                                      customLabels: [...currentLabels, value]
                                    }
                                  }));
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Media Tab */}
                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Share2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Redes Sociales</h3>
                        <p className="text-gray-600">Configura plantillas para compartir en redes sociales</p>
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Facebook className="w-6 h-6 text-blue-600" />
                        <h4 className="font-medium text-gray-900">Facebook</h4>
                        <input
                          type="checkbox"
                          checked={productForm.socialMedia?.facebook?.enabled || false}
                          onChange={(e) => setProductForm(prev => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              facebook: {
                                ...prev.socialMedia?.facebook,
                                enabled: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      
                      {productForm.socialMedia?.facebook?.enabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plantilla de Publicación
                            </label>
                            <textarea
                              value={productForm.socialMedia?.facebook?.postTemplate || ''}
                              onChange={(e) => setProductForm(prev => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  facebook: {
                                    ...prev.socialMedia?.facebook,
                                    postTemplate: e.target.value
                                  }
                                }
                              }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="🔥 ¡Nuevo producto disponible! Descripción del producto..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hashtags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {productForm.socialMedia?.facebook?.hashtags?.map((hashtag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                                  <span>#{hashtag}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeHashtag('facebook', index)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Agregar hashtag y presionar Enter"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addHashtag('facebook', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Instagram */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Instagram className="w-6 h-6 text-pink-600" />
                        <h4 className="font-medium text-gray-900">Instagram</h4>
                        <input
                          type="checkbox"
                          checked={productForm.socialMedia?.instagram?.enabled || false}
                          onChange={(e) => setProductForm(prev => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              instagram: {
                                ...prev.socialMedia?.instagram,
                                enabled: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      
                      {productForm.socialMedia?.instagram?.enabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plantilla de Publicación
                            </label>
                            <textarea
                              value={productForm.socialMedia?.instagram?.postTemplate || ''}
                              onChange={(e) => setProductForm(prev => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  instagram: {
                                    ...prev.socialMedia?.instagram,
                                    postTemplate: e.target.value
                                  }
                                }
                              }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="💻 Nuevo producto disponible ✨ #tech #productos"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hashtags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {productForm.socialMedia?.instagram?.hashtags?.map((hashtag, index) => (
                                <span key={index} className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-sm flex items-center space-x-1">
                                  <span>#{hashtag}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeHashtag('instagram', index)}
                                    className="text-pink-600 hover:text-pink-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Agregar hashtag y presionar Enter"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addHashtag('instagram', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Twitter */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Twitter className="w-6 h-6 text-blue-400" />
                        <h4 className="font-medium text-gray-900">Twitter</h4>
                        <input
                          type="checkbox"
                          checked={productForm.socialMedia?.twitter?.enabled || false}
                          onChange={(e) => setProductForm(prev => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              twitter: {
                                ...prev.socialMedia?.twitter,
                                enabled: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      
                      {productForm.socialMedia?.twitter?.enabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plantilla de Tweet
                              <span className="text-xs text-gray-500 ml-2">
                                ({(productForm.socialMedia?.twitter?.postTemplate || '').length}/280)
                              </span>
                            </label>
                            <textarea
                              value={productForm.socialMedia?.twitter?.postTemplate || ''}
                              onChange={(e) => setProductForm(prev => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  twitter: {
                                    ...prev.socialMedia?.twitter,
                                    postTemplate: e.target.value
                                  }
                                }
                              }))}
                              maxLength={280}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="🚀 Nuevo producto disponible. Características increíbles a precio increíble."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hashtags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {productForm.socialMedia?.twitter?.hashtags?.map((hashtag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                                  <span>#{hashtag}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeHashtag('twitter', index)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Agregar hashtag y presionar Enter"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addHashtag('twitter', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                        <h4 className="font-medium text-gray-900">WhatsApp</h4>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mensaje para WhatsApp
                        </label>
                        <textarea
                          value={`¡Hola! 👋 Te comparto este increíble producto:\n\n*${productForm.name || 'Nombre del producto'}*\n${productForm.description || 'Descripción del producto'}\n\n💰 Precio: $${productForm.basePrice || 0}\n📦 Disponible ahora\n\n¿Te interesa? ¡Escríbeme!`}
                          readOnly
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Esta plantilla se genera automáticamente con la información del producto
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Search className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Optimización SEO</h3>
                        <p className="text-gray-600">Mejora la visibilidad en motores de búsqueda</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Título
                        <span className="text-xs text-gray-500 ml-2">
                          ({(productForm.seoData?.metaTitle || '').length}/60)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={productForm.seoData?.metaTitle || ''}
                        onChange={(e) => setProductForm(prev => ({
                          ...prev,
                          seoData: {
                            ...prev.seoData,
                            metaTitle: e.target.value
                          }
                        }))}
                        maxLength={60}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Título optimizado para SEO (máximo 60 caracteres)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Descripción
                        <span className="text-xs text-gray-500 ml-2">
                          ({(productForm.seoData?.metaDescription || '').length}/160)
                        </span>
                      </label>
                      <textarea
                        value={productForm.seoData?.metaDescription || ''}
                        onChange={(e) => setProductForm(prev => ({
                          ...prev,
                          seoData: {
                            ...prev.seoData,
                            metaDescription: e.target.value
                          }
                        }))}
                        maxLength={160}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción que aparecerá en los resultados de búsqueda (máximo 160 caracteres)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Palabras Clave
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {productForm.seoData?.keywords?.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center space-x-1">
                            <span>{keyword}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newKeywords = productForm.seoData?.keywords?.filter((_, i) => i !== index) || [];
                                setProductForm(prev => ({
                                  ...prev,
                                  seoData: {
                                    ...prev.seoData,
                                    keywords: newKeywords
                                  }
                                }));
                              }}
                              className="text-green-600 hover:text-green-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Agregar palabra clave y presionar Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value) {
                              const currentKeywords = productForm.seoData?.keywords || [];
                              setProductForm(prev => ({
                                ...prev,
                                seoData: {
                                  ...prev.seoData,
                                  keywords: [...currentKeywords, value]
                                }
                              }));
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">https://tu-tienda.com/producto/</span>
                        <input
                          type="text"
                          value={productForm.seoData?.slug || ''}
                          onChange={(e) => setProductForm(prev => ({
                            ...prev,
                            seoData: {
                              ...prev.seoData,
                              slug: e.target.value
                            }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="url-amigable-del-producto"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Imágenes del Producto</h3>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            Array.from(e.target.files || []).forEach(addImage);
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Subir Imágenes</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productForm.images?.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm(prev => ({
                                  ...prev,
                                  images: prev.images?.map(img => ({
                                    ...img,
                                    isPrimary: img.id === image.id
                                  })) || []
                                }));
                              }}
                              className={`px-2 py-1 text-xs rounded ${
                                image.isPrimary 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-white text-gray-800 hover:bg-gray-100'
                              }`}
                            >
                              {image.isPrimary ? 'Principal' : 'Hacer Principal'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specs Tab */}
                {activeTab === 'specs' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Especificaciones Técnicas</h3>
                      <button
                        type="button"
                        onClick={addTechnicalSpec}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Especificación</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {productForm.technicalSpecs?.map((spec) => (
                        <div key={spec.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Nombre</label>
                            <input
                              type="text"
                              value={spec.name}
                              onChange={(e) => updateTechnicalSpec(spec.id, { name: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Procesador"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Valor</label>
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => updateTechnicalSpec(spec.id, { value: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Intel i5"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Unidad</label>
                            <input
                              type="text"
                              value={spec.unit || ''}
                              onChange={(e) => updateTechnicalSpec(spec.id, { unit: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="GHz"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Categoría</label>
                            <select
                              value={spec.category}
                              onChange={(e) => updateTechnicalSpec(spec.id, { category: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="general">General</option>
                              <option value="rendimiento">Rendimiento</option>
                              <option value="conectividad">Conectividad</option>
                              <option value="diseño">Diseño</option>
                              <option value="almacenamiento">Almacenamiento</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeTechnicalSpec(spec.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === 'videos' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Videos del Producto</h3>
                      <button
                        type="button"
                        onClick={addVideo}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Video</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {productForm.videos?.map((video) => (
                        <div key={video.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Título</label>
                              <input
                                type="text"
                                value={video.title}
                                onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Título del video"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                              <select
                                value={video.type}
                                onChange={(e) => updateVideo(video.id, { type: e.target.value as any })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="youtube">YouTube</option>
                                <option value="vimeo">Vimeo</option>
                                <option value="direct">Enlace Directo</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">URL del Video</label>
                            <input
                              type="url"
                              value={video.url}
                              onChange={(e) => updateVideo(video.id, { url: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">Descripción</label>
                            <textarea
                              value={video.description || ''}
                              onChange={(e) => updateVideo(video.id, { description: e.target.value })}
                              rows={2}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Descripción del video"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeVideo(video.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Variantes del Producto</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const newVariant: ProductVariant = {
                            id: Date.now().toString(),
                            name: productForm.name || '',
                            sku: productForm.baseSku || '',
                            price: productForm.basePrice || 0,
                            cost: productForm.baseCost || 0,
                            stock: 0,
                            attributes: {},
                            active: true
                          };
                          setProductForm(prev => ({
                            ...prev,
                            variants: [...(prev.variants || []), newVariant]
                          }));
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Variante</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {productForm.variants?.map((variant, index) => (
                        <div key={variant.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nombre de Variante</label>
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => {
                                  const newVariants = [...(productForm.variants || [])];
                                  newVariants[index] = { ...variant, name: e.target.value };
                                  setProductForm(prev => ({ ...prev, variants: newVariants }));
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">SKU</label>
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => {
                                  const newVariants = [...(productForm.variants || [])];
                                  newVariants[index] = { ...variant, sku: e.target.value };
                                  setProductForm(prev => ({ ...prev, variants: newVariants }));
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Stock</label>
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => {
                                  const newVariants = [...(productForm.variants || [])];
                                  newVariants[index] = { ...variant, stock: parseInt(e.target.value) || 0 };
                                  setProductForm(prev => ({ ...prev, variants: newVariants }));
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Precio</label>
                              <input
                                type="number"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) => {
                                  const newVariants = [...(productForm.variants || [])];
                                  newVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 };
                                  setProductForm(prev => ({ ...prev, variants: newVariants }));
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Costo</label>
                              <input
                                type="number"
                                step="0.01"
                                value={variant.cost}
                                onChange={(e) => {
                                  const newVariants = [...(productForm.variants || [])];
                                  newVariants[index] = { ...variant, cost: parseFloat(e.target.value) || 0 };
                                  setProductForm(prev => ({ ...prev, variants: newVariants }));
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Actualizar' : 'Crear'} Producto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onAddToCart={() => {}}
          currency={currency}
        />
      )}
    </div>
  );
}