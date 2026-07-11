import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  Scissors,
  UserCheck,
  Gift,
  GraduationCap,
  Image,
  MessageSquare,
  LineChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  activeTab,
  setActiveTab,
  cancelEdit,
  handleLogout,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "bookings", label: "Bookings", icon: ClipboardList },
    { id: "customers", label: "Customers", icon: Users },
    { id: "services", label: "Services", icon: Scissors },
    { id: "staff", label: "Staff", icon: UserCheck },
    { id: "offers", label: "Offers", icon: Gift },
    { id: "courses", label: "Academy", icon: GraduationCap },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "reports", label: "Reports", icon: LineChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleTabClick = (tabId) => {
    if (cancelEdit) cancelEdit();
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-[#070b16] overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0">
        
        {/* Logo block */}
        <div className={`flex items-center gap-3 border-b border-white/5 pb-5 mt-2 shrink-0 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="p-1.5 rounded-xl bg-[#ec4899]/10 text-[#ec4899] shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11.5 5 9 8.5 6 9.5c3-1 5.5-4 6-7.5zm0 0c.5 3.5 3 6.5 6 7.5-3-1-5.5-4-6-7.5zM6 9.5c-2.5 1-4 3.5-4 6.5 2.5-1.5 3.5-4 4-6.5zm12 0c2.5 1 4 3.5 4 6.5-2.5-1.5-3.5-4-4-6.5zM12 9c-1.5 2.5-3 5.5-3 8.5 1.5-1.5 2.5-4 3-8.5zm0 0c1.5 2.5 3 5.5 3 8.5-1.5-1.5-2.5-4-3-8.5zM5 17c0 2.5 3 4.5 7 4.5s7-2 7-4.5H5z"/>
            </svg>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-base font-bold font-serif text-white uppercase tracking-wider leading-none">
                Mayleki
              </h2>
              <span className="text-[9px] uppercase tracking-widest text-[#ec4899] font-sans font-black">
                Studio & Academy
              </span>
            </div>
          )}
        </div>

        {/* Admin profile widget */}
        <div className={`bg-[#111827] border border-white/8 rounded-2xl p-3.5 flex items-center gap-3 mt-4 shrink-0 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="relative shrink-0">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=admin-mayleki"
              alt="Admin Profile"
              className="w-9 h-9 rounded-full bg-pink-100 border border-[#ec4899] p-0.5 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#111827]"></span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-white tracking-wide truncate">Admin</h4>
              <p className="text-[8px] text-[#a1a1aa] font-semibold flex items-center gap-0.5 mt-0.5 uppercase tracking-wider truncate">
                Administrator
                <span className="text-[#ec4899]">✔</span>
              </p>
            </div>
          )}
        </div>

        {/* Navigation list - Scrollable area */}
        <nav className="space-y-1 mt-5 flex-1 overflow-y-auto pr-1 -mr-1 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-[12px] font-bold transition-all flex items-center relative gap-3 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#ec4899]/10 text-[#ec4899] border-l-2 border-[#ec4899]"
                    : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={15} className="shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upgrade business and Logout block - Fixed bottom */}
      <div className="space-y-5 border-t border-white/5 pt-4 mt-4 shrink-0">
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-[#411b33] to-[#120822] border border-[#522241]/30 p-3.5 rounded-xl space-y-2 relative overflow-hidden">
            <div>
              <h5 className="text-[10px] font-bold text-white tracking-wide">Upgrade Your Business</h5>
              <p className="text-[8px] text-[#a1a1aa] leading-tight mt-0.5">Explore premium features to grow your salon</p>
            </div>
            <button className="w-full bg-gradient-to-r from-[#d946ef] to-[#ec4899] text-white py-1.5 rounded-xl text-[9px] uppercase font-bold tracking-widest hover:opacity-95 transition-opacity cursor-pointer">
              Upgrade Now
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full bg-[#111827] border border-white/8 hover:bg-[#1c1a26] text-gray-300 hover:text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            isCollapsed ? "px-0" : ""
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={13} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );


  return (
    <>
      {/* A. Desktop Sidebar Panel */}
      <motion.aside
        animate={{ width: isCollapsed ? 76 : 288 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col border-r border-white/5 bg-[#070b16] shrink-0 h-screen sticky top-0"
      >
        {/* Toggle Collapse bar on desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-24 -right-3 w-6 h-6 bg-[#111827] border border-white/8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-zinc-800 transition z-40 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
        {sidebarContent}
      </motion.aside>

      {/* B. Mobile Drawer Sidebar (with Slide-in Drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Mobile Drawer panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#070b16] z-50 lg:hidden border-r border-white/5 shadow-2xl h-screen"
            >
              {/* Close drawer icon */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition z-50 cursor-pointer"
              >
                <X size={16} />
              </button>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
