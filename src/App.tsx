import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { PublicStore } from './components/PublicStore';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { OnlineStore } from './components/OnlineStore';
import { POS } from './components/POS';
import { Clients } from './components/Clients';
import { PageManager } from './components/PageManager';
import { CustomizableDashboard } from './components/CustomizableDashboard';
import { AdvancedInventory } from './components/AdvancedInventory';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { ProductManager } from './components/ProductManager';
import { TaxManager } from './components/TaxManager';
import { DianConfigurationComponent } from './components/DianConfiguration';
import { DocumentManager } from './components/DocumentManager';
import { QuoteManager } from './components/QuoteManager';
import { IntegrationsManager } from './components/IntegrationsManager';
import { UserManagement } from './components/UserManagement';
import { CampaignManager } from './components/CampaignManager';
import { PhysicalInventory } from './components/PhysicalInventory';
import { SalesTeamManager } from './components/SalesTeamManager';
import { DocumentNumberingConfig } from './components/DocumentNumberingConfig';
import { EnhancedProduct, TaxType } from './types/product';
import { DianConfiguration } from './types/dian';
import { DocumentTemplate, GeneratedDocument, WhatsAppIntegration, SocialMediaIntegration } from './types/documents';
import { CustomPage, DashboardWidget, Warehouse, InventoryMovement, PhysicalCount } from './types/pages';
import { UserRole, rolePermissions, UserWithRole, CustomUserRole } from './types/roles';
import { Campaign, BannerSettings, ProductHighlight } from './types/campaigns';
import { OnlineOrder, CustomerInfo, OrderStatus, Commission } from './types/orders';
import { OrderTracking } from './components/OrderTracking';
import { CustomerSearch } from './components/CustomerSearch';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
}

// Legacy Product interface for compatibility
export interface Product extends EnhancedProduct {
  // Compatibility fields
  price: number;
  cost: number;
  stock: number;
  image: string;
}

