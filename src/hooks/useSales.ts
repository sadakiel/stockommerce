import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sale } from '../App';

export function useSales(tenantId: string) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenantId) {
      fetchSales();
    }
  }, [tenantId]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSales(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching sales');
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'tenantId'>, userId: string) => {
    try {
      // Start a transaction to update stock and create sale
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          ...sale,
          tenant_id: tenantId,
          user_id: userId
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      // Update product stock
      for (const item of sale.products) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: item.product.stock - item.quantity 
          })
          .eq('id', item.product.id)
          .eq('tenant_id', tenantId);

        if (stockError) throw stockError;
      }

      setSales(prev => [saleData, ...prev]);
      return { success: true, data: saleData };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating sale';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    sales,
    loading,
    error,
    addSale,
    refetch: fetchSales
  };
}