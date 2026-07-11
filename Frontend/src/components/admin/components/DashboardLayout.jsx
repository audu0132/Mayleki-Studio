import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({
  children,
  activeTab,
  setActiveTab,
  cancelEdit,
  handleLogout,
  onQuickAdd,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0b1120] text-[#f4f4f5] font-sans selection:bg-[#ec4899] selection:text-white overflow-hidden">
      
      {/* Collapsible desktop and sliding mobile Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cancelEdit={cancelEdit}
        handleLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <Topbar
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
          onQuickAdd={onQuickAdd}
        />

        {/* Content Children wrapper - Scrolls separately */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;
