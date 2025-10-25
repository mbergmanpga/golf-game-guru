import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isRoundActive = location.pathname.includes('/round');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className={`flex-1 overflow-y-auto p-4 ${isRoundActive ? 'pb-20' : 'pb-8'}`}>
        <div className="max-w-4xl w-full mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
