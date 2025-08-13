export interface SystemSettings {
  id: string;
  tenantId: string;
  defaultCurrency: string;
  availableCurrencies: Currency[];
  language: 'es' | 'en';
  dateFormat: string;
  timeZone: string;
  created_at: string;
  updated_at: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to base currency
  active: boolean;
}

export interface Translation {
  [key: string]: {
    es: string;
    en: string;
  };
}

export const translations: Translation = {
  // Navigation
  dashboard: { es: 'Dashboard', en: 'Dashboard' },
  inventory: { es: 'Inventario', en: 'Inventory' },
  products: { es: 'Productos', en: 'Products' },
  sales: { es: 'Ventas Online', en: 'Online Sales' },
  orders: { es: 'Seguimiento Pedidos', en: 'Order Tracking' },
  pos: { es: 'POS Local', en: 'Local POS' },
  quotes: { es: 'Cotizaciones', en: 'Quotes' },
  reports: { es: 'Reportes', en: 'Reports' },
  documents: { es: 'Documentos', en: 'Documents' },
  taxes: { es: 'Impuestos', en: 'Taxes' },
  campaigns: { es: 'Campañas', en: 'Campaigns' },
  integrations: { es: 'Integraciones', en: 'Integrations' },
  clients: { es: 'Clientes', en: 'Clients' },
  pages: { es: 'Páginas', en: 'Pages' },
  users: { es: 'Usuarios', en: 'Users' },
  settings: { es: 'Configuración', en: 'Settings' },
  
  // Common actions
  add: { es: 'Agregar', en: 'Add' },
  edit: { es: 'Editar', en: 'Edit' },
  delete: { es: 'Eliminar', en: 'Delete' },
  save: { es: 'Guardar', en: 'Save' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  search: { es: 'Buscar', en: 'Search' },
  filter: { es: 'Filtrar', en: 'Filter' },
  export: { es: 'Exportar', en: 'Export' },
  
  // Product management
  productName: { es: 'Nombre del Producto', en: 'Product Name' },
  description: { es: 'Descripción', en: 'Description' },
  price: { es: 'Precio', en: 'Price' },
  cost: { es: 'Costo', en: 'Cost' },
  stock: { es: 'Stock', en: 'Stock' },
  category: { es: 'Categoría', en: 'Category' },
  sku: { es: 'SKU', en: 'SKU' },
  active: { es: 'Activo', en: 'Active' },
  inactive: { es: 'Inactivo', en: 'Inactive' },
  
  // Sales
  total: { es: 'Total', en: 'Total' },
  subtotal: { es: 'Subtotal', en: 'Subtotal' },
  tax: { es: 'Impuesto', en: 'Tax' },
  customer: { es: 'Cliente', en: 'Customer' },
  date: { es: 'Fecha', en: 'Date' },
  
  // Store
  addToCart: { es: 'Agregar al Carrito', en: 'Add to Cart' },
  cart: { es: 'Carrito', en: 'Cart' },
  checkout: { es: 'Finalizar Compra', en: 'Checkout' },
  welcomeMessage: { es: 'Bienvenido a', en: 'Welcome to' },
  bestProducts: { es: 'Encuentra los mejores productos al mejor precio', en: 'Find the best products at the best price' },
  
  // Categories
  allCategories: { es: 'Todas las categorías', en: 'All categories' },
  electronics: { es: 'Electrónicos', en: 'Electronics' },
  accessories: { es: 'Accesorios', en: 'Accessories' },
  
  // Order status
  orderPlaced: { es: 'Pedido Realizado', en: 'Order Placed' },
  inPreparation: { es: 'En Alistamiento', en: 'In Preparation' },
  paymentConfirmed: { es: 'Pago Confirmado', en: 'Payment Confirmed' },
  shipped: { es: 'Enviado', en: 'Shipped' },
  withCarrier: { es: 'Con Transportador', en: 'With Carrier' },
  delivered: { es: 'Entregado', en: 'Delivered' },
  
  // Filters
  recentOffers: { es: 'Ofertas Recientes', en: 'Recent Offers' },
  oldestOffers: { es: 'Ofertas Antiguas', en: 'Oldest Offers' },
  priceHighToLow: { es: 'Precio: Mayor a Menor', en: 'Price: High to Low' },
  priceLowToHigh: { es: 'Precio: Menor a Mayor', en: 'Price: Low to High' },
  
  // Physical inventory
  physicalCount: { es: 'Conteo Físico', en: 'Physical Count' },
  searchProducts: { es: 'Buscar Productos', en: 'Search Products' },
  productsCounted: { es: 'Productos Contados', en: 'Products Counted' },
  systemStock: { es: 'Stock Sistema', en: 'System Stock' },
  countedStock: { es: 'Stock Contado', en: 'Counted Stock' },
  difference: { es: 'Diferencia', en: 'Difference' },
  
  // Dashboard
  totalRevenue: { es: 'Ingresos Totales', en: 'Total Revenue' },
  totalOrders: { es: 'Órdenes Totales', en: 'Total Orders' },
  activeProducts: { es: 'Productos Activos', en: 'Active Products' },
  lowStock: { es: 'Stock Bajo', en: 'Low Stock' },
  recentSales: { es: 'Ventas Recientes', en: 'Recent Sales' },
  recentQuotes: { es: 'Cotizaciones Recientes', en: 'Recent Quotes' },
  dailyCommissions: { es: 'Comisiones del Día', en: 'Daily Commissions' }
};