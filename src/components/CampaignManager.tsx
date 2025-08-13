import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, Calendar, Target, Image as ImageIcon, Palette } from 'lucide-react';
import { Campaign, BannerSettings, ProductHighlight } from '../types/campaigns';
import { Product } from '../App';

interface CampaignManagerProps {
  campaigns: Campaign[];
  bannerSettings: BannerSettings;
  productHighlights: ProductHighlight[];
  products: Product[];
  onCreateCampaign: (campaign: Omit<Campaign, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => void;
  onUpdateCampaign: (id: string, updates: Partial<Campaign>) => void;
  onDeleteCampaign: (id: string) => void;
  onUpdateBannerSettings: (settings: Partial<BannerSettings>) => void;
  onCreateProductHighlight: (highlight: Omit<ProductHighlight, 'id' | 'tenantId'>) => void;
  onUpdateProductHighlight: (id: string, updates: Partial<ProductHighlight>) => void;
  onDeleteProductHighlight: (id: string) => void;
}

export function CampaignManager({
  campaigns,
  bannerSettings,
  productHighlights,
  products,
  onCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onUpdateBannerSettings,
  onCreateProductHighlight,
  onUpdateProductHighlight,
  onDeleteProductHighlight
}: CampaignManagerProps) {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'settings' | 'highlights'>('campaigns');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editingHighlight, setEditingHighlight] = useState<ProductHighlight | null>(null);
  
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    buttonText: 'Ver Ofertas',
    buttonLink: '/productos',
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
    priority: 1,
    targetAudience: 'all' as const
  });

  const [highlightForm, setHighlightForm] = useState({
    productId: '',
    title: '',
    description: '',
    badgeText: 'OFERTA',
    badgeColor: '#EF4444',
    discountPercentage: 0,
    specialPrice: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true
  });

  const [settings, setSettings] = useState(bannerSettings);

  const handleCreateCampaign = () => {
    onCreateCampaign(campaignForm);
    resetCampaignForm();
  };

  const handleUpdateCampaign = () => {
    if (editingCampaign) {
      onUpdateCampaign(editingCampaign.id, campaignForm);
      resetCampaignForm();
    }
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      buttonText: 'Ver Ofertas',
      buttonLink: '/productos',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
      priority: 1,
      targetAudience: 'all'
    });
    setEditingCampaign(null);
    setShowCampaignModal(false);
  };

  const openEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      title: campaign.title,
      subtitle: campaign.subtitle,
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      buttonText: campaign.buttonText,
      buttonLink: campaign.buttonLink,
      backgroundColor: campaign.backgroundColor,
      textColor: campaign.textColor,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      active: campaign.active,
      priority: campaign.priority,
      targetAudience: campaign.targetAudience
    });
    setShowCampaignModal(true);
  };

  const handleCreateHighlight = () => {
    onCreateProductHighlight(highlightForm);
    resetHighlightForm();
  };

  const resetHighlightForm = () => {
    setHighlightForm({
      productId: '',
      title: '',
      description: '',
      badgeText: 'OFERTA',
      badgeColor: '#EF4444',
      discountPercentage: 0,
      specialPrice: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true
    });
    setEditingHighlight(null);
    setShowHighlightModal(false);
  };

  const backgroundColors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Púrpura', value: '#8B5CF6' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Naranja', value: '#F59E0B' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Gris', value: '#6B7280' },
    { name: 'Negro', value: '#1F2937' }
  ];

  const textColors = [
    { name: 'Blanco', value: '#FFFFFF' },
    { name: 'Negro', value: '#000000' },
    { name: 'Gris Claro', value: '#F3F4F6' },
    { name: 'Gris Oscuro', value: '#374151' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Campañas</h1>
          <p className="text-gray-600 mt-1">
            Administra banners, campañas publicitarias y productos destacados
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCampaignModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Campaña</span>
          </button>
          <button
            onClick={() => setShowHighlightModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Destacar Producto</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'campaigns', label: 'Campañas Activas', icon: Target },
            { id: 'highlights', label: 'Productos Destacados', icon: Target },
            { id: 'settings', label: 'Configuración Banner', icon: Palette }
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

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  className="h-32 bg-cover bg-center relative"
                  style={{ 
                    backgroundImage: `url(${campaign.imageUrl})`,
                    backgroundColor: campaign.backgroundColor
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center" style={{ color: campaign.textColor }}>
                      <h3 className="text-lg font-bold">{campaign.title}</h3>
                      <p className="text-sm opacity-90">{campaign.subtitle}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.active ? 'Activa' : 'Inactiva'}
                    </span>
                    <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 text-xs rounded-full">
                      Prioridad {campaign.priority}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Inicio:</span>
                      <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fin:</span>
                      <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audiencia:</span>
                      <span className="capitalize">{campaign.targetAudience === 'all' ? 'Todos' : campaign.targetAudience}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => openEditCampaign(campaign)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCampaign(campaign.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Highlights Tab */}
      {activeTab === 'highlights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productHighlights.map((highlight) => {
              const product = products.find(p => p.id === highlight.productId);
              if (!product) return null;
              
              return (
                <div key={highlight.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span 
                        className="px-2 py-1 text-xs font-bold text-white rounded-full"
                        style={{ backgroundColor: highlight.badgeColor }}
                      >
                        {highlight.badgeText}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        highlight.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {highlight.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{highlight.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Producto:</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      {highlight.discountPercentage > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Descuento:</span>
                          <span className="font-medium text-red-600">{highlight.discountPercentage}%</span>
                        </div>
                      )}
                      {highlight.specialPrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Precio Especial:</span>
                          <span className="font-medium text-green-600">${highlight.specialPrice.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Válido hasta:</span>
                        <span className="font-medium">{new Date(highlight.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => {
                          setEditingHighlight(highlight);
                          setHighlightForm({
                            productId: highlight.productId,
                            title: highlight.title,
                            description: highlight.description,
                            badgeText: highlight.badgeText,
                            badgeColor: highlight.badgeColor,
                            discountPercentage: highlight.discountPercentage || 0,
                            specialPrice: highlight.specialPrice || 0,
                            startDate: highlight.startDate,
                            endDate: highlight.endDate,
                            active: highlight.active
                          });
                          setShowHighlightModal(true);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => onDeleteProductHighlight(highlight.id)}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración del Banner</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showBanner"
                  checked={settings.showBanner}
                  onChange={(e) => setSettings({...settings, showBanner: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="showBanner" className="ml-2 text-sm font-medium text-gray-700">
                  Mostrar Banner en la Tienda
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRotate"
                  checked={settings.autoRotate}
                  onChange={(e) => setSettings({...settings, autoRotate: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="autoRotate" className="ml-2 text-sm font-medium text-gray-700">
                  Rotación Automática
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura del Banner
                </label>
                <select
                  value={settings.height}
                  onChange={(e) => setSettings({...settings, height: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">Pequeño (200px)</option>
                  <option value="medium">Mediano (300px)</option>
                  <option value="large">Grande (400px)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición
                </label>
                <select
                  value={settings.position}
                  onChange={(e) => setSettings({...settings, position: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="top">Parte Superior</option>
                  <option value="hero">Hero Section</option>
                  <option value="middle">Medio de la Página</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animación
                </label>
                <select
                  value={settings.animationType}
                  onChange={(e) => setSettings({...settings, animationType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fade">Desvanecimiento</option>
                  <option value="slide">Deslizamiento</option>
                  <option value="none">Sin Animación</option>
                </select>
              </div>
            </div>

            {settings.autoRotate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo de Rotación (segundos)
                </label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={settings.rotationInterval}
                  onChange={(e) => setSettings({...settings, rotationInterval: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showIndicators"
                  checked={settings.showIndicators}
                  onChange={(e) => setSettings({...settings, showIndicators: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="showIndicators" className="ml-2 text-sm font-medium text-gray-700">
                  Mostrar Indicadores
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showArrows"
                  checked={settings.showArrows}
                  onChange={(e) => setSettings({...settings, showArrows: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="showArrows" className="ml-2 text-sm font-medium text-gray-700">
                  Mostrar Flechas de Navegación
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onUpdateBannerSettings(settings)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
                </h3>
                <button onClick={resetCampaignForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Principal *
                  </label>
                  <input
                    type="text"
                    value={campaignForm.title}
                    onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="¡Gran Oferta de Temporada!"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={campaignForm.subtitle}
                    onChange={(e) => setCampaignForm({...campaignForm, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hasta 50% de descuento"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={campaignForm.description}
                    onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción detallada de la campaña..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={campaignForm.imageUrl}
                    onChange={(e) => setCampaignForm({...campaignForm, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={campaignForm.buttonText}
                      onChange={(e) => setCampaignForm({...campaignForm, buttonText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enlace del Botón
                    </label>
                    <input
                      type="text"
                      value={campaignForm.buttonLink}
                      onChange={(e) => setCampaignForm({...campaignForm, buttonLink: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color de Fondo
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {backgroundColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setCampaignForm({...campaignForm, backgroundColor: color.value})}
                          className={`w-full h-10 rounded-lg border-2 ${
                            campaignForm.backgroundColor === color.value ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color del Texto
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setCampaignForm({...campaignForm, textColor: color.value})}
                          className={`w-full h-10 rounded-lg border-2 ${
                            campaignForm.textColor === color.value ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={campaignForm.startDate}
                      onChange={(e) => setCampaignForm({...campaignForm, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={campaignForm.endDate}
                      onChange={(e) => setCampaignForm({...campaignForm, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={campaignForm.priority}
                      onChange={(e) => setCampaignForm({...campaignForm, priority: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audiencia Objetivo
                  </label>
                  <select
                    value={campaignForm.targetAudience}
                    onChange={(e) => setCampaignForm({...campaignForm, targetAudience: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todos los Visitantes</option>
                    <option value="new">Nuevos Clientes</option>
                    <option value="returning">Clientes Recurrentes</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Vista Previa</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className={`relative bg-cover bg-center ${
                      settings.height === 'small' ? 'h-32' : 
                      settings.height === 'medium' ? 'h-48' : 'h-64'
                    }`}
                    style={{ 
                      backgroundImage: `url(${campaignForm.imageUrl})`,
                      backgroundColor: campaignForm.backgroundColor
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center px-6" style={{ color: campaignForm.textColor }}>
                        <h3 className="text-2xl font-bold mb-2">{campaignForm.title || 'Título de la Campaña'}</h3>
                        {campaignForm.subtitle && (
                          <p className="text-lg opacity-90 mb-4">{campaignForm.subtitle}</p>
                        )}
                        {campaignForm.buttonText && (
                          <button 
                            className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                          >
                            {campaignForm.buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={resetCampaignForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingCampaign ? 'Actualizar' : 'Crear'} Campaña</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Highlight Modal */}
      {showHighlightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingHighlight ? 'Editar Producto Destacado' : 'Nuevo Producto Destacado'}
                </h3>
                <button onClick={resetHighlightForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto *
                </label>
                <select
                  value={highlightForm.productId}
                  onChange={(e) => setHighlightForm({...highlightForm, productId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Destacado
                  </label>
                  <input
                    type="text"
                    value={highlightForm.title}
                    onChange={(e) => setHighlightForm({...highlightForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Producto de la Semana"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto del Badge
                  </label>
                  <input
                    type="text"
                    value={highlightForm.badgeText}
                    onChange={(e) => setHighlightForm({...highlightForm, badgeText: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="OFERTA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={highlightForm.description}
                  onChange={(e) => setHighlightForm({...highlightForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción especial del producto destacado..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={highlightForm.discountPercentage}
                    onChange={(e) => setHighlightForm({...highlightForm, discountPercentage: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Especial
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={highlightForm.specialPrice}
                    onChange={(e) => setHighlightForm({...highlightForm, specialPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color del Badge
                  </label>
                  <input
                    type="color"
                    value={highlightForm.badgeColor}
                    onChange={(e) => setHighlightForm({...highlightForm, badgeColor: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={highlightForm.startDate}
                    onChange={(e) => setHighlightForm({...highlightForm, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={highlightForm.endDate}
                    onChange={(e) => setHighlightForm({...highlightForm, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={resetHighlightForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateHighlight}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingHighlight ? 'Actualizar' : 'Crear'} Destacado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}