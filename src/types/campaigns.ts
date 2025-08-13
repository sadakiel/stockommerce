export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  textColor: string;
  startDate: string;
  endDate: string;
  active: boolean;
  priority: number;
  targetAudience: 'all' | 'new' | 'returning';
  tenantId: string;
  created_at: string;
  updated_at: string;
}

export interface BannerSettings {
  id: string;
  tenantId: string;
  showBanner: boolean;
  autoRotate: boolean;
  rotationInterval: number; // seconds
  height: 'small' | 'medium' | 'large';
  position: 'top' | 'hero' | 'middle';
  showIndicators: boolean;
  showArrows: boolean;
  animationType: 'fade' | 'slide' | 'none';
  created_at: string;
  updated_at: string;
}

export interface ProductHighlight {
  id: string;
  productId: string;
  title: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  discountPercentage?: number;
  specialPrice?: number;
  startDate: string;
  endDate: string;
  active: boolean;
  tenantId: string;
}