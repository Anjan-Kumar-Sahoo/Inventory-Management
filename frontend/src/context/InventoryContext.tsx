import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from './api';
import { Product, Supplier, InventoryStats } from '../types/inventory';

interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getInventoryStats: () => InventoryStats;
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
  type DeleteSupplierError = string | {
    main: string;
    products: string[];
    instruction: string;
  } | null;
  const [deleteSupplierError, setDeleteSupplierError] = useState<DeleteSupplierError>(null);

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

  const deleteSupplier = (id: string) => {
    api.deleteSupplier(id).then(success => {
      if (success) {
        setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      } else {
        setDeleteSupplierError('Failed to delete supplier.');
      }
    });
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
      deleteProduct,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      getInventoryStats
    }}>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {deleteSupplierError && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-lg">
            {typeof deleteSupplierError === 'string' ? (
              <p className="text-red-600 font-semibold mb-2">{deleteSupplierError}</p>
            ) : (
              <>
                <p className="text-red-600 font-semibold mb-2">{deleteSupplierError.main}</p>
                <div className="mb-2">
                  <span className="font-semibold">Linked products:</span>
                  <ul className="list-disc list-inside text-red-600">
                    {deleteSupplierError.products.map((name: string, idx: number) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-red-600 font-semibold mb-2">{deleteSupplierError.instruction}</p>
              </>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded mt-4" onClick={() => setDeleteSupplierError(null)}>OK</button>
          </div>
        </div>
      )}
      {children}
    </InventoryContext.Provider>
  );
};