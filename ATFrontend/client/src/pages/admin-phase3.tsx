import React from 'react';
import { Phase3ValidationPage } from "src/components/admin/Phase3ValidationPage";

export const AdminPhase3Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Phase3ValidationPage />
      </div>
    </div>
  );
};