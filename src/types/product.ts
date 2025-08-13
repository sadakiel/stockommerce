export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  attributes: { [key: string]: string }; // color: "rojo", size: "M"
  image?: string;
  active: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface TaxType {
  id: string;
  name: string;
  rate: number;
  type: 'IVA' | 'ICA' | 'RETEFUENTE' | 'RETEICA' | 'CONSUMO';
  dianCode: string;
  active: boolean;
}

export interface EnhancedProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  baseCost: number;
  category: string;
  baseSku: string;
  images: ProductImage[];
  variants: ProductVariant[];
  taxes: string[]; // Tax IDs
  tenantId: string;
  active: boolean;
  // DIAN specific fields
  dianProductCode?: string;
  unidadMedida: string;
  codigoBarras?: string;
  created_at: string;
  updated_at: string;
}