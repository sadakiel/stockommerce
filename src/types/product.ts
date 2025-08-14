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
  longDescription?: string;
  basePrice: number;
  baseCost: number;
  category: string;
  baseSku: string;
  images: ProductImage[];
  variants: ProductVariant[];
  taxes: string[]; // Tax IDs
  technicalSpecs: TechnicalSpec[];
  videos: ProductVideo[];
  socialMedia: SocialMediaPromotion;
  googleMerchant: GoogleMerchantData;
  seoData: SEOData;
  tenantId: string;
  active: boolean;
  // DIAN specific fields
  dianProductCode?: string;
  unidadMedida: string;
  codigoBarras?: string;
  created_at: string;
  updated_at: string;
}

export interface TechnicalSpec {
  id: string;
  name: string;
  value: string;
  unit?: string;
  category: string;
  order: number;
}

export interface ProductVideo {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'vimeo' | 'direct';
  thumbnail?: string;
  duration?: string;
  description?: string;
  order: number;
}

export interface SocialMediaPromotion {
  facebook: {
    enabled: boolean;
    postTemplate: string;
    hashtags: string[];
  };
  instagram: {
    enabled: boolean;
    postTemplate: string;
    hashtags: string[];
  };
  twitter: {
    enabled: boolean;
    postTemplate: string;
    hashtags: string[];
  };
}

export interface GoogleMerchantData {
  enabled: boolean;
  productType: string;
  googleProductCategory: string;
  brand: string;
  mpn?: string; // Manufacturer Part Number
  gtin?: string; // Global Trade Item Number
  condition: 'new' | 'used' | 'refurbished';
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';
  shippingWeight?: number;
  shippingDimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  ageGroup?: 'adult' | 'kids' | 'toddler' | 'infant' | 'newborn';
  gender?: 'male' | 'female' | 'unisex';
  color?: string;
  size?: string;
  material?: string;
  pattern?: string;
  customLabels?: string[];
}

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  slug: string;
  canonicalUrl?: string;
  structuredData?: any;
}