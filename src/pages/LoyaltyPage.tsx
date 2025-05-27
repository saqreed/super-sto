import React from 'react';
import LoyaltyDashboard from '../components/Loyalty/LoyaltyDashboard';

const LoyaltyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoyaltyDashboard />
      </div>
    </div>
  );
};

export default LoyaltyPage; 