// src/layouts/GuruLayout.jsx
import React from "react";
import SidebarGuru from "../components/SidebarGuru";
import Footer from "../components/footer";

export default function GuruLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Component */}
      <SidebarGuru />

      {/* Main Content Area */}
      <main className="flex flex-col flex-1 min-h-screen transition-all duration-300">
        <div className="flex-1 p-6 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
          
          {/* Header Section */}
          {(title || subtitle) && (
            <header className="mb-8 md:mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 flex items-center gap-4 tracking-tight">
                {title}
              </h1>
              
              {subtitle && (
                <p className="mt-2 text-base md:text-lg text-slate-500 font-medium max-w-2xl">
                  {subtitle}
                </p>
              )}
              
              {/* Decorative Divider */}
              <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mt-5 opacity-80"></div>
            </header>
          )}

          {/* Children Content Wrapper (Card Style) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 min-h-[60vh]">
            {children}
          </div>
          
        </div>

        {/* Footer pushed to the bottom */}
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  );
}