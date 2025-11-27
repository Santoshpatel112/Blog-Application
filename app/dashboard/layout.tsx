import React from 'react';
import LeftSidebar from '@/components/dashboard/leftsidebar';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <LeftSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default layout;