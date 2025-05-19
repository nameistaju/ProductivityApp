
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Layout/Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    
    </div>
  );
};

export default Layout;
