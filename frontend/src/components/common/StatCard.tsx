import React from 'react';
import { IndianRupee } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: typeof IndianRupee;
  color: 'blue' | 'green' | 'amber' | 'red';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-500',
    text: 'text-green-600'
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-500',
    text: 'text-amber-600'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-500',
    text: 'text-red-600'
  }
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const styles = colorStyles[color];

  return (
    <div className={`${styles.bg} p-6 rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${styles.text}`}>{value}</p>
        </div>
        <div className={`${styles.iconBg} p-3 rounded-lg`}>
          {/* Always use IndianRupee icon for currency/stat cards */}
          <IndianRupee className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};