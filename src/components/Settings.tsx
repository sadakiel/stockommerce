import React, { useState } from 'react';
import { Save, Upload, Palette, Eye, Hash, Globe, Plus, CheckCircle, CreditCard, Trash2, Edit, Settings as SettingsIcon, X } from 'lucide-react';
import { Tenant } from '../App';
import { DocumentNumberingConfig } from './DocumentNumberingConfig';
import { useTranslation } from '../hooks/useTranslation';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'transfer' | 'cash' | 'digital_wallet' | 'crypto';
  enabled: boolean;
  config: any;
}

interface SettingsProps {
  tenant: Tenant | null;
  onUpdateTenant: (updates: Partial<Tenant>) => void;
  documentNumberings: any[];
  onCreateNumbering: (numbering: any) => void;
  onUpdateNumbering: (id: string, updates: any) => void;
  onDeleteNumbering: (id: string) => void;
  paymentMethods: PaymentMethod[];
  onUpdatePaymentMethods: (methods: PaymentMethod[]) => void;
}

export function Settings({ 
  tenant, 
  onUpdateTenant, 
  documentNumberings, 
  onCreateNumbering, 
  onUpdateNumbering, 
  onDeleteNumbering,
  paymentMethods,
  onUpdatePaymentMethods
}: SettingsProps) {
  const { language, changeLanguage } = useTranslation();
  const [settings, setSettings] = useState(tenant?.settings || {
    storeName: '',
    currency: 'COP',
    theme: 'blue',
    logo: '',
    address: '',
    phone: '',
    email: ''
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'numbering' | 'language' | 'domain'>('general');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    type: 'card' as PaymentMethod['type'],
    enabled: true,
    config: {}
  });

  const handleSave = () => {
    onUpdateTenant({ settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      ...paymentForm,
      id: Date.now().toString()
    };
    onUpdatePaymentMethods([...paymentMethods, newMethod]);
    resetPaymentForm();
  };

  const handleUpdatePaymentMethod = () => {
    if (editingPayment) {
      const updatedMethods = paymentMethods.map(m => 
        m.id === editingPayment.id ? { ...editingPayment, ...paymentForm } : m
      );
      onUpdatePaymentMethods(updatedMethods);
      resetPaymentForm();
    }
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      name: '',
      type: 'card',
      enabled: true,
      config: {}
    });
    setEditingPayment(null);
    setShowPaymentModal(false);
  };

  const deletePaymentMethod = (id: string) => {
    onUpdatePaymentMethods(paymentMethods.filter(m => m.id !== id));
  };

  const openEditPayment = (method: PaymentMethod) => {
    setEditingPayment(method);
    setPaymentForm({
      name: method.name,
      type: method.type,
      enabled: method.enabled,
      config: method.config
    });
    setShowPaymentModal(true);
  };

  const themes = [
    { id: 'blue', name: 'Azul Corporativo', color: 'bg-blue-500', gradient: 'from-blue-600 to-blue-800' },
    { id: 'green', name: 'Verde Natura', color: 'bg-green-500', gradient: 'from-green-600 to-green-800' },
    { id: 'purple', name: 'Morado Elegante', color: 'bg-purple-500', gradient: 'from-purple-600 to-purple-800' },
    { id: 'red', name: 'Rojo Dinámico', color: 'bg-red-500', gradient: 'from-red-600 to-red-800' }
  ];

  const currencies = [
    { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
    { code: 'MXN', name: 'Peso Mexicano', symbol: '$' }
  ];

  const paymentTypes = [
    { value: 'card', label: 'Tarjeta de Crédito/Débito', icon: '💳' },
    { value: 'transfer', label: 'Transferencia Bancaria', icon: '🏦' },
    { value: 'cash', label: 'Efectivo', icon: '💵' },
    { value: 'digital_wallet', label: 'Billetera Digital', icon: '📱' },
    { value: 'crypto', label: 'Criptomonedas', icon: '₿' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Personaliza la configuración de tu tienda</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'payments', label: 'Medios de Pago', icon: CreditCard },
            { id: 'numbering', label: 'Numeración', icon: Hash },
            { id: 'language', label: 'Idioma', icon: Globe },
            { id: 'domain', label: 'Dominio', icon: Globe }
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

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Store Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Información de la Tienda</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Tienda
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este nombre aparece centrado junto al logo en la tienda
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Appearance */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Apariencia</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Logo
                  </label>
                  <input
                    type="url"
                    value={settings.logo}
                    onChange={(e) => setSettings({...settings, logo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de la Tienda
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={settings.logo}
                      alt="Logo preview"
                      className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Recomendado: 200x200px, formato PNG o JPG
                      </p>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Subir Nuevo Logo</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema de Color
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSettings({...settings, theme: theme.id})}
                        className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                          settings.theme === theme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${theme.gradient}`}></div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{theme.name}</p>
                          <p className="text-sm text-gray-500">Tema {theme.id}</p>
                        </div>
                        {settings.theme === theme.id && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">Peso Colombiano (COP)</p>
                          <p className="text-sm text-blue-700">Moneda principal del sistema</p>
                        </div>
                        <span className="text-2xl">🇨🇴</span>
                      </div>
                    </div>
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600">
                      <Plus className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">Agregar Moneda Adicional</p>
                      <p className="text-xs text-gray-500">Próximamente disponible</p>
                    </button>
                    <p className="text-xs text-gray-500">
                      💡 Para agregar monedas adicionales, contacta al administrador del sistema
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Configuración Avanzada
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Mostrar stock en tienda</p>
                        <p className="text-sm text-gray-500">Los clientes verán la cantidad disponible</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Permitir compras sin registro</p>
                        <p className="text-sm text-gray-500">Los clientes pueden comprar como invitados</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{saved ? 'Guardado' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Medios de Pago</h3>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Método</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => {
              const typeInfo = paymentTypes.find(t => t.value === method.type);
              return (
                <div key={method.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{typeInfo?.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{method.name}</h4>
                        <p className="text-sm text-gray-500">{typeInfo?.label}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      method.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {method.enabled ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditPayment(method)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => deletePaymentMethod(method.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Numbering Tab */}
      {activeTab === 'numbering' && (
        <DocumentNumberingConfig
          numberings={documentNumberings}
          onCreateNumbering={onCreateNumbering}
          onUpdateNumbering={onUpdateNumbering}
          onDeleteNumbering={onDeleteNumbering}
        />
      )}

      {/* Language Tab */}
      {activeTab === 'language' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración de Idioma</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Seleccionar Idioma del Sistema
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => changeLanguage('es')}
                  className={`p-6 border-2 rounded-xl transition-colors ${
                    language === 'es'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">🇨🇴</span>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Español</h4>
                      <p className="text-sm text-gray-600">Idioma predeterminado</p>
                    </div>
                    {language === 'es' && (
                      <div className="ml-auto">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => changeLanguage('en')}
                  className={`p-6 border-2 rounded-xl transition-colors ${
                    language === 'en'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">🇺🇸</span>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">English</h4>
                      <p className="text-sm text-gray-600">International language</p>
                    </div>
                    {language === 'en' && (
                      <div className="ml-auto">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Información Importante</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• El cambio de idioma afecta toda la interfaz del sistema</li>
                <li>• Los datos de productos y clientes no se traducen automáticamente</li>
                <li>• La configuración se guarda automáticamente</li>
                <li>• Los reportes se generarán en el idioma seleccionado</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Domain Tab */}
      {activeTab === 'domain' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración de Dominio</h3>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Dominio Personalizado</h4>
              <p className="text-sm text-blue-700">
                Conecta tu propio dominio para que los clientes accedan a tu tienda con tu marca.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dominio Actual
              </label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="font-mono text-gray-700">
                  https://fascinating-tiramisu-f2c777.netlify.app
                </p>
                <p className="text-xs text-gray-500 mt-1">Dominio temporal de Netlify</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dominio Personalizado
              </label>
              <input
                type="text"
                placeholder="www.supermangueras.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa tu dominio sin https://
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Instrucciones de Configuración</h4>
              <ol className="text-sm text-yellow-700 space-y-2">
                <li>1. <strong>Compra tu dominio</strong> en un registrador (GoDaddy, Namecheap, etc.)</li>
                <li>2. <strong>Configura los DNS</strong> para apuntar a Netlify:</li>
                <li className="ml-4">• Tipo A: 75.2.60.5</li>
                <li className="ml-4">• CNAME www: fascinating-tiramisu-f2c777.netlify.app</li>
                <li>3. <strong>Verifica la configuración</strong> (puede tomar hasta 24 horas)</li>
                <li>4. <strong>Activa SSL</strong> automáticamente con Let's Encrypt</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Beneficios del Dominio Personalizado</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Marca profesional:</strong> www.tumarca.com</li>
                <li>• <strong>Mejor SEO:</strong> Mayor posicionamiento en Google</li>
                <li>• <strong>Confianza del cliente:</strong> URL reconocible</li>
                <li>• <strong>Certificado SSL:</strong> Conexión segura automática</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Configurar Dominio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vista Previa - Tienda</h3>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header Preview */}
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={settings.logo}
                    alt="Logo preview"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <h4 className="font-bold text-gray-900">{settings.storeName}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded text-white text-sm bg-gradient-to-r ${themes.find(t => t.id === settings.theme)?.gradient}`}>
                    Carrito (0)
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero Preview */}
            <div className={`bg-gradient-to-r ${themes.find(t => t.id === settings.theme)?.gradient} text-white p-6 text-center`}>
              <h5 className="text-xl font-bold mb-2">Bienvenido a {settings.storeName}</h5>
              <p className="text-sm opacity-90">Encuentra los mejores productos al mejor precio</p>
            </div>
            
            {/* Product Card Preview */}
            <div className="p-4 bg-gray-50">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="w-full h-24 bg-gray-200 rounded mb-3"></div>
                <h6 className="font-semibold text-gray-900 mb-1">Producto Ejemplo</h6>
                <p className="text-sm text-gray-600 mb-2">Descripción del producto...</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900">
                    {currencies.find(c => c.code === settings.currency)?.symbol}99.99
                  </span>
                </div>
                <div className={`w-full py-2 rounded text-white text-center text-sm bg-gradient-to-r ${themes.find(t => t.id === settings.theme)?.gradient}`}>
                  Agregar al Carrito
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Info Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Negocio</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={settings.logo}
                alt="Logo preview"
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{settings.storeName}</h4>
                <p className="text-sm text-gray-500">
                  Plan: <span className="capitalize font-medium">{tenant?.plan || 'No definido'}</span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{settings.email || 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Teléfono:</span>
                <span className="font-medium">{settings.phone || 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Moneda:</span>
                <span className="font-medium">
                  {currencies.find(c => c.code === settings.currency)?.symbol} {settings.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tema:</span>
                <span className="font-medium capitalize">
                  {themes.find(t => t.id === settings.theme)?.name}
                </span>
              </div>
            </div>
            
            {settings.address && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Dirección:</p>
                <p className="text-sm font-medium text-gray-900">{settings.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingPayment ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
              </h3>
              <button onClick={resetPaymentForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Método
                </label>
                <input
                  type="text"
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej. Visa, Nequi, Efectivo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pago
                </label>
                <select
                  value={paymentForm.type}
                  onChange={(e) => setPaymentForm({...paymentForm, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {paymentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={paymentForm.enabled}
                  onChange={(e) => setPaymentForm({...paymentForm, enabled: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enabled" className="ml-2 text-sm font-medium text-gray-700">
                  Método Activo
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={resetPaymentForm}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingPayment ? handleUpdatePaymentMethod : handleAddPaymentMethod}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingPayment ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}