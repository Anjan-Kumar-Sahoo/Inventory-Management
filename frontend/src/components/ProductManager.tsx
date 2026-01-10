import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { ProductTable } from './products/ProductTable';
import { ProductForm } from './products/ProductForm';
import { SearchFilter } from './common/SearchFilter';
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

  // Get supplier name for the filter badge
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your inventory and product catalog</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Supplier Filter Badge */}
      {filteredSupplierName && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-800">
            Filtered by supplier: <span className="font-semibold">{filteredSupplierName}</span>
          </span>
          <button
            onClick={() => setFilterBySupplierId(null)}
            className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear Filter
          </button>
        </div>
      )}

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />

      {showForm ? (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={deleteProduct}
        />
      )}
    </div>
  );
};