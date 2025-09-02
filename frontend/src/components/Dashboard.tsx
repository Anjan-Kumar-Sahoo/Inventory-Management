import React from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { StatCard } from './common/StatCard';

import { LowStockAlert } from './dashboard/LowStockAlert';
import { ProfitDisplay } from './dashboard/ProfitDisplay';
// import { InventoryChart } from './dashboard/InventoryChart';

export const Dashboard: React.FC = () => {
  const { getInventoryStats, products } = useInventory();
  const stats = getInventoryStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your inventory and business metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Inventory Value"
          value={`₹${stats.totalValue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems.toString()}
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStockItems.toString()}
          icon={TrendingUp}
          color="red"
        />
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <LowStockAlert products={products} />
        </div>
        <div>
          <ProfitDisplay />
        </div>

      </div>
    </div>
  );
};