import React, { useState } from 'react';
import { MessageCircle, Facebook, Instagram, Twitter, Bot, Settings, Save } from 'lucide-react';
import { WhatsAppIntegration, SocialMediaIntegration } from '../types/documents';

interface IntegrationsManagerProps {
  whatsappConfig: WhatsAppIntegration | null;
  socialConfigs: SocialMediaIntegration[];
  onUpdateWhatsApp: (config: Partial<WhatsAppIntegration>) => void;
  onUpdateSocial: (id: string, config: Partial<SocialMediaIntegration>) => void;
}

export function IntegrationsManager({ 
  whatsappConfig, 
  socialConfigs, 
  onUpdateWhatsApp, 
  onUpdateSocial 
}: IntegrationsManagerProps) {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'social' | 'ai'>('whatsapp');
  
  const [whatsappForm, setWhatsappForm] = useState({
    phoneNumber: whatsappConfig?.phoneNumber || '',
    apiKey: whatsappConfig?.apiKey || '',
    webhookUrl: whatsappConfig?.webhookUrl || '',
    aiEnabled: whatsappConfig?.aiEnabled || false,
    aiPrompt: whatsappConfig?.aiPrompt || 'Eres un asistente virtual de ventas. Ayuda a los clientes con información sobre productos, precios y disponibilidad. Sé amable y profesional.',
    active: whatsappConfig?.active || false
  });

  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150,
    systemPrompt: 'Eres un asistente de ventas especializado en ayudar a los clientes con sus consultas sobre productos y servicios. Proporciona información precisa y útil de manera amigable.',
    autoResponse: true,
    businessHours: {
      enabled: true,
      start: '09:00',
      end: '18:00',
      timezone: 'America/Bogota'
    }
  });

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' }
  ];

  const handleSaveWhatsApp = () => {
    onUpdateWhatsApp(whatsappForm);
    alert('Configuración de WhatsApp guardada');
  };

  const handleSaveSocial = (platform: string, config: any) => {
    const existing = socialConfigs.find(s => s.platform === platform);
    if (existing) {
      onUpdateSocial(existing.id, config);
    }
    alert(`Configuración de ${platform} guardada`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integraciones</h1>
        <p className="text-gray-600 mt-1">
          Configura WhatsApp, redes sociales y agente de IA
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageCircle },
            { id: 'social', label: 'Redes Sociales', icon: Facebook },
            { id: 'ai', label: 'Agente de IA', icon: Bot }
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

      {/* WhatsApp Tab */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp Business API</h3>
              <p className="text-gray-600">Conecta tu negocio con WhatsApp para atención al cliente</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de WhatsApp Business
                </label>
                <input
                  type="tel"
                  value={whatsappForm.phoneNumber}
                  onChange={(e) => setWhatsappForm({...whatsappForm, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+57 300 123 4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={whatsappForm.apiKey}
                  onChange={(e) => setWhatsappForm({...whatsappForm, apiKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu API Key de WhatsApp Business"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={whatsappForm.webhookUrl}
                onChange={(e) => setWhatsappForm({...whatsappForm, webhookUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://tu-dominio.com/webhook/whatsapp"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="whatsapp-active"
                  checked={whatsappForm.active}
                  onChange={(e) => setWhatsappForm({...whatsappForm, active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="whatsapp-active" className="ml-2 text-sm font-medium text-gray-700">
                  Activar WhatsApp Business
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="whatsapp-ai"
                  checked={whatsappForm.aiEnabled}
                  onChange={(e) => setWhatsappForm({...whatsappForm, aiEnabled: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="whatsapp-ai" className="ml-2 text-sm font-medium text-gray-700">
                  Habilitar Agente de IA
                </label>
              </div>
            </div>

            {whatsappForm.aiEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt del Agente de IA
                </label>
                <textarea
                  value={whatsappForm.aiPrompt}
                  onChange={(e) => setWhatsappForm({...whatsappForm, aiPrompt: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Define cómo debe comportarse el agente de IA..."
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSaveWhatsApp}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const config = socialConfigs.find(s => s.platform === platform.id);
            
            return (
              <div key={platform.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 ${platform.color} rounded-full`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                    <p className="text-gray-600">Integración con {platform.name} para atención al cliente</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Token
                    </label>
                    <input
                      type="password"
                      defaultValue={config?.accessToken || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Token de acceso de ${platform.name}`}
                    />
                  </div>

                  {platform.id === 'facebook' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page ID
                      </label>
                      <input
                        type="text"
                        defaultValue={config?.pageId || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ID de tu página de Facebook"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${platform.id}-active`}
                        defaultChecked={config?.active || false}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`${platform.id}-active`} className="ml-2 text-sm font-medium text-gray-700">
                        Activar integración
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${platform.id}-ai`}
                        defaultChecked={config?.aiEnabled || false}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`${platform.id}-ai`} className="ml-2 text-sm font-medium text-gray-700">
                        Habilitar IA
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveSocial(platform.id, {})}
                      className={`${platform.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Agent Tab */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuración del Agente de IA</h3>
              <p className="text-gray-600">Personaliza el comportamiento del asistente virtual</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo de IA
                </label>
                <select
                  value={aiSettings.model}
                  onChange={(e) => setAiSettings({...aiSettings, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiSettings.temperature}
                  onChange={(e) => setAiSettings({...aiSettings, temperature: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Tokens
                </label>
                <input
                  type="number"
                  value={aiSettings.maxTokens}
                  onChange={(e) => setAiSettings({...aiSettings, maxTokens: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt del Sistema
              </label>
              <textarea
                value={aiSettings.systemPrompt}
                onChange={(e) => setAiSettings({...aiSettings, systemPrompt: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Define la personalidad y comportamiento del agente de IA..."
              />
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Horario de Atención</h4>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="business-hours"
                    checked={aiSettings.businessHours.enabled}
                    onChange={(e) => setAiSettings({
                      ...aiSettings,
                      businessHours: {...aiSettings.businessHours, enabled: e.target.checked}
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="business-hours" className="ml-2 text-sm font-medium text-gray-700">
                    Activar horario de atención
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-response"
                    checked={aiSettings.autoResponse}
                    onChange={(e) => setAiSettings({...aiSettings, autoResponse: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="auto-response" className="ml-2 text-sm font-medium text-gray-700">
                    Respuesta automática
                  </label>
                </div>
              </div>

              {aiSettings.businessHours.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de inicio
                    </label>
                    <input
                      type="time"
                      value={aiSettings.businessHours.start}
                      onChange={(e) => setAiSettings({
                        ...aiSettings,
                        businessHours: {...aiSettings.businessHours, start: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de fin
                    </label>
                    <input
                      type="time"
                      value={aiSettings.businessHours.end}
                      onChange={(e) => setAiSettings({
                        ...aiSettings,
                        businessHours: {...aiSettings.businessHours, end: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona horaria
                    </label>
                    <select
                      value={aiSettings.businessHours.timezone}
                      onChange={(e) => setAiSettings({
                        ...aiSettings,
                        businessHours: {...aiSettings.businessHours, timezone: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/Bogota">Bogotá (GMT-5)</option>
                      <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                      <option value="America/New_York">Nueva York (GMT-5)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => alert('Configuración de IA guardada')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}