export interface Sale {
  id: string;
  products: { product: Product; quantity: number }[];
  total: number;
  date: string;
  type: 'online' | 'pos';
  customer?: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'basic' | 'pro' | 'enterprise';
  settings: {
    storeName: string;
    currency: string;
    theme: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
  };
  active: boolean;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);
  const [physicalCounts, setPhysicalCounts] = useState<PhysicalCount[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [taxes, setTaxes] = useState<TaxType[]>([]);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([]);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppIntegration | null>(null);
  const [socialConfigs, setSocialConfigs] = useState<SocialMediaIntegration[]>([]);
  const [systemUsers, setSystemUsers] = useState<UserWithRole[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomUserRole[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [bannerSettings, setBannerSettings] = useState<BannerSettings>({
    id: '1',
    tenantId: 'tenant1',
    showBanner: true,
    autoRotate: true,
    rotationInterval: 5,
    height: 'medium',
    position: 'hero',
    showIndicators: true,
    showArrows: true,
    animationType: 'fade',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [productHighlights, setProductHighlights] = useState<ProductHighlight[]>([]);
  const [onlineOrders, setOnlineOrders] = useState<OnlineOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerInfo[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+57 300 123 4567',
      document: '12345678',
      documentType: 'CC',
      address: 'Calle 123 #45-67',
      city: 'Bogotá'
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+57 301 987 6543',
      document: '87654321',
      documentType: 'CC',
      address: 'Carrera 45 #12-34',
      city: 'Medellín'
    }
  ]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [salesTeam, setSalesTeam] = useState<any[]>([]);
  const [documentNumberings, setDocumentNumberings] = useState<any[]>([]);

  // Initialize default warehouses
  React.useEffect(() => {
    if (warehouses.length === 0) {
      setWarehouses([
        {
          id: '1',
          name: 'Almacén Principal',
          code: 'MAIN',
          address: 'Calle Principal 123',
          isMain: true,
          tenantId: 'tenant1',
          active: true
        }
      ]);
    }
  }, [warehouses.length]);

  // Mock data
  
  // Mock data
  const [enhancedProducts, setEnhancedProducts] = useState<EnhancedProduct[]>([
    {
      id: '1',
      name: 'Laptop Dell Inspiron',
      description: 'Laptop Dell Inspiron 15 con procesador Intel i5',
      basePrice: 899.99,
      baseCost: 650.00,
      category: 'Electrónicos',
      baseSku: 'LAP-DELL-001',
      images: [{
        id: '1',
        url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300',
        alt: 'Laptop Dell Inspiron',
        isPrimary: true,
        order: 0
      }],
      variants: [{
        id: '1',
        name: 'Laptop Dell Inspiron - 8GB RAM',
        sku: 'LAP-DELL-001-8GB',
        price: 899.99,
        cost: 650.00,
        stock: 25,
        attributes: { ram: '8GB', color: 'Negro' },
        active: true
      }],
      taxes: ['1'],
      tenantId: 'tenant1',
      active: true,
      unidadMedida: 'UND',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Mouse Inalámbrico',
      description: 'Mouse inalámbrico ergonómico con sensor óptico',
      basePrice: 29.99,
      baseCost: 15.00,
      category: 'Accesorios',
      baseSku: 'MOU-WIR-001',
      images: [{
        id: '2',
        url: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300',
        alt: 'Mouse Inalámbrico',
        isPrimary: true,
        order: 0
      }],
      variants: [{
        id: '2',
        name: 'Mouse Inalámbrico',
        sku: 'MOU-WIR-001',
        price: 29.99,
        cost: 15.00,
        stock: 150,
        attributes: {},
        active: true
      }],
      taxes: [],
      tenantId: 'tenant1',
      active: true,
      unidadMedida: 'UND',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Teclado Mecánico',
      description: 'Teclado mecánico RGB para gaming',
      basePrice: 129.99,
      baseCost: 80.00,
      category: 'Accesorios',
      baseSku: 'KEY-MEC-001',
      images: [{
        id: '3',
        url: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=300',
        alt: 'Teclado Mecánico',
        isPrimary: true,
        order: 0
      }],
      variants: [{
        id: '3',
        name: 'Teclado Mecánico',
        sku: 'KEY-MEC-001',
        price: 129.99,
        cost: 80.00,
        stock: 45,
        attributes: {},
      prefix: 'TKT-' + new Date().toISOString().split('T')[0] + '-',
      }],
      taxes: [],
      tenantId: 'tenant1',
      active: true,
      unidadMedida: 'UND',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  // Derived state: Convert enhanced products to legacy format for compatibility
  const products: Product[] = enhancedProducts.map(ep => ({
    ...ep,
    price: ep.variants[0]?.price || ep.basePrice,
    cost: ep.variants[0]?.cost || ep.baseCost,
    stock: ep.variants[0]?.stock || 0,
    sku: ep.variants[0]?.sku || ep.baseSku,
    image: ep.images.find(img => img.isPrimary)?.url || ep.images[0]?.url || ''
  }));

  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      products: [{ product: products[0], quantity: 2 }],
      total: 1799.98,
      date: new Date().toISOString(),
      type: 'online',
      customer: 'Juan Pérez',
      tenantId: 'tenant1'
    }
  ]);

  const [dianConfig, setDianConfig] = useState<DianConfiguration>({} as DianConfiguration);

  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 'tenant1',
      name: 'Stockommerce',
      plan: 'pro',
      settings: {
        storeName: 'Stockommerce',
        currency: 'COP',
        theme: 'blue',
        logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
        address: '123 Commerce Street, Ciudad Comercial',
        phone: '+1 234 567 8900',
        email: 'info@stockommerce.com'
      },
      active: true
    }
  ]);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication
    const user: User = {
      id: '1',
      name: 'Admin Usuario',
      email: email,
      role: 'admin',
      tenantId: 'tenant1',
      tenantName: 'Stockommerce'
    };
    setCurrentUser(user);
  };

  const handleSSOLogin = (provider: string) => {
    // Mock SSO authentication
    const user: User = {
      id: '1',
      name: `Usuario ${provider}`,
      email: `user@${provider}.com`,
      role: 'admin',
      tenantId: 'tenant1',
      tenantName: 'Stockommerce'
    };
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleBackToStore = () => {
    setShowLogin(false);
  };

  const addProduct = (product: Omit<Product, 'id' | 'tenantId'>) => {
    // Convert legacy product to enhanced format
    const newEnhancedProduct: EnhancedProduct = {
      ...product,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      basePrice: product.price,
      baseCost: product.cost,
      baseSku: product.sku,
      images: product.image ? [{
        id: '1',
        url: product.image,
        alt: product.name,
        isPrimary: true,
        order: 0
      }] : [],
      variants: [{
        id: '1',
        name: product.name,
        sku: product.sku,
        price: product.price,
        cost: product.cost,
        stock: product.stock || 0,
        attributes: {},
        active: true
      }],
      taxes: [],
      unidadMedida: 'UND',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEnhancedProducts(prev => [...prev, newEnhancedProduct]);
  };

  const addEnhancedProduct = (product: Omit<EnhancedProduct, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => {
    const newProduct: EnhancedProduct = {
      ...product,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEnhancedProducts(prev => [...prev, newProduct]);
  };
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setEnhancedProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updatedVariant = { ...p.variants[0], ...updates };
        return {
          ...p,
          variants: [updatedVariant, ...p.variants.slice(1)]
        };
      }
      return p;
    }));
  };

  const updateEnhancedProduct = (id: string, updates: Partial<EnhancedProduct>) => {
    setEnhancedProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'tenantId'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1'
    };
    setSales(prev => [...prev, newSale]);
    
    // Create commission for POS sales
    if (sale.type === 'pos' && salesTeam.length > 0) {
      const randomSeller = salesTeam[Math.floor(Math.random() * salesTeam.length)];
      const commission: Commission = {
        id: Date.now().toString(),
        userId: randomSeller.id,
        userName: randomSeller.name,
        saleId: newSale.id,
        saleAmount: sale.total,
        commissionRate: randomSeller.commissionRate,
        commissionAmount: (sale.total * randomSeller.commissionRate) / 100,
        date: new Date().toISOString(),
        tenantId: currentUser?.tenantId || 'tenant1'
      };
      setCommissions(prev => [...prev, commission]);
    }
    
    // Create order for tracking if it's an online sale
    if (sale.type === 'online') {
      const order: OnlineOrder = {
        id: Date.now().toString(),
        ticketCode: `TKT-${Date.now().toString().slice(-8)}`,
        customer: {
          name: sale.customer || 'Cliente Anónimo',
          email: 'cliente@email.com',
          phone: '+57 300 000 0000',
          document: '00000000',
          documentType: 'CC',
          address: 'Dirección no especificada',
          city: 'Ciudad'
        },
        products: sale.products,
        total: sale.total,
        currentStatus: 'pedido_realizado',
        statusHistory: [{
          id: '1',
          status: 'pedido_realizado',
          timestamp: new Date().toISOString(),
          notes: `Pedido creado por ${currentUser?.name || 'Sistema'}`
        }],
        paymentMethod: 'card',
        shippingAddress: 'Dirección de envío',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        tenantId: currentUser?.tenantId || 'tenant1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setOnlineOrders(prev => [...prev, order]);
    }
    
    // Update inventory
    sale.products.forEach(({ product, quantity }) => {
      updateProduct(product.id, { stock: product.stock - quantity });
    });
  };

  const addTax = (tax: Omit<TaxType, 'id'>) => {
    const newTax: TaxType = {
      ...tax,
      id: Date.now().toString()
    };
    setTaxes(prev => [...prev, newTax]);
  };

  const updateTax = (id: string, updates: Partial<TaxType>) => {
    setTaxes(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTax = (id: string) => {
    setTaxes(prev => prev.filter(t => t.id !== id));
  };

  const updateDianConfig = (updates: Partial<DianConfiguration>) => {
    setDianConfig(prev => ({ ...prev, ...updates }));
  };

  const addDocumentTemplate = (template: Omit<DocumentTemplate, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => {
    const newTemplate: DocumentTemplate = {
      ...template,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setDocumentTemplates(prev => [...prev, newTemplate]);
  };

  const updateDocumentTemplate = (id: string, updates: Partial<DocumentTemplate>) => {
    setDocumentTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));
  };

  const generateDocument = (templateId: string, data: any) => {
    const template = documentTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newDocument: GeneratedDocument = {
      id: Date.now().toString(),
      templateId,
      type: template.type,
      documentNumber: `${template.type.toUpperCase()}-${Date.now()}`,
      data,
      htmlContent: template.htmlTemplate,
      emailSent: false,
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString()
    };
    setGeneratedDocuments(prev => [...prev, newDocument]);
  };

  const sendDocumentEmail = (documentId: string, email: string) => {
    setGeneratedDocuments(prev => prev.map(d => d.id === documentId ? { ...d, emailSent: true } : d));
    // Here you would integrate with email service
  };

  const addQuote = (quote: any) => {
    const newQuote = {
      ...quote,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString()
    };
    setQuotes(prev => [...prev, newQuote]);
  };

  const updateQuote = (id: string, updates: any) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const sendQuoteEmail = (quoteId: string, email: string) => {
    updateQuote(quoteId, { status: 'sent' });
    // Here you would integrate with email service
  };

  const updateWhatsAppConfig = (updates: Partial<WhatsAppIntegration>) => {
    setWhatsappConfig(prev => prev ? { ...prev, ...updates } : {
      id: '1',
      tenantId: currentUser?.tenantId || 'tenant1',
      phoneNumber: '',
      apiKey: '',
      webhookUrl: '',
      aiEnabled: false,
      aiPrompt: '',
      active: false,
      ...updates
    });
  };

  const updateSocialConfig = (id: string, updates: Partial<SocialMediaIntegration>) => {
    setSocialConfigs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const createUser = (user: Omit<UserWithRole, 'id' | 'tenantId' | 'created_at'>) => {
    const newUser: UserWithRole = {
      ...user,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString()
    };
    setSystemUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<UserWithRole>) => {
    setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setSystemUsers(prev => prev.filter(u => u.id !== id));
  };

  const createRole = (role: Omit<CustomUserRole, 'id' | 'tenantId' | 'created_at'>) => {
    const newRole: CustomUserRole = {
      ...role,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString()
    };
    setCustomRoles(prev => [...prev, newRole]);
  };

  const updateRole = (id: string, updates: Partial<CustomUserRole>) => {
    setCustomRoles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRole = (id: string) => {
    setCustomRoles(prev => prev.filter(r => r.id !== id));
  };

  const addCustomPage = (page: Omit<CustomPage, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => {
    const newPage: CustomPage = {
      ...page,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCustomPages(prev => [...prev, newPage]);
  };

  const updateCustomPage = (id: string, updates: Partial<CustomPage>) => {
    setCustomPages(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  };

  const deleteCustomPage = (id: string) => {
    setCustomPages(prev => prev.filter(p => p.id !== id));
  };

  const addStock = (productId: string, warehouseId: string, quantity: number, reason: string) => {
    const movement: InventoryMovement = {
      id: Date.now().toString(),
      type: 'in',
      productId,
      toWarehouseId: warehouseId,
      quantity,
      reason,
      userId: currentUser?.id || '1',
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString()
    };
    setInventoryMovements(prev => [...prev, movement]);
    
    // Update product stock
    updateProduct(productId, { stock: (products.find(p => p.id === productId)?.stock || 0) + quantity });
  };

  const transferStock = (productId: string, fromWarehouseId: string, toWarehouseId: string, quantity: number) => {
    const movement: InventoryMovement = {
      id: Date.now().toString(),
      type: 'transfer',
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      reason: 'Transferencia entre almacenes',
      userId: currentUser?.id || '1',
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString()
    };
    setInventoryMovements(prev => [...prev, movement]);
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    // Mock implementation - in production, upload to cloud storage
    return URL.createObjectURL(file);
  };

  const createCampaign = (campaign: Omit<Campaign, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCampaigns(prev => [...prev, newCampaign]);
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const updateBannerSettings = (updates: Partial<BannerSettings>) => {
    setBannerSettings(prev => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
  };

  const createProductHighlight = (highlight: Omit<ProductHighlight, 'id' | 'tenantId'>) => {
    const newHighlight: ProductHighlight = {
      ...highlight,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1'
    };
    setProductHighlights(prev => [...prev, newHighlight]);
  };

  const updateProductHighlight = (id: string, updates: Partial<ProductHighlight>) => {
    setProductHighlights(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteProductHighlight = (id: string) => {
    setProductHighlights(prev => prev.filter(h => h.id !== id));
  };

  const createOnlineOrder = (order: Omit<OnlineOrder, 'id' | 'tenantId' | 'created_at' | 'updated_at'>) => {
    const newOrder: OnlineOrder = {
      ...order,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setOnlineOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus['status'], notes?: string) => {
    setOnlineOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newStatusEntry: OrderStatus = {
          id: Date.now().toString(),
          status,
          timestamp: new Date().toISOString(),
          notes: notes || `Estado actualizado por ${currentUser?.name || 'Usuario'}`,
          updatedBy: currentUser?.name || 'Usuario'
        };
        return {
          ...order,
          currentStatus: status,
          statusHistory: [...order.statusHistory, newStatusEntry],
          updated_at: new Date().toISOString()
        };
      }
      return order;
    }));
  };

  const createCustomer = (customer: CustomerInfo) => {
    const newCustomer: CustomerInfo = {
      ...customer,
      id: Date.now().toString()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const createSeller = (seller: any) => {
    const newSeller = {
      ...seller,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString()
    };
    setSalesTeam(prev => [...prev, newSeller]);
  };

  const updateSeller = (id: string, updates: any) => {
    setSalesTeam(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSeller = (id: string) => {
    setSalesTeam(prev => prev.filter(s => s.id !== id));
  };

  const createDocumentNumbering = (numbering: any) => {
    const newNumbering = {
      ...numbering,
      id: Date.now().toString(),
      tenantId: currentUser?.tenantId || 'tenant1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setDocumentNumberings(prev => [...prev, newNumbering]);
  };

  const updateDocumentNumbering = (id: string, updates: any) => {
    setDocumentNumberings(prev => prev.map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n));
  };

  const deleteDocumentNumbering = (id: string) => {
    setDocumentNumberings(prev => prev.filter(n => n.id !== id));
  };

  // Listen for inventory movement events from physical count
  React.useEffect(() => {
    const handleInventoryMovement = (event: any) => {
      const { detail } = event;
      const movement = {
        id: Date.now().toString(),
        type: detail.type as 'in' | 'out' | 'transfer' | 'adjustment' | 'physical_count',
        productId: detail.productId,
        toWarehouseId: detail.warehouseId,
        fromWarehouseId: detail.fromWarehouseId,
        quantity: detail.quantity,
        reason: detail.reason,
        reference: detail.reference,
        userId: currentUser?.id || '1',
        tenantId: currentUser?.tenantId || 'tenant1',
        created_at: new Date().toISOString()
      };
      setInventoryMovements(prev => [...prev, movement]);
      
      // Update product stock
      const product = products.find(p => p.id === detail.productId);
      if (product) {
        const newStock = detail.isPositive 
          ? product.stock + detail.quantity 
          : product.stock - detail.quantity;
        updateProduct(detail.productId, { stock: Math.max(0, newStock) });
      }
    };

    window.addEventListener('createInventoryMovement', handleInventoryMovement);
    return () => window.removeEventListener('createInventoryMovement', handleInventoryMovement);
  }, [currentUser, products]);
  // Show login modal if requested
  if (showLogin && !currentUser) {
    return <Login onLogin={handleLogin} onSSOLogin={handleSSOLogin} onBack={handleBackToStore} />;
  }

  // Show public store if no user is logged in
  if (!currentUser) {
    const currentTenant = tenants[0]; // Default to first tenant for public store
    const tenantProducts = products.filter(p => p.tenantId === currentTenant.id);
    const tenantCampaigns = campaigns.filter(c => c.tenantId === currentTenant.id);
    const tenantHighlights = productHighlights.filter(h => h.tenantId === currentTenant.id);
    
    return (
      <PublicStore 
        products={tenantProducts}
        tenant={currentTenant}
        campaigns={tenantCampaigns}
        bannerSettings={bannerSettings}
        productHighlights={tenantHighlights}
        onPurchase={addSale}
        onShowLogin={handleShowLogin}
      />
    );
  }

  const currentTenant = tenants.find(t => t.id === currentUser.tenantId);
  const tenantProducts = products.filter(p => p.tenantId === currentUser.tenantId);
  const tenantSales = sales.filter(s => s.tenantId === currentUser.tenantId);
  const userPermissions = rolePermissions[currentUser.role];

  // Check if current view is a custom page
  const isCustomPage = currentView.startsWith('page-');
  const customPage = isCustomPage ? customPages.find(p => p.id === currentView.replace('page-', '')) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={currentUser.role}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        customPages={customPages.filter(p => p.tenantId === currentUser.tenantId)}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentTenant?.settings.storeName}
              </h1>
              <p className="text-sm text-gray-500">
                {currentUser.name} - {currentUser.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentView === 'dashboard' && userPermissions.dashboard && (
            <Dashboard
              user={currentUser}
              products={tenantProducts}
              sales={tenantSales}
              tenant={currentTenant!}
              quotes={quotes.filter(q => q.tenantId === currentUser.tenantId)}
              commissions={commissions.filter(c => c.tenantId === currentUser.tenantId)}
            />
          )}
          {currentView === 'inventory' && userPermissions.inventory && (
            <AdvancedInventory
              products={tenantProducts}
              warehouses={warehouses.filter(w => w.tenantId === currentUser.tenantId)}
              movements={inventoryMovements.filter(m => m.tenantId === currentUser.tenantId)}
              physicalCounts={physicalCounts.filter(pc => pc.tenantId === currentUser.tenantId)}
              onAddStock={addStock}
              onTransferStock={transferStock}
              onCreatePhysicalCount={(count) => {
                const newCount: PhysicalCount = {
                  ...count,
                  id: Date.now().toString(),
                  tenantId: currentUser.tenantId
                };
                setPhysicalCounts(prev => [...prev, newCount]);
              }}
              onAddWarehouse={(warehouse) => {
                const newWarehouse: Warehouse = {
                  ...warehouse,
                  id: Date.now().toString(),
                  tenantId: currentUser.tenantId
                };
                setWarehouses(prev => [...prev, newWarehouse]);
              }}
            />
          )}
          {currentView === 'products' && userPermissions.products && (
            <ProductManager
              products={enhancedProducts.filter(p => p.tenantId === currentUser.tenantId)}
              taxes={taxes}
              currency={currentTenant?.settings.currency || 'USD'}
              onAddProduct={addEnhancedProduct}
              onUpdateProduct={updateEnhancedProduct}
              onUploadImage={uploadProductImage}
            />
          )}
          {currentView === 'sales' && userPermissions.sales && (
            <OnlineStore
              products={tenantProducts}
              tenant={currentTenant!}
              onPurchase={addSale}
              onCreateOrder={createOnlineOrder}
              customers={customers}
              onCreateCustomer={createCustomer}
            />
          )}
          {currentView === 'pos' && userPermissions.pos && (
            <POS
              products={tenantProducts}
              onSale={addSale}
              tenantSettings={currentTenant?.settings}
              currentUser={currentUser}
              customers={customers}
              onCreateCustomer={createCustomer}
            />
          )}
          {currentView === 'orders' && userPermissions.sales && (
            <OrderTracking
              orders={onlineOrders.filter(o => o.tenantId === currentUser.tenantId)}
              recentSales={tenantSales.slice().reverse().slice(0, 20)}
              onUpdateOrderStatus={updateOrderStatus}
            />
          )}
          {currentView === 'reports' && userPermissions.reports && (
            <Reports
              sales={tenantSales}
              products={tenantProducts}
            />
          )}
          {currentView === 'taxes' && userPermissions.taxes && (
            <TaxManager
              taxes={taxes}
              onAddTax={addTax}
              onUpdateTax={updateTax}
              onDeleteTax={deleteTax}
            />
          )}
          {currentView === 'dian' && userPermissions.dian && (
            <DianConfigurationComponent
              configuration={dianConfig}
              onUpdateConfiguration={updateDianConfig}
            />
          )}
          {currentView === 'clients' && userPermissions.clients && (
            <Clients
              tenants={tenants}
              onUpdateTenant={(id, updates) => {
                setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
              }}
            />
          )}
          {currentView === 'pages' && userPermissions.settings && (
            <PageManager
              pages={customPages.filter(p => p.tenantId === currentUser.tenantId)}
              onCreatePage={addCustomPage}
              onUpdatePage={updateCustomPage}
              onDeletePage={deleteCustomPage}
            />
          )}
          {currentView === 'settings' && userPermissions.settings && (
            <Settings
              tenant={currentTenant}
              documentNumberings={documentNumberings.filter(n => n.tenantId === currentUser.tenantId)}
              onCreateNumbering={createDocumentNumbering}
              onUpdateNumbering={updateDocumentNumbering}
              onDeleteNumbering={deleteDocumentNumbering}
              onUpdateTenant={(updates) => {
                setTenants(prev => prev.map(t => 
                  t.id === currentUser.tenantId ? { ...t, ...updates } : t
                ));
              }}
            />
          )}
          {currentView === 'sales-team' && userPermissions.userManagement && (
            <SalesTeamManager
              salesTeam={salesTeam.filter(s => s.tenantId === currentUser.tenantId)}
              commissions={commissions.filter(c => c.tenantId === currentUser.tenantId)}
              sales={tenantSales}
              onCreateSeller={createSeller}
              onUpdateSeller={updateSeller}
              onDeleteSeller={deleteSeller}
            />
          )}
          {currentView === 'numbering' && userPermissions.settings && (
            <DocumentNumberingConfig
              numberings={documentNumberings.filter(n => n.tenantId === currentUser.tenantId)}
              onCreateNumbering={createDocumentNumbering}
              onUpdateNumbering={updateDocumentNumbering}
              onDeleteNumbering={deleteDocumentNumbering}
            />
          )}
          {currentView === 'documents' && userPermissions.documents && (
            <DocumentManager
              templates={documentTemplates.filter(t => t.tenantId === currentUser.tenantId)}
              documents={generatedDocuments.filter(d => d.tenantId === currentUser.tenantId)}
              onCreateTemplate={addDocumentTemplate}
              onUpdateTemplate={updateDocumentTemplate}
              onGenerateDocument={generateDocument}
              onSendEmail={sendDocumentEmail}
            />
          )}
          {currentView === 'quotes' && userPermissions.quotes && (
            <QuoteManager
              products={tenantProducts}
              quotes={quotes.filter(q => q.tenantId === currentUser.tenantId)}
              onCreateQuote={addQuote}
              onUpdateQuote={updateQuote}
              onSendQuote={sendQuoteEmail}
              customers={customers}
              onCreateCustomer={createCustomer}
            />
          )}
          {currentView === 'integrations' && userPermissions.integrations && (
            <IntegrationsManager
              whatsappConfig={whatsappConfig}
              socialConfigs={socialConfigs.filter(s => s.tenantId === currentUser.tenantId)}
              onUpdateWhatsApp={updateWhatsAppConfig}
              onUpdateSocial={updateSocialConfig}
            />
          )}
          {currentView === 'users' && userPermissions.userManagement && (
            <UserManagement
              users={systemUsers.filter(u => u.tenantId === currentUser.tenantId)}
              customRoles={customRoles.filter(r => r.tenantId === currentUser.tenantId)}
              onCreateUser={createUser}
              onUpdateUser={updateUser}
              onDeleteUser={deleteUser}
              onCreateRole={createRole}
              onUpdateRole={updateRole}
              onDeleteRole={deleteRole}
            />
          )}
          {currentView === 'campaigns' && userPermissions.settings && (
            <CampaignManager
              campaigns={campaigns.filter(c => c.tenantId === currentUser.tenantId)}
              bannerSettings={bannerSettings}
              productHighlights={productHighlights.filter(h => h.tenantId === currentUser.tenantId)}
              products={tenantProducts}
              onCreateCampaign={createCampaign}
              onUpdateCampaign={updateCampaign}
              onDeleteCampaign={deleteCampaign}
              onUpdateBannerSettings={updateBannerSettings}
              onCreateProductHighlight={createProductHighlight}
              onUpdateProductHighlight={updateProductHighlight}
              onDeleteProductHighlight={deleteProductHighlight}
            />
          )}
          
          {/* Custom Pages */}
          {isCustomPage && customPage && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{customPage.title}</h1>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: customPage.content }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;