import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Product } from '../../types/inventory';

interface LowStockAlertProps {
  products: Product[];
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({ products }) => {
  const lowStockProducts = products.filter(product => {
    const stock = (product as any).stock ?? product.quantity;
    return stock < 10;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
        <span className="ml-4 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
          {lowStockProducts.length} item{lowStockProducts.length === 1 ? '' : 's'}
        </span>
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="text-center py-4">
          <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">All products are well stocked!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-amber-700">{(product as any).stock ?? product.quantity} left</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};