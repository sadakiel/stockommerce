import React, { useState } from 'react';
import { Plus, Upload, X, Edit, Trash2, Save, Eye, DollarSign, Tag, Image as ImageIcon, Search } from 'lucide-react';
import { EnhancedProduct, ProductVariant, ProductImage, TaxType } from '../types/product';
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
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'images' | 'taxes' | 'google' | 'social' | 'seo'>('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    basePrice: 0,
    baseCost: 0,
    category: '',
    baseSku: '',
    images: [] as ProductImage[],
    variants: [] as ProductVariant[],
    taxes: [] as string[],
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
      mpn: '',
      gtin: '',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: 0,
      shippingDimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      ageGroup: '',
      gender: '',
      color: '',
      size: '',
      material: '',
      pattern: '',
      customLabels: []
    },
    seoData: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      slug: ''
    },
    dianProductCode: '',
    unidadMedida: 'UND',
    codigoBarras: '',
    active: true
  });

  const [newVariant, setNewVariant] = useState({
    name: '',
    sku: '',
    price: 0,
    cost: 0,
    stock: 0,
    attributes: {} as { [key: string]: string },
    active: true
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '$';

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await onUploadImage(file);
      const newImage: ProductImage = {
        id: Date.now().toString(),
        url: imageUrl,
        alt: formData.name,
        isPrimary: formData.images.length === 0,
        order: formData.images.length
      };
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    } catch (error) {
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const setPrimaryImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }))
    }));
  };

  const addVariant = () => {
    if (!newVariant.name || !newVariant.sku) return;
    
    const variant: ProductVariant = {
      ...newVariant,
      id: Date.now().toString()
    };
    
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, variant]
    }));
    
    setNewVariant({
      name: '',
      sku: '',
      price: 0,
      cost: 0,
      stock: 0,
      attributes: {},
      active: true
    });
  };

  const removeVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData);
    } else {
      onAddProduct(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      longDescription: '',
      basePrice: 0,
      baseCost: 0,
      category: '',
      baseSku: '',
      images: [],
      variants: [],
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
        mpn: '',
        gtin: '',
        condition: 'new',
        availability: 'in_stock',
        shippingWeight: 0,
        shippingDimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
        ageGroup: '',
        gender: '',
        color: '',
        size: '',
        material: '',
        pattern: '',
        customLabels: []
      },
      seoData: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        slug: ''
      },
      dianProductCode: '',
      unidadMedida: 'UND',
      codigoBarras: '',
      active: true
    });
    setEditingProduct(null);
    setShowModal(false);
    setActiveTab('basic');
  };

  const openEditModal = (product: EnhancedProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      longDescription: product.longDescription || '',
      basePrice: product.basePrice,
      baseCost: product.baseCost,
      category: product.category,
      baseSku: product.baseSku,
      images: product.images,
      variants: product.variants,
      taxes: product.taxes,
      technicalSpecs: product.technicalSpecs || [],
      videos: product.videos || [],
      socialMedia: product.socialMedia || {
        facebook: { enabled: false, postTemplate: '', hashtags: [] },
        instagram: { enabled: false, postTemplate: '', hashtags: [] },
        twitter: { enabled: false, postTemplate: '', hashtags: [] }
      },
      googleMerchant: product.googleMerchant || {
        enabled: false,
        productType: '',
        googleProductCategory: '',
        brand: '',
        mpn: '',
        gtin: '',
        condition: 'new',
        availability: 'in_stock',
        shippingWeight: 0,
        shippingDimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
        ageGroup: '',
        gender: '',
        color: '',
        size: '',
        material: '',
        pattern: '',
        customLabels: []
      },
      seoData: product.seoData || {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        slug: ''
      },
      dianProductCode: product.dianProductCode || '',
      unidadMedida: product.unidadMedida,
      codigoBarras: product.codigoBarras || '',
      active: product.active
    });
    setShowModal(true);
  };

  const unidadesMedida = [
    { value: 'UND', label: 'Unidad' },
    { value: 'KG', label: 'Kilogramo' },
    { value: 'GR', label: 'Gramo' },
    { value: 'LT', label: 'Litro' },
    { value: 'ML', label: 'Mililitro' },
    { value: 'MT', label: 'Metro' },
    { value: 'CM', label: 'Centímetro' },
    { value: 'M2', label: 'Metro Cuadrado' },
    { value: 'M3', label: 'Metro Cúbico' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">
            Administra productos, variantes e imágenes - Moneda: {currency}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative">
              <img
                src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || 'https://images.pexels.com/photos/4464207/pexels-photo-4464207.jpeg?auto=compress&cs=tinysrgb&w=300'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <span className="bg-white px-2 py-1 rounded text-xs font-medium">
                  {product.variants.length} variantes
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">SKU Base:</span>
                  <span className="font-medium">{product.baseSku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Precio Base:</span>
                  <span className="font-medium text-green-600">
                    {currencySymbol}{product.basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stock Total:</span>
                  <span className="font-medium">
                    {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Impuestos:</span>
                  <span className="font-medium">{product.taxes.length}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button 
                  onClick={() => setViewingProduct(product)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Moneda: {currency}</span>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'basic', label: 'Información Básica', icon: Tag },
                  { id: 'variants', label: 'Variantes', icon: Edit },
                  { id: 'images', label: 'Imágenes', icon: ImageIcon },
                  { id: 'taxes', label: 'Impuestos', icon: DollarSign },
                  { id: 'google', label: 'Google Shopping', icon: Eye },
                  { id: 'social', label: 'Redes Sociales', icon: Upload },
                  { id: 'seo', label: 'SEO', icon: Search }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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

            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Information Tab */}
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
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                          value={formData.baseSku}
                          onChange={(e) => setFormData({...formData, baseSku: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Detallada
                      </label>
                      <textarea
                        value={formData.longDescription}
                        onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción completa para la página del producto..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio Base *
                        </label>
                        <div className="flex">
                          <select
                            value={currency}
                            className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-700 border-r-0"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="COP">COP ($)</option>
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.basePrice}
                            onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Costo Base
                        </label>
                        <div className="flex">
                          <span className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-700 border-r-0">
                            {currencySymbol}
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.baseCost}
                            onChange={(e) => setFormData({...formData, baseCost: parseFloat(e.target.value)})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* DIAN Fields */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Información DIAN</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código Producto DIAN
                          </label>
                          <input
                            type="text"
                            value={formData.dianProductCode}
                            onChange={(e) => setFormData({...formData, dianProductCode: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unidad de Medida *
                          </label>
                          <select
                            value={formData.unidadMedida}
                            onChange={(e) => setFormData({...formData, unidadMedida: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {unidadesMedida.map(unidad => (
                              <option key={unidad.value} value={unidad.value}>
                                {unidad.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código de Barras
                          </label>
                          <input
                            type="text"
                            value={formData.codigoBarras}
                            onChange={(e) => setFormData({...formData, codigoBarras: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock Information (Read-only) */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Inventario</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Total</label>
                            <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                              {formData.variants.reduce((sum, v) => sum + v.stock, 0)} unidades
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor en Inventario</label>
                            <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                              {currencySymbol}{(formData.variants.reduce((sum, v) => sum + (v.cost * v.stock), 0)).toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <div className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${
                              formData.variants.reduce((sum, v) => sum + v.stock, 0) < 10 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {formData.variants.reduce((sum, v) => sum + v.stock, 0) < 10 ? 'Stock Bajo' : 'Stock Normal'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          <p>💡 Para modificar el stock, usa la sección de "Inventario Avanzado"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">Agregar Nueva Variante</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Nombre de variante"
                          value={newVariant.name}
                          onChange={(e) => setNewVariant({...newVariant, name: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="SKU único"
                          value={newVariant.sku}
                          onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Precio"
                          value={newVariant.price}
                          onChange={(e) => setNewVariant({...newVariant, price: parseFloat(e.target.value)})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Costo"
                          value={newVariant.cost}
                          onChange={(e) => setNewVariant({...newVariant, cost: parseFloat(e.target.value)})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Stock inicial"
                          value={newVariant.stock}
                          onChange={(e) => setNewVariant({...newVariant, stock: parseInt(e.target.value)})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={addVariant}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formData.variants.map((variant) => (
                        <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                              <div>
                                <p className="font-medium">{variant.name}</p>
                                <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Precio</p>
                                <p className="font-medium">{currencySymbol}{variant.price.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Costo</p>
                                <p className="font-medium">{currencySymbol}{variant.cost.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Stock</p>
                                <p className="font-medium">{variant.stock}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
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

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-600">
                          {uploadingImage ? 'Subiendo...' : 'Haz clic para subir imágenes'}
                        </span>
                        <span className="text-sm text-gray-500">PNG, JPG hasta 5MB</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(image.id)}
                              className={`px-3 py-1 rounded text-sm ${
                                image.isPrimary
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {image.isPrimary ? 'Principal' : 'Hacer Principal'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Taxes Tab */}
                {activeTab === 'taxes' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Impuestos Aplicables</h4>
                      <div className="space-y-3">
                        {taxes.map((tax) => (
                          <div key={tax.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={formData.taxes.includes(tax.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      taxes: [...prev.taxes, tax.id]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      taxes: prev.taxes.filter(t => t !== tax.id)
                                    }));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div>
                                <p className="font-medium">{tax.name}</p>
                                <p className="text-sm text-gray-500">
                                  {tax.type} - {tax.rate}% - Código DIAN: {tax.dianCode}
                                </p>
                              </div>
                            </div>
                            <span className="text-lg font-bold text-green-600">
                              {tax.rate}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Google Shopping Tab */}
                {activeTab === 'google' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Google Shopping / Google Merchant Center</h4>
                      <p className="text-sm text-blue-700">
                        Configura tu producto para aparecer en Google Shopping y aumentar la visibilidad online.
                      </p>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="google-enabled"
                        checked={formData.googleMerchant.enabled}
                        onChange={(e) => setFormData({
                          ...formData,
                          googleMerchant: { ...formData.googleMerchant, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="google-enabled" className="ml-2 text-sm font-medium text-gray-700">
                        Habilitar para Google Shopping
                      </label>
                    </div>

                    {formData.googleMerchant.enabled && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Marca *
                            </label>
                            <input
                              type="text"
                              value={formData.googleMerchant.brand}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, brand: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Apple, Samsung, Nike..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Condición *
                            </label>
                            <select
                              value={formData.googleMerchant.condition}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, condition: e.target.value as any }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="new">Nuevo</option>
                              <option value="used">Usado</option>
                              <option value="refurbished">Reacondicionado</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Número de Parte del Fabricante (MPN)
                            </label>
                            <input
                              type="text"
                              value={formData.googleMerchant.mpn}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, mpn: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="ABC123XYZ"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              GTIN (Código de Barras Global)
                            </label>
                            <input
                              type="text"
                              value={formData.googleMerchant.gtin}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, gtin: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="1234567890123"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría de Google
                          </label>
                          <input
                            type="text"
                            value={formData.googleMerchant.googleProductCategory}
                            onChange={(e) => setFormData({
                              ...formData,
                              googleMerchant: { ...formData.googleMerchant, googleProductCategory: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Electronics > Computers > Laptops"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color
                            </label>
                            <input
                              type="text"
                              value={formData.googleMerchant.color}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, color: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Negro, Azul, Rojo..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Talla
                            </label>
                            <input
                              type="text"
                              value={formData.googleMerchant.size}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, size: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="S, M, L, XL..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Material
                            </label>
                            <input
                              type="text"
                              value={formData.googleMerchant.material}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, material: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Algodón, Plástico, Metal..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Grupo de Edad
                            </label>
                            <select
                              value={formData.googleMerchant.ageGroup}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, ageGroup: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Seleccionar...</option>
                              <option value="adult">Adulto</option>
                              <option value="kids">Niños</option>
                              <option value="toddler">Niños Pequeños</option>
                              <option value="infant">Bebés</option>
                              <option value="newborn">Recién Nacidos</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Género
                            </label>
                            <select
                              value={formData.googleMerchant.gender}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: { ...formData.googleMerchant, gender: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Seleccionar...</option>
                              <option value="male">Masculino</option>
                              <option value="female">Femenino</option>
                              <option value="unisex">Unisex</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Peso de Envío (kg)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.googleMerchant.shippingWeight}
                            onChange={(e) => setFormData({
                              ...formData,
                              googleMerchant: { ...formData.googleMerchant, shippingWeight: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dimensiones de Envío
                          </label>
                          <div className="grid grid-cols-4 gap-3">
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Largo"
                              value={formData.googleMerchant.shippingDimensions?.length || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: {
                                  ...formData.googleMerchant,
                                  shippingDimensions: {
                                    ...formData.googleMerchant.shippingDimensions,
                                    length: parseFloat(e.target.value) || 0
                                  }
                                }
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Ancho"
                              value={formData.googleMerchant.shippingDimensions?.width || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: {
                                  ...formData.googleMerchant,
                                  shippingDimensions: {
                                    ...formData.googleMerchant.shippingDimensions,
                                    width: parseFloat(e.target.value) || 0
                                  }
                                }
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Alto"
                              value={formData.googleMerchant.shippingDimensions?.height || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: {
                                  ...formData.googleMerchant,
                                  shippingDimensions: {
                                    ...formData.googleMerchant.shippingDimensions,
                                    height: parseFloat(e.target.value) || 0
                                  }
                                }
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select
                              value={formData.googleMerchant.shippingDimensions?.unit || 'cm'}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleMerchant: {
                                  ...formData.googleMerchant,
                                  shippingDimensions: {
                                    ...formData.googleMerchant.shippingDimensions,
                                    unit: e.target.value as 'cm' | 'in'
                                  }
                                }
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="cm">cm</option>
                              <option value="in">in</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Etiquetas Personalizadas
                          </label>
                          <input
                            type="text"
                            placeholder="Bestseller, Oferta, Nuevo (separar con comas)"
                            value={formData.googleMerchant.customLabels?.join(', ') || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              googleMerchant: {
                                ...formData.googleMerchant,
                                customLabels: e.target.value.split(',').map(label => label.trim()).filter(Boolean)
                              }
                            })}
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
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Compartir en Redes Sociales</h4>
                      <p className="text-sm text-green-700">
                        Configura plantillas personalizadas para compartir este producto en redes sociales y WhatsApp.
                      </p>
                    </div>

                    {/* Facebook */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">f</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Facebook</h5>
                          <p className="text-sm text-gray-500">Configura cómo se comparte en Facebook</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.socialMedia.facebook.enabled}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: {
                              ...formData.socialMedia,
                              facebook: { ...formData.socialMedia.facebook, enabled: e.target.checked }
                            }
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      
                      {formData.socialMedia.facebook.enabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plantilla de Publicación
                            </label>
                            <textarea
                              value={formData.socialMedia.facebook.postTemplate}
                              onChange={(e) => setFormData({
                                ...formData,
                                socialMedia: {
                                  ...formData.socialMedia,
                                  facebook: { ...formData.socialMedia.facebook, postTemplate: e.target.value }
                                }
                              })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="🔥 ¡Nuevo producto disponible! {{productName}} - {{price}}. ¡No te lo pierdas!"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hashtags
                            </label>
                            <input
                              type="text"
                              value={formData.socialMedia.facebook.hashtags.join(', ')}
                              onChange={(e) => setFormData({
                                ...formData,
                                socialMedia: {
                                  ...formData.socialMedia,
                                  facebook: {
                                    ...formData.socialMedia.facebook,
                                    hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="producto, oferta, tecnologia (separar con comas)"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Instagram */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">📷</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Instagram</h5>
                          <p className="text-sm text-gray-500">Configura cómo se comparte en Instagram</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.socialMedia.instagram.enabled}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: {
                              ...formData.socialMedia,
                              instagram: { ...formData.socialMedia.instagram, enabled: e.target.checked }
                            }
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      
                      {formData.socialMedia.instagram.enabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plantilla de Publicación
                            </label>
                            <textarea
                              value={formData.socialMedia.instagram.postTemplate}
                              onChange={(e) => setFormData({
                                ...formData,
                                socialMedia: {
                                  ...formData.socialMedia,
                                  instagram: { ...formData.socialMedia.instagram, postTemplate: e.target.value }
                                }
                              })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="✨ {{productName}} ✨ Disponible ahora por {{price}} 💫"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hashtags
                            </label>
                            <input
                              type="text"
                              value={formData.socialMedia.instagram.hashtags.join(', ')}
                              onChange={(e) => setFormData({
                                ...formData,
                                socialMedia: {
                                  ...formData.socialMedia,
                                  instagram: {
                                    ...formData.socialMedia.instagram,
                                    hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="producto, shop, style, trend (separar con comas)"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">📱</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">WhatsApp</h5>
                          <p className="text-sm text-gray-500">Plantilla para compartir por WhatsApp</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mensaje de WhatsApp
                        </label>
                        <textarea
                          value={formData.socialMedia.whatsapp?.postTemplate || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: {
                              ...formData.socialMedia,
                              whatsapp: { 
                                enabled: true, 
                                postTemplate: e.target.value, 
                                hashtags: [] 
                              }
                            }
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="¡Hola! Te comparto este increíble producto: {{productName}} por solo {{price}}. ¿Te interesa?"
                        />
                      </div>
                    </div>

                    {/* Twitter */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">🐦</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Twitter</h5>
                          <p className="text-sm text-gray-500">Configura cómo se comparte en Twitter</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.socialMedia.twitter.enabled}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: {
                              ...formData.socialMedia,
                              twitter: { ...formData.socialMedia.twitter, enabled: e.target.checked }
                            }
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      
                      {formData.socialMedia.twitter.enabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tweet Template (máx. 280 caracteres)
                            </label>
                            <textarea
                              value={formData.socialMedia.twitter.postTemplate}
                              onChange={(e) => setFormData({
                                ...formData,
                                socialMedia: {
                                  ...formData.socialMedia,
                                  twitter: { ...formData.socialMedia.twitter, postTemplate: e.target.value }
                                }
                              })}
                              rows={3}
                              maxLength={280}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="🚀 {{productName}} disponible por {{price}}. ¡Aprovecha esta oferta!"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {formData.socialMedia.twitter.postTemplate.length}/280 caracteres
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hashtags
                            </label>
                            <input
                              type="text"
                              value={formData.socialMedia.twitter.hashtags.join(', ')}
                              onChange={(e) => setFormData({
                                ...formData,
                                socialMedia: {
                                  ...formData.socialMedia,
                                  twitter: {
                                    ...formData.socialMedia.twitter,
                                    hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                  }
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="producto, oferta, tech (separar con comas)"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-2">Optimización SEO</h4>
                      <p className="text-sm text-purple-700">
                        Mejora el posicionamiento de tu producto en motores de búsqueda como Google.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título SEO (Meta Title)
                      </label>
                      <input
                        type="text"
                        value={formData.seoData.metaTitle}
                        onChange={(e) => setFormData({
                          ...formData,
                          seoData: { ...formData.seoData, metaTitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Título optimizado para SEO (50-60 caracteres)"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.seoData.metaTitle.length}/60 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción SEO (Meta Description)
                      </label>
                      <textarea
                        value={formData.seoData.metaDescription}
                        onChange={(e) => setFormData({
                          ...formData,
                          seoData: { ...formData.seoData, metaDescription: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descripción que aparecerá en los resultados de Google (150-160 caracteres)"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.seoData.metaDescription.length}/160 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Palabras Clave
                      </label>
                      <input
                        type="text"
                        value={formData.seoData.keywords.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          seoData: {
                            ...formData.seoData,
                            keywords: e.target.value.split(',').map(keyword => keyword.trim()).filter(Boolean)
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="laptop, computadora, tecnologia, trabajo (separar con comas)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Amigable (Slug)
                      </label>
                      <input
                        type="text"
                        value={formData.seoData.slug}
                        onChange={(e) => setFormData({
                          ...formData,
                          seoData: { ...formData.seoData, slug: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="laptop-dell-inspiron-15-intel-i5"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL final: /producto/{formData.seoData.slug || 'nombre-del-producto'}
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h5 className="font-medium text-yellow-900 mb-2">Consejos SEO</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Incluye palabras clave relevantes en el título</li>
                        <li>• La descripción debe ser atractiva y descriptiva</li>
                        <li>• Usa palabras clave que tus clientes buscarían</li>
                        <li>• El slug debe ser corto y descriptivo</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formData.variants.reduce((sum, v) => sum + v.stock, 0) > 0 && !editingProduct}
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
    </div>

  );
}