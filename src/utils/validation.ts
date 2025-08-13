import { z } from 'zod';

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  cost: z.number().min(0, 'Cost must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU too long'),
  image: z.string().url('Invalid image URL'),
  active: z.boolean()
});

// User validation schema
export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'employee']),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Tenant validation schema
export const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  plan: z.enum(['basic', 'pro', 'enterprise']),
  settings: z.object({
    storeName: z.string().min(1, 'Store name is required'),
    currency: z.string().length(3, 'Currency must be 3 characters'),
    theme: z.string(),
    logo: z.string().url('Invalid logo URL'),
    address: z.string().max(200, 'Address too long'),
    phone: z.string().max(20, 'Phone too long'),
    email: z.string().email('Invalid email address')
  })
});

// Sale validation schema
export const saleSchema = z.object({
  products: z.array(z.object({
    product: productSchema,
    quantity: z.number().int().min(1, 'Quantity must be at least 1')
  })).min(1, 'At least one product is required'),
  total: z.number().min(0.01, 'Total must be greater than 0'),
  type: z.enum(['online', 'pos']),
  customer: z.string().optional()
});

// Validation helper functions
export function validateProduct(data: unknown) {
  return productSchema.safeParse(data);
}

export function validateUser(data: unknown) {
  return userSchema.safeParse(data);
}

export function validateTenant(data: unknown) {
  return tenantSchema.safeParse(data);
}

export function validateSale(data: unknown) {
  return saleSchema.safeParse(data);
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}