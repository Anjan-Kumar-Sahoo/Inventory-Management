import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from './api';
import { Product, Supplier, InventoryStats } from '../types/inventory';

interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  updateProductsStock: (updates: Array<{ id: string; stock: number }>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getInventoryStats: () => InventoryStats;
  supplierDeleteError: { message: string; supplierId?: string } | null;
  clearSupplierDeleteError: () => void;
  filterBySupplierId: string | null;
  setFilterBySupplierId: (id: string | null) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierDeleteError, setSupplierDeleteError] = useState<{ message: string; supplierId?: string } | null>(null);
  const [filterBySupplierId, setFilterBySupplierId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [productsData, suppliersData] = await Promise.all([
          api.fetchProducts(),
          api.fetchSuppliers()
        ]);
        // Normalize product fields for frontend
          const normalizedProducts = productsData.map(p => ({
            ...p,
            quantity: (p as any).stock ?? 0,
            supplierId: (p as any).supplier?.id ?? '',
            supplierName: (p as any).supplier?.name ?? 'Unknown Supplier',
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(0),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(0),
          }));
        setProducts(normalizedProducts);
        setSuppliers(suppliersData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    // Prepare request body for backend: stock and supplierId
    const normalized: any = {
      ...productData,
      stock: (productData as any).stock ?? productData.quantity ?? 0,
      supplierId: productData.supplierId ?? (productData as any).supplier_id ?? '',
    };
    if ('quantity' in normalized) delete normalized.quantity;
    api.addProduct(normalized).then(newProduct => {
      setProducts(prev => [...prev, {
        ...newProduct,
        quantity: newProduct.quantity ?? (newProduct as any).stock ?? 0,
        supplierId: newProduct.supplierId ?? (newProduct as any).supplier_id ?? '',
        createdAt: newProduct.createdAt ? new Date(newProduct.createdAt) : new Date(0),
        updatedAt: newProduct.updatedAt ? new Date(newProduct.updatedAt) : new Date(0),
      }]);
    });
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    // Prepare request body for backend: stock and supplierId
    const normalized: any = {
      ...productData,
      stock: (productData as any).stock ?? productData.quantity ?? 0,
      supplierId: productData.supplierId ?? (productData as any).supplier_id ?? '',
    };
    if ('quantity' in normalized) delete normalized.quantity;
    api.updateProduct(id, normalized).then(async () => {
      // Refetch products after update
      const productsData = await api.fetchProducts();
      const normalizedProducts = productsData.map(p => ({
        ...p,
        quantity: (p as any).stock ?? 0,
        supplierId: (p as any).supplier?.id ?? '',
        supplierName: (p as any).supplier?.name ?? 'Unknown Supplier',
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(0),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(0),
      }));
      setProducts(normalizedProducts);
    });
  };

  const updateProductsStock = (updates: Array<{ id: string; stock: number }>) => {
    // Batch update products stock from sale response
    setProducts(prevProducts => 
      prevProducts.map(product => {
        const update = updates.find(u => u.id === product.id);
        return update ? { ...product, quantity: update.stock } : product;
      })
    );
  };

  const deleteProduct = (id: string) => {
    api.deleteProduct(id).then(() => {
      setProducts(prev => prev.filter(product => product.id !== id));
    });
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    if (!supplierData.name || !supplierData.contactPerson) {
      setError('Supplier name and contact person are required.');
      return;
    }
    api.addSupplier(supplierData).then(newSupplier => {
      setSuppliers(prev => [...prev, newSupplier]);
    });
  };

  const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    api.updateSupplier(id, supplierData).then(updated => {
      setSuppliers(prev => prev.map(supplier => supplier.id === id ? updated : supplier));
    });
  };

  const deleteSupplier = async (id: string) => {
    const result = await api.deleteSupplier(id);
    
    if (result.success) {
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      setSupplierDeleteError(null);
    } else {
      // Handle 409 Conflict or other errors
      setSupplierDeleteError({
        message: result.message || 'Failed to delete supplier',
        supplierId: id
      });
    }
  };

  const clearSupplierDeleteError = () => {
    setSupplierDeleteError(null);
  };

  const getInventoryStats = (): InventoryStats => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * ((product as any).stock ?? product.quantity)), 0);
    const lowStockItems = products.filter(product => ((product as any).stock ?? product.quantity) < 10).length;
    const outOfStockItems = products.filter(product => ((product as any).stock ?? product.quantity) === 0).length;

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems
    };
  };

  return (
    <InventoryContext.Provider value={{
      products,
      suppliers,
      addProduct,
      updateProduct,
      updateProductsStock,
      deleteProduct,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      getInventoryStats,
      supplierDeleteError,
      clearSupplierDeleteError,
      filterBySupplierId,
      setFilterBySupplierId
    }}>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {children}
    </InventoryContext.Provider>
  );
};