import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu, Moon, Sun, Plus, Sparkles, Check, LogOut, Settings } from "lucide-react";
import logo from "../../../assets/logo.png";

const Topbar = ({
  onToggleMobile,
  onQuickAdd,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Booking Request",
      message: "Sarah Connor requested Balayage & Blow Dry.",
      time: "5m ago",
      type: "booking",
      unread: true,
    },
    {
      id: 2,
      title: "New Testimonial",
      message: "David Miller submitted a 5-star review.",
      time: "2h ago",
      type: "review",
      unread: true,
    },
    {
      id: 3,
      title: "Low Inventory Alert",
      message: "Hair Color 'Ash Blonde 9.1' is below threshold.",
      time: "1d ago",
      type: "inventory",
      unread: false,
    },
    {
      id: 4,
      title: "Payout Completed",
      message: "Weekly payout of $1,240.50 transferred.",
      time: "2d ago",
      type: "billing",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <header className="h-20 border-b border-slate-200 dark:border-white/5 px-6 md:px-8 flex items-center justify-between shrink-0 bg-white/90 dark:bg-[#070b16]/90 backdrop-blur-md sticky top-0 z-30">
      
      {/* Left side: Hamburguer + Search */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Toggle Hamburger button for mobile */}
        <button
          onClick={onToggleMobile}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden transition cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Search with Ctrl+K Keyboard Badge */}
        <div className="relative max-w-md w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-16 py-2.5 w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/8 rounded-xl text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#ec4899] dark:focus:border-[#F9FAFB] focus:ring-1 focus:ring-[#ec4899] dark:focus:ring-[#F9FAFB] transition-all"
          />
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            <kbd className="bg-slate-200 text-gray-600 dark:bg-zinc-800/80 dark:text-gray-400 text-[8px] px-2 py-0.5 rounded font-mono select-none border border-slate-300 dark:border-zinc-700/60 font-bold uppercase">
              Ctrl + K
            </kbd>
          </span>
        </div>

      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-4">
        
        {/* Quick Add Button */}
        {onQuickAdd && (
          <button
            onClick={onQuickAdd}
            className="bg-slate-100 dark:bg-[#F9FAFB]/10 hover:bg-slate-200 dark:hover:bg-[#F9FAFB]/20 text-gray-800 dark:text-[#F9FAFB] border border-slate-300 dark:border-[#F9FAFB]/25 p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider px-3"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Quick Add</span>
          </button>
        )}

        {/* Dark Mode toggle simulation */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
          title="Toggle Theme"
        >
          {isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* Notifications Icon with dynamic badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
            title="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ec4899] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#07070a]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 rounded-2xl py-3 shadow-2xl z-50 animate-fadeIn text-left">
                <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-[#ec4899] hover:underline cursor-pointer border-none bg-transparent p-0"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-gray-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => toggleRead(n.id)}
                        className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer flex gap-3 items-start ${
                          n.unread ? "bg-pink-50/30 dark:bg-pink-950/10" : ""
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.unread ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] block mt-1"></span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 block mt-1"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate">
                            {n.title}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                          <span className="text-[8px] text-gray-400 dark:text-gray-500 mt-1 block">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Dropdown Trigger */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 border-l border-slate-200 dark:border-white/5 pl-4 ml-1 cursor-pointer select-none group"
          >
            <img
              src={logo}
              alt="Shop Logo"
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-[#F9FAFB]/20 p-0.5 object-contain"
            />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white hidden sm:block transition-colors">
              Mayleki Studio
            </span>
            <ChevronDown size={12} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors" />
          </div>

          {/* Profile Menu dropdown overlay */}
          {showProfileMenu && (
            <>
              <div
                onClick={() => setShowProfileMenu(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 rounded-2xl py-2 shadow-2xl z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-[10px] font-bold text-[#F9FAFB] uppercase tracking-wider">Premium Partner</p>
                  <p className="text-xs font-bold text-white truncate mt-0.5">Mayleki Academy</p>
                </div>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 cursor-pointer mt-1"
                >
                  <Settings size={12} />
                  Settings
                </button>
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Trigger standard logout or navigate
                    localStorage.removeItem("adminToken");
                    window.location.reload();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={12} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
};

export default Topbar;
