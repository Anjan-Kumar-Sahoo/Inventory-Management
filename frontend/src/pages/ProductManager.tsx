import React, { useState } from 'react';
import { Plus, Box, Filter, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { ProductTable } from '../components/products/ProductTable';
import { ProductForm } from '../components/products/ProductForm';
import { SearchFilter } from '../components/common/SearchFilter';
import { Product } from '../types/inventory';

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, suppliers, filterBySupplierId, setFilterBySupplierId } = useInventory();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesSupplier = !filterBySupplierId || product.supplierId === filterBySupplierId;
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  const filteredSupplierName = filterBySupplierId
    ? suppliers.find(s => s.id === filterBySupplierId)?.name
    : null;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#BDF4FF] to-transparent rounded-full opacity-50"></div>
          <div className="flex items-center gap-2 text-[#BDF4FF] mb-2">
            <Box className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Module: Products</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-[#DFE2F3] uppercase">
            Product <span className="text-[#BDF4FF] neon-text-secondary">Management</span>
          </h2>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="space-y-4">
        {filteredSupplierName && (
          <div className="flex items-center gap-3 p-4 glass-card border-[rgba(189,244,255,0.1)] bg-[rgba(189,244,255,0.02)]">
            <Filter className="w-4 h-4 text-[#BDF4FF]" />
            <span className="text-xs font-semibold text-[#BDF4FF] uppercase tracking-wider">
              Filtered by Supplier: <span className="text-white drop-shadow-[0_0_8px_rgba(189,244,255,0.5)]">{filteredSupplierName}</span>
            </span>
            <button
              onClick={() => setFilterBySupplierId(null)}
              className="ml-auto p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors"
            >
              <X className="w-4 h-4 text-[#CBC3D9]" />
            </button>
          </div>
        )}

        <div className="glass-card p-4 border-[rgba(255,255,255,0.02)]">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {showForm ? (
          <div className="glass-card p-8 border-[rgba(205,189,255,0.1)] relative z-20">
            <ProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="glass-card border-[rgba(255,255,255,0.03)] overflow-hidden">
            <div className="bg-[rgba(255,255,255,0.02)] px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#CBC3D9] uppercase tracking-[0.2em]">Product List</span>
              <span className="text-[10px] font-bold text-[#BDF4FF] bg-[rgba(189,244,255,0.1)] px-2 py-0.5 rounded-full ring-1 ring-[#BDF4FF]/20">{filteredProducts.length} PRODUCTS</span>
            </div>
            <ProductTable
              products={filteredProducts}
              onEdit={handleEdit}
              onDelete={deleteProduct}
            />
          </div>
        )}
      </div>
    </div>
  );
};