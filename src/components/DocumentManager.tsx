import React, { useState } from 'react';
import { FileText, Plus, Edit, Eye, Mail, Download, Printer } from 'lucide-react';
import { DocumentTemplate, GeneratedDocument } from '../types/documents';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface DocumentManagerProps {
  templates: DocumentTemplate[];
  documents: GeneratedDocument[];
  onCreateTemplate: (template: Omit<DocumentTemplate, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => void;
  onUpdateTemplate: (id: string, updates: Partial<DocumentTemplate>) => void;
  onGenerateDocument: (templateId: string, data: any) => void;
  onSendEmail: (documentId: string, email: string) => void;
}

export function DocumentManager({ 
  templates, 
  documents, 
  onCreateTemplate, 
  onUpdateTemplate, 
  onGenerateDocument,
  onSendEmail 
}: DocumentManagerProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'documents'>('templates');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'factura' as const,
    htmlTemplate: '',
    cssStyles: '',
    fields: [],
    dianCompliant: true,
    active: true
  });

  const documentTypes = [
    { value: 'factura', label: 'Factura Electrónica', icon: '📄' },
    { value: 'cotizacion', label: 'Cotización', icon: '💰' },
    { value: 'nota_credito', label: 'Nota Crédito', icon: '📋' },
    { value: 'recibo', label: 'Recibo de Pago', icon: '🧾' },
    { value: 'ticket_pos', label: 'Ticket POS', icon: '🎫' }
  ];

  const defaultTemplates = {
    factura: `
      <div class="invoice-header">
        <div class="company-info">
          <img src="{{logo}}" alt="Logo" class="logo">
          <h1>{{companyName}}</h1>
          <p>NIT: {{nit}}</p>
          <p>{{address}}</p>
          <p>{{phone}} - {{email}}</p>
        </div>
        <div class="invoice-details">
          <h2>FACTURA ELECTRÓNICA</h2>
          <p>No. {{invoiceNumber}}</p>
          <p>Fecha: {{date}}</p>
          <p>Vencimiento: {{dueDate}}</p>
        </div>
      </div>
      
      <div class="customer-info">
        <h3>CLIENTE:</h3>
        <p>{{customerName}}</p>
        <p>{{customerDocument}}</p>
        <p>{{customerAddress}}</p>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Valor Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {{#items}}
          <tr>
            <td>{{description}}</td>
            <td>{{quantity}}</td>
            <td>{{unitPrice}}</td>
            <td>{{total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>
      
      <div class="totals">
        <p>Subtotal: {{subtotal}}</p>
        <p>IVA: {{tax}}</p>
        <p><strong>Total: {{total}}</strong></p>
      </div>
      
      <div class="dian-info">
        <p>CUFE: {{cufe}}</p>
        <img src="{{qrCode}}" alt="QR Code" class="qr-code">
      </div>
    `,
    ticket_pos: `
      <div class="pos-ticket">
        <div class="ticket-header">
          <img src="{{logo}}" alt="Logo" class="ticket-logo">
          <h1 class="store-name">{{storeName}}</h1>
          <p class="store-info">{{address}}</p>
          <p class="store-contact">{{phone}} - {{email}}</p>
        </div>
        
        <div class="ticket-separator">================================</div>
        
        <div class="ticket-info">
          <p>Ticket: {{ticketNumber}}</p>
          <p>Fecha: {{date}}</p>
          <p>Cajero: {{cashier}}</p>
          {{#customer}}
          <p>Cliente: {{name}}</p>
          <p>Doc: {{document}}</p>
          {{/customer}}
        </div>
        
        <div class="ticket-separator">================================</div>
        
        <div class="ticket-items">
          {{#items}}
          <div class="item-line">
            <span class="item-name">{{name}}</span>
            <div class="item-details">
              <span>{{quantity}} x {{unitPrice}}</span>
              <span class="item-total">{{total}}</span>
            </div>
          </div>
          {{/items}}
        </div>
        
        <div class="ticket-separator">================================</div>
        
        <div class="ticket-totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>{{subtotal}}</span>
          </div>
          <div class="total-line">
            <span>IVA (19%):</span>
            <span>{{tax}}</span>
          </div>
          <div class="total-line total-final">
            <span>TOTAL:</span>
            <span>{{total}}</span>
          </div>
          <div class="total-line">
            <span>Pago ({{paymentMethod}}):</span>
            <span>{{paymentAmount}}</span>
          </div>
          {{#change}}
          <div class="total-line">
            <span>Cambio:</span>
            <span>{{change}}</span>
          </div>
          {{/change}}
        </div>
        
        {{#electronicInvoice}}
        <div class="ticket-separator">================================</div>
        <div class="dian-info">
          <p class="dian-title">FACTURA ELECTRONICA</p>
          <p class="cufe">CUFE: {{cufe}}</p>
          <div class="qr-container">
            <img src="{{qrCode}}" alt="QR Code" class="qr-code">
          </div>
        </div>
        {{/electronicInvoice}}
        
        <div class="ticket-separator">================================</div>
        
        <div class="ticket-footer">
          <p>¡Gracias por su compra!</p>
          <p>{{storeName}}</p>
          <p class="software-info">Software ERP - Sistema de Gestión</p>
        </div>
      </div>
    `,
    cotizacion: `
      <div class="quote-header">
        <div class="company-info">
          <img src="{{logo}}" alt="Logo" class="logo">
          <h1>{{companyName}}</h1>
          <p>{{address}}</p>
          <p>{{phone}} - {{email}}</p>
        </div>
        <div class="quote-details">
          <h2>COTIZACIÓN</h2>
          <p>No. {{quoteNumber}}</p>
          <p>Fecha: {{date}}</p>
          <p>Válida hasta: {{validUntil}}</p>
        </div>
      </div>
      
      <div class="customer-info">
        <h3>CLIENTE:</h3>
        <p>{{customerName}}</p>
        <p>{{customerEmail}}</p>
        <p>{{customerPhone}}</p>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Valor Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {{#items}}
          <tr>
            <td>{{description}}</td>
            <td>{{quantity}}</td>
            <td>{{unitPrice}}</td>
            <td>{{total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>
      
      <div class="totals">
        <p>Subtotal: {{subtotal}}</p>
        <p>IVA: {{tax}}</p>
        <p><strong>Total: {{total}}</strong></p>
      </div>
      
      <div class="terms">
        <h4>Términos y Condiciones:</h4>
        <p>{{terms}}</p>
      </div>
    `
  };

  const defaultStyles = `
    /* Estilos generales */
    .invoice-header, .quote-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    
    .company-info h1 {
      color: #333;
      margin: 10px 0;
    }
    
    .invoice-details, .quote-details {
      text-align: right;
    }
    
    .customer-info {
      margin: 20px 0;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    .items-table th,
    .items-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    .items-table th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    
    .totals {
      text-align: right;
      margin: 20px 0;
      font-size: 16px;
    }
    
    .totals p {
      margin: 5px 0;
    }
    
    .dian-info {
      margin-top: 30px;
      text-align: center;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    
    .qr-code {
      width: 100px;
      height: 100px;
    }
    
    .terms {
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
    
    /* Estilos para Ticket POS */
    .pos-ticket {
      width: 80mm;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.2;
      color: #000;
      background: #fff;
      padding: 5mm;
      margin: 0 auto;
    }
    
    .ticket-header {
      text-align: center;
      margin-bottom: 10px;
    }
    
    .ticket-logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-bottom: 5px;
    }
    
    .store-name {
      font-size: 16px;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .store-info, .store-contact {
      font-size: 10px;
      margin: 2px 0;
    }
    
    .ticket-separator {
      text-align: center;
      margin: 8px 0;
      font-weight: bold;
    }
    
    .ticket-info p {
      margin: 2px 0;
      font-size: 11px;
    }
    
    .ticket-items {
      margin: 10px 0;
    }
    
    .item-line {
      margin-bottom: 8px;
    }
    
    .item-name {
      display: block;
      font-weight: bold;
      margin-bottom: 2px;
    }
    
    .item-details {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }
    
    .item-total {
      font-weight: bold;
    }
    
    .ticket-totals {
      margin: 10px 0;
    }
    
    .total-line {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 11px;
    }
    
    .total-final {
      font-weight: bold;
      font-size: 14px;
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
      padding: 5px 0;
      margin: 8px 0;
    }
    
    .dian-info {
      text-align: center;
      margin: 10px 0;
    }
    
    .dian-title {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 5px;
    }
    
    .cufe {
      font-size: 8px;
      word-break: break-all;
      margin-bottom: 8px;
    }
    
    .qr-container {
      display: flex;
      justify-content: center;
    }
    
    .qr-code {
      width: 60px;
      height: 60px;
    }
    
    .ticket-footer {
      text-align: center;
      margin-top: 10px;
    }
    
    .ticket-footer p {
      margin: 3px 0;
      font-size: 11px;
    }
    
    .software-info {
      font-size: 8px;
      color: #666;
    }
    
    /* Configuración de impresión */
    @media print {
      .pos-ticket {
        width: 80mm;
        margin: 0;
        padding: 0;
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      @page {
        size: 80mm auto;
        margin: 0;
      }
    }
  `;

  const handleCreateTemplate = () => {
    const template = {
      ...templateForm,
      htmlTemplate: templateForm.htmlTemplate || defaultTemplates[templateForm.type] || '',
      cssStyles: templateForm.cssStyles || defaultStyles
    };
    onCreateTemplate(template);
    resetForm();
  };

  const resetForm = () => {
    setTemplateForm({
      name: '',
      type: 'factura',
      htmlTemplate: '',
      cssStyles: '',
      fields: [],
      dianCompliant: true,
      active: true
    });
    setEditingTemplate(null);
    setShowTemplateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Documentos</h1>
          <p className="text-gray-600 mt-1">Plantillas y documentos generados</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Plantilla</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Plantillas ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Documentos Generados ({documents.length})
          </button>
        </nav>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const docType = documentTypes.find(t => t.value === template.type);
            return (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{docType?.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{docType?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {template.dianCompliant && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        DIAN
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      template.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Documento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{doc.documentNumber}</td>
                    <td className="py-3 px-4 text-gray-600 capitalize">{doc.type}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.emailSent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.emailSent ? 'Enviado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-800 p-1">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 p-1">
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">
                {editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Plantilla
                  </label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento
                  </label>
                  <select
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm({...templateForm, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plantilla HTML
                </label>
                <ReactQuill
                  theme="snow"
                  value={templateForm.htmlTemplate}
                  onChange={(content) => setTemplateForm({...templateForm, htmlTemplate: content})}
                  placeholder="Ingrese el HTML de la plantilla..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image', 'code-block'],
                      ['clean']
                    ]
                  }}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilos CSS
                </label>
                <textarea
                  value={templateForm.cssStyles}
                  onChange={(e) => setTemplateForm({...templateForm, cssStyles: e.target.value})}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Ingrese los estilos CSS..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dian-compliant"
                    checked={templateForm.dianCompliant}
                    onChange={(e) => setTemplateForm({...templateForm, dianCompliant: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="dian-compliant" className="ml-2 text-sm font-medium text-gray-700">
                    Cumple normativa DIAN
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={templateForm.active}
                    onChange={(e) => setTemplateForm({...templateForm, active: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                    Plantilla Activa
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTemplate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTemplate ? 'Actualizar' : 'Crear'} Plantilla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}