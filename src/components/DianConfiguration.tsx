import React, { useState } from 'react';
import { Save, Upload, Shield, FileText, Settings } from 'lucide-react';
import { DianConfiguration } from '../types/dian';

interface DianConfigurationProps {
  configuration: DianConfiguration | null;
  onUpdateConfiguration: (config: Partial<DianConfiguration>) => void;
}

export function DianConfigurationComponent({ configuration, onUpdateConfiguration }: DianConfigurationProps) {
  const [config, setConfig] = useState<Partial<DianConfiguration>>(configuration || {
    nit: '',
    razonSocial: '',
    nombreComercial: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    telefono: '',
    email: '',
    certificadoDigital: '',
    passwordCertificado: '',
    ambientePruebas: true,
    urlWebService: 'https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc',
    prefijoFacturacion: 'SETP',
    numeroResolucion: '',
    fechaResolucionDesde: '',
    fechaResolucionHasta: '',
    rangoNumeracionDesde: 1,
    rangoNumeracionHasta: 5000,
    regimenTributario: 'COMUN',
    responsabilidadesFiscales: [],
    active: false
  });

  const [activeTab, setActiveTab] = useState<'empresa' | 'certificado' | 'resolucion' | 'tributario'>('empresa');

  const handleSave = () => {
    onUpdateConfiguration(config);
    alert('Configuración DIAN guardada exitosamente');
  };

  const responsabilidadesFiscales = [
    { code: 'O-13', name: 'Gran Contribuyente' },
    { code: 'O-15', name: 'Autorretenedor' },
    { code: 'O-23', name: 'Agente de retención IVA' },
    { code: 'O-47', name: 'Régimen Simple de Tributación' },
    { code: 'R-99-PN', name: 'No responsable de IVA' }
  ];

  const departamentos = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
    'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
    'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
    'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
    'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración DIAN</h2>
        <p className="text-gray-600 mt-1">
          Configura la integración con la DIAN para facturación electrónica
        </p>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg border ${
        config.active 
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span className="font-medium">
            Estado: {config.active ? 'Configuración Activa' : 'Configuración Pendiente'}
          </span>
        </div>
        <p className="text-sm mt-1">
          {config.active 
            ? 'La facturación electrónica está habilitada'
            : 'Complete la configuración para habilitar la facturación electrónica'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'empresa', label: 'Datos de Empresa', icon: Settings },
            { id: 'certificado', label: 'Certificado Digital', icon: Shield },
            { id: 'resolucion', label: 'Resolución DIAN', icon: FileText },
            { id: 'tributario', label: 'Régimen Tributario', icon: FileText }
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

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* Empresa Tab */}
        {activeTab === 'empresa' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIT *
                </label>
                <input
                  type="text"
                  value={config.nit || ''}
                  onChange={(e) => setConfig({...config, nit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="900123456-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón Social *
                </label>
                <input
                  type="text"
                  value={config.razonSocial || ''}
                  onChange={(e) => setConfig({...config, razonSocial: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mi Empresa S.A.S."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={config.nombreComercial || ''}
                onChange={(e) => setConfig({...config, nombreComercial: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mi Tienda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                value={config.direccion || ''}
                onChange={(e) => setConfig({...config, direccion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Calle 123 # 45-67"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={config.ciudad || ''}
                  onChange={(e) => setConfig({...config, ciudad: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bogotá"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <select
                  value={config.departamento || ''}
                  onChange={(e) => setConfig({...config, departamento: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar departamento</option>
                  {departamentos.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={config.telefono || ''}
                  onChange={(e) => setConfig({...config, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+57 1 234 5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={config.email || ''}
                  onChange={(e) => setConfig({...config, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="facturacion@miempresa.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Certificado Tab */}
        {activeTab === 'certificado' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Certificado Digital</h4>
              <p className="text-sm text-blue-700">
                El certificado digital es requerido para firmar las facturas electrónicas.
                Debe ser emitido por una entidad certificadora autorizada por la DIAN.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificado Digital (.p12) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".p12,.pfx"
                  className="hidden"
                  id="certificate-upload"
                />
                <label
                  htmlFor="certificate-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600">
                    Subir certificado digital
                  </span>
                  <span className="text-sm text-gray-500">
                    Archivos .p12 o .pfx
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña del Certificado *
              </label>
              <input
                type="password"
                value={config.passwordCertificado || ''}
                onChange={(e) => setConfig({...config, passwordCertificado: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contraseña del certificado"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="ambiente-pruebas"
                checked={config.ambientePruebas || false}
                onChange={(e) => setConfig({...config, ambientePruebas: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="ambiente-pruebas" className="ml-2 text-sm font-medium text-gray-700">
                Ambiente de Pruebas (Habilitación)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Web Service
              </label>
              <input
                type="url"
                value={config.urlWebService || ''}
                onChange={(e) => setConfig({...config, urlWebService: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc"
              />
            </div>
          </div>
        )}

        {/* Resolución Tab */}
        {activeTab === 'resolucion' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Resolución de Facturación</h4>
              <p className="text-sm text-yellow-700">
                Información de la resolución otorgada por la DIAN para facturación electrónica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefijo de Facturación *
                </label>
                <input
                  type="text"
                  value={config.prefijoFacturacion || ''}
                  onChange={(e) => setConfig({...config, prefijoFacturacion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SETP"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Resolución *
                </label>
                <input
                  type="text"
                  value={config.numeroResolucion || ''}
                  onChange={(e) => setConfig({...config, numeroResolucion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="18760000001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Resolución Desde *
                </label>
                <input
                  type="date"
                  value={config.fechaResolucionDesde || ''}
                  onChange={(e) => setConfig({...config, fechaResolucionDesde: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Resolución Hasta *
                </label>
                <input
                  type="date"
                  value={config.fechaResolucionHasta || ''}
                  onChange={(e) => setConfig({...config, fechaResolucionHasta: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numeración Desde *
                </label>
                <input
                  type="number"
                  value={config.rangoNumeracionDesde || ''}
                  onChange={(e) => setConfig({...config, rangoNumeracionDesde: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numeración Hasta *
                </label>
                <input
                  type="number"
                  value={config.rangoNumeracionHasta || ''}
                  onChange={(e) => setConfig({...config, rangoNumeracionHasta: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tributario Tab */}
        {activeTab === 'tributario' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Régimen Tributario *
              </label>
              <select
                value={config.regimenTributario || ''}
                onChange={(e) => setConfig({...config, regimenTributario: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar régimen</option>
                <option value="SIMPLIFICADO">Régimen Simplificado</option>
                <option value="COMUN">Régimen Común</option>
                <option value="GRAN_CONTRIBUYENTE">Gran Contribuyente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsabilidades Fiscales
              </label>
              <div className="space-y-3">
                {responsabilidadesFiscales.map((resp) => (
                  <div key={resp.code} className="flex items-center">
                    <input
                      type="checkbox"
                      id={resp.code}
                      checked={config.responsabilidadesFiscales?.includes(resp.code) || false}
                      onChange={(e) => {
                        const current = config.responsabilidadesFiscales || [];
                        if (e.target.checked) {
                          setConfig({
                            ...config,
                            responsabilidadesFiscales: [...current, resp.code]
                          });
                        } else {
                          setConfig({
                            ...config,
                            responsabilidadesFiscales: current.filter(r => r !== resp.code)
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={resp.code} className="ml-2 text-sm text-gray-700">
                      <span className="font-medium">{resp.code}</span> - {resp.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}