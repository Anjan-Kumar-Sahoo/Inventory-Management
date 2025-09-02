import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, X, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';

interface SaleProduct {
  id: number;
  name: string;
  sellingPrice: number;
  price: number;
  quantity: number;
}

interface SelectedSaleProduct {
  id: number;
  name: string;
  sellingPrice: number;
  price: number;
  quantity: number; // quantity to sell
  available: number; // current stock
}

const SellProduct: React.FC = () => {
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedSaleProduct[]>([]);
  const [totalBill, setTotalBill] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [profitAmount, setProfitAmount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/products/sale-info')
      .then(res => res.json())
      .then((data: SaleProduct[]) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const newTotalBill = selectedProducts.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    setTotalBill(newTotalBill);
  }, [selectedProducts]);

  const handleAddProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const existingProduct = selectedProducts.find(item => item.id === productId);
      if (existingProduct) {
        setSelectedProducts(selectedProducts.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setSelectedProducts([
          ...selectedProducts,
          {
            id: product.id,
            name: product.name,
            sellingPrice: product.sellingPrice,
            price: product.price,
            quantity: 1,
            available: product.quantity
          }
        ]);
      }
      setSearchTerm('');
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setSelectedProducts(selectedProducts.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.available)) } : item
    ).filter(item => item.quantity > 0));
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(item => item.id !== productId));
  };

  const handleSell = async () => {
    setMessage(null);
    if (selectedProducts.length === 0) {
      setMessage({ type: 'error', text: 'Please add products to sell.' });
      return;
    }

    // Check for null/undefined IDs before sending
    const invalidProducts = selectedProducts.filter(item => item.id == null);
    if (invalidProducts.length > 0) {
      setMessage({ type: 'error', text: 'One or more selected products have an invalid ID.' });
      return;
    }

    try {
      const payload = selectedProducts.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));
      console.log('Sale payload:', payload); // Debug log for product IDs

      const response = await fetch('/api/sales/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setMessage({ type: 'error', text: 'Server returned an invalid response.' });
        return;
      }

      if (response.ok) {
        const profit = selectedProducts.reduce((sum, item) => sum + ((item.sellingPrice - item.price) * item.quantity), 0);
        setProfitAmount(profit);
        setShowProfitModal(true);
        // Reduce quantity in local products state
        setProducts(prevProducts => prevProducts.map(product => {
          const sold = selectedProducts.find(item => item.id === product.id);
          return sold ? { ...product, quantity: product.quantity - sold.quantity } : product;
        }));
        setSelectedProducts([]);
        setTotalBill(0);
        // Optionally re-fetch products from backend for latest stock
        fetch('/api/products/sale-info')
          .then(res => res.json())
          .then((data: SaleProduct[]) => setProducts(data))
          .catch(() => {});
        // Optionally trigger dashboard profit refresh
        if (window.dispatchEvent) {
          window.dispatchEvent(new Event('profit-updated'));
        }
      } else {
        // Show server error message if available
        setMessage({ type: 'error', text: data.error || 'Failed to record sale.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sell Products</h2>
        <p className="text-gray-600">Record new sales transactions</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Products to Sale</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search product by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && filteredProducts.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
              {filteredProducts.map(product => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span>{product.name}</span>
                  <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                  {product.quantity > 0 ? (
                    <button
                      onClick={() => handleAddProduct(product.id)}
                      className="ml-4 px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="ml-4 text-red-500 font-semibold">Out of stock</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedProducts.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Items for Sale</h3>
            <ul className="space-y-3">
              {selectedProducts.map(item => (
                <li key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.sellingPrice.toLocaleString('en-IN')} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-16 text-center border border-gray-300 rounded-md py-1"
                      min="1"
                      max={item.available}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(item.id)}
                      className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-xl font-bold text-gray-900">Total Bill:</p>
              <p className="text-xl font-bold text-blue-600">₹{totalBill.toLocaleString('en-IN')}</p>
            </div>
            <button
              onClick={handleSell}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <IndianRupee className="w-5 h-5 mr-2" />
              Finalize Sale
            </button>
          </div>
        )}
        {message && (
          <div className={`mt-4 p-3 rounded-md flex items-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            {message.text}
          </div>
        )}
      </div>
      {showProfitModal && profitAmount !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <IndianRupee className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hurray! You earned:</h2>
            <p className="text-xl text-green-700 font-semibold mb-4">a profit of ₹{profitAmount.toLocaleString('en-IN')}</p>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => { setShowProfitModal(false); setProfitAmount(null); }}
            >
              Make a New Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { SellProduct };


