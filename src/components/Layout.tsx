
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
    <div className="min-h-[100svh] w-full bg-background overflow-hidden flex flex-col">
      <Header />
      <main className={`flex-1 overflow-y-auto page-container ${isRoundActive ? 'pb-20' : 'pb-8'}`}>
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
