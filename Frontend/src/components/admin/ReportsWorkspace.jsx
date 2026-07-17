import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart as LineChartIcon,
  TrendingUp,
  IndianRupee,
  Calendar,
  Users,
  Scissors,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  TrendingDown,
  PieChart,
  DollarSign
} from "lucide-react";
import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";
import StatCard from "./components/StatCard";

const ReportsWorkspace = ({ bookings }) => {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [daysFilter, setDaysFilter] = useState(7); // 7 or 30 days

  // Detail filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const subTabs = [
    { id: "overview", label: "Overview & Charts", icon: LineChartIcon },
    { id: "services", label: "Service Stats", icon: Scissors },
    { id: "customers", label: "Top Customers", icon: Users },
    { id: "export", label: "Data Export Console", icon: Download },
  ];

  // Helper values calculated from bookings
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === "Confirmed").length;
  const completedBookings = bookings.filter(b => b.status === "Completed").length;
  const pendingBookings = bookings.filter(b => b.status === "Pending").length;
  const cancelledBookings = bookings.filter(b => b.status === "Cancelled").length;

  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.status === "Cancelled") return sum;
    return sum + (b.price || 0);
  }, 0);

  // 1. Revenue & Bookings Trend (SVG Chart Data)
  const getRevenueTrend = (days) => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }

    return dates.map(dateStr => {
      const dayBookings = bookings.filter(b => {
        if (!b.date || b.status === "Cancelled") return false;
        const bDate = b.date.split("T")[0];
        return bDate === dateStr;
      });
      const revenue = dayBookings.reduce((sum, b) => sum + (b.price || 0), 0);
      const count = dayBookings.length;
      const formattedLabel = new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      });
      return { date: dateStr, label: formattedLabel, revenue, count };
    });
  };

  const trendData = getRevenueTrend(daysFilter);
  const maxRevenue = Math.max(...trendData.map(t => t.revenue), 1000);

  // 2. Service breakdown calculations
  const getServiceBreakdown = () => {
    const servicesMap = {};
    bookings.forEach(b => {
      if (b.status === "Cancelled") return;
      const sName = b.service || "Unspecified Service";
      if (!servicesMap[sName]) {
        servicesMap[sName] = { count: 0, revenue: 0 };
      }
      servicesMap[sName].count += 1;
      servicesMap[sName].revenue += b.price || 0;
    });

    return Object.entries(servicesMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const serviceBreakdown = getServiceBreakdown();

  // 3. Customer spending leaderboard
  const getCustomerLeaderboard = () => {
    const customersMap = {};
    bookings.forEach(b => {
      const cPhone = b.phone || "No Phone";
      const cName = b.userName || "Guest Customer";
      if (!customersMap[cPhone]) {
        customersMap[cPhone] = { name: cName, bookingsCount: 0, totalSpent: 0 };
      }
      customersMap[cPhone].bookingsCount += 1;
      if (b.status !== "Cancelled") {
        customersMap[cPhone].totalSpent += b.price || 0;
      }
    });

    return Object.entries(customersMap)
      .map(([phone, data]) => ({ phone, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  };

  const customerLeaderboard = getCustomerLeaderboard();

  // 4. Data Filter & Export logic
  const getFilteredBookings = () => {
    return bookings.filter(b => {
      // 1. Search Query filter (Customer Name, Phone, Service)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = b.userName?.toLowerCase().includes(query);
        const matchesPhone = b.phone?.includes(query);
        const matchesService = b.service?.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesService) return false;
      }

      // 2. Status Filter
      if (statusFilter && b.status !== statusFilter) {
        return false;
      }

      // 3. Date Filters
      if (b.date) {
        const bDateStr = b.date.split("T")[0];
        if (startDate && bDateStr < startDate) return false;
        if (endDate && bDateStr > endDate) return false;
      } else if (startDate || endDate) {
        return false;
      }

      return true;
    });
  };

  const filteredBookings = getFilteredBookings();

  const handleExportCSV = () => {
    const headers = ["Booking ID", "Customer Name", "Phone", "Date", "Time Slot", "Service", "Price", "Status"];
    
    const rows = filteredBookings.map(b => [
      b._id,
      b.userName || "",
      b.phone || "",
      b.date ? b.date.split("T")[0] : "",
      b.timeSlot || "",
      b.service || "",
      b.price || 0,
      b.status || ""
    ]);

    const csvRows = [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))];
    const csvContent = csvRows.join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mayleki_bookings_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      key="reports-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">Reports Workspace</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
            Audit business analytics, revenue trends, and catalog sales distributions
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-white/5 overflow-x-auto gap-4 scrollbar-none pb-2">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${
                isActive
                  ? "bg-pink-50 dark:bg-pink-950/15 text-[#ec4899] border-[#ec4899]/20 dark:border-[#ec4899]/30"
                  : "text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border-transparent"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          iconBg="bg-green-500/10"
          iconColor="text-green-400"
        />
        <StatCard
          title="Confirmed/Completed"
          value={confirmedBookings + completedBookings}
          icon={Calendar}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
          trendValue={`${totalBookings} Total Bookings`}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingBookings}
          icon={TrendingUp}
          iconBg="bg-yellow-500/10"
          iconColor="text-yellow-400"
        />
        <StatCard
          title="Cancelled Bookings"
          value={cancelledBookings}
          icon={TrendingDown}
          iconBg="bg-red-500/10"
          iconColor="text-red-400"
        />
      </div>

      {/* Sub-tab Inner Contents */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW & CHARTS */}
          {activeSubTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <Card
                title="Revenue Trend Analyst"
                subtitle="Visualise sales over daily operations"
                actions={
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0c0b10] border border-slate-200 dark:border-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setDaysFilter(7)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        daysFilter === 7 ? "bg-white dark:bg-[#1f2937] text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-gray-400"
                      }`}
                    >
                      7D
                    </button>
                    <button
                      onClick={() => setDaysFilter(30)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        daysFilter === 30 ? "bg-white dark:bg-[#1f2937] text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-gray-400"
                      }`}
                    >
                      Last 30 Days
                    </button>
                  </div>
                }
              >
                {/* Custom Responsive SVG Chart */}
                <div className="w-full bg-slate-50 dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033]/55 rounded-2xl p-5 mt-2 h-72 flex flex-col justify-end select-none">
                  {trendData.every(t => t.revenue === 0) ? (
                    <div className="m-auto text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      No sales data captured in this period
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Chart Plot Area */}
                      <div className="flex-1 w-full flex items-end gap-1 sm:gap-2.5 pt-4 pb-2 relative">
                        {/* SVG Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 border-b border-gray-700">
                          <div className="border-t border-dashed border-gray-600 w-full h-0"></div>
                          <div className="border-t border-dashed border-gray-600 w-full h-0"></div>
                          <div className="border-t border-dashed border-gray-600 w-full h-0"></div>
                        </div>

                        {trendData.map((item, idx) => {
                          const percentage = Math.min((item.revenue / maxRevenue) * 100, 100);
                          return (
                            <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full mb-2 bg-gray-900 border border-white/10 text-white rounded-lg p-2 text-[9px] font-semibold opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center">
                                <span className="text-gray-400">{item.label}</span>
                                <span className="text-[#ec4899] font-bold mt-0.5">₹{item.revenue}</span>
                                <span className="text-gray-400 text-[8px] mt-0.5">{item.count} appointments</span>
                              </div>

                              {/* Bar Chart Column */}
                              <div
                                style={{ height: `${percentage}%` }}
                                className="w-full bg-gradient-to-t from-[#d946ef]/60 to-[#ec4899] rounded-t-md min-h-[4px] group-hover:to-white transition-all cursor-pointer shadow-md shadow-[#ec4899]/5"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* X-Axis Labels */}
                      <div className="flex justify-between border-t border-[#232033] pt-3 px-1 mt-1 text-[8px] font-bold text-gray-500 uppercase tracking-wider">
                        <span>{trendData[0]?.label}</span>
                        <span>{trendData[Math.floor(trendData.length / 2)]?.label}</span>
                        <span>{trendData[trendData.length - 1]?.label}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* SERVICE STATS */}
          {activeSubTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <Card title="Catalog Sales Analysis" subtitle="Review service bookings metrics">
                <div className="bg-white dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] rounded-2xl overflow-hidden mt-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#232033] bg-slate-50 dark:bg-[#111827]">
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Service Name</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-center">Bookings Count</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-right">Revenue Contributed</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-right w-1/4">Relative Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#232033]/50">
                      {serviceBreakdown.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
                            No active service metrics logged.
                          </td>
                        </tr>
                      ) : (
                        serviceBreakdown.map((item, idx) => {
                          const percentage = Math.round((item.revenue / (totalRevenue || 1)) * 100);
                          return (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                              <td className="p-4 text-xs text-slate-800 dark:text-white font-semibold">{item.name}</td>
                              <td className="p-4 text-xs text-slate-500 dark:text-gray-400 text-center font-mono">{item.count}</td>
                              <td className="p-4 text-xs text-green-400 font-mono text-right">₹{item.revenue.toLocaleString()}</td>
                              <td className="p-4">
                                <div className="flex items-center justify-end gap-3">
                                  <div className="w-24 bg-slate-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${percentage}%` }}
                                      className="bg-gradient-to-r from-[#d946ef] to-[#ec4899] h-full"
                                    />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-white w-7 text-right">
                                    {percentage}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TOP CUSTOMERS */}
          {activeSubTab === "customers" && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <Card title="Customer Leaderboard" subtitle="Top 10 loyal clients by total studio billing value">
                <div className="bg-white dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] rounded-2xl overflow-hidden mt-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#232033] bg-slate-50 dark:bg-[#111827]">
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest w-12 text-center">Rank</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Customer Profile</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Phone Number</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-center">Appointments Count</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-right">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#232033]/50">
                      {customerLeaderboard.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
                            No customers data available.
                          </td>
                        </tr>
                      ) : (
                        customerLeaderboard.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 text-xs font-mono font-bold text-slate-400 dark:text-gray-500 text-center">{idx + 1}</td>
                            <td className="p-4 text-xs text-slate-800 dark:text-white font-semibold flex items-center gap-2.5">
                              <img
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.name}`}
                                alt=""
                                className="w-6.5 h-6.5 rounded-full bg-slate-100 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-500/30 object-cover"
                              />
                              <span>{item.name}</span>
                            </td>
                            <td className="p-4 text-xs text-slate-500 dark:text-gray-400 font-mono">{item.phone}</td>
                            <td className="p-4 text-xs text-slate-500 dark:text-gray-400 text-center font-mono">{item.bookingsCount}</td>
                            <td className="p-4 text-xs text-green-400 font-mono text-right font-bold font-mono">₹{item.totalSpent.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* DATA EXPORT CONSOLE */}
          {activeSubTab === "export" && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <Card title="Advanced Data Filtering" subtitle="Configure constraints to compile custom Excel/CSV reports">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4.5 mt-2">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
                      <Search size={13} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search customer, phone..."
                      className="pl-9 pr-3 py-3 w-full bg-white dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select
                    className="p-3.5 bg-white dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#ec4899] transition-all"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <Input
                    type="date"
                    label="From Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />

                  <Input
                    type="date"
                    label="To Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="border-t border-slate-200 dark:border-[#232033] pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-wider">
                    Matching records: <span className="text-slate-800 dark:text-white font-mono">{filteredBookings.length}</span> / {bookings.length}
                  </div>
                  <Button
                    onClick={handleExportCSV}
                    disabled={filteredBookings.length === 0}
                    className="flex items-center gap-2 self-end sm:self-auto"
                  >
                    <Download size={14} />
                    Compile & Export CSV
                  </Button>
                </div>
              </Card>

              {/* Preview Grid */}
              <Card title="Filtered Records Preview" subtitle="First 10 records matching current filter configurations">
                <div className="bg-white dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] rounded-2xl overflow-hidden mt-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#232033] bg-slate-50 dark:bg-[#111827]">
                        <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Customer</th>
                        <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Appointment Date</th>
                        <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Service Requested</th>
                        <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Billing (₹)</th>
                        <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-center w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#232033]/50">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
                            No records matching filter settings.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.slice(0, 10).map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                            <td className="p-3.5 text-xs text-slate-800 dark:text-white font-semibold">
                              <div>{b.userName || "Guest Customer"}</div>
                              <div className="text-[9px] text-slate-550 dark:text-gray-500 mt-0.5 font-mono">{b.phone}</div>
                            </td>
                            <td className="p-3.5 text-xs text-slate-500 dark:text-gray-400 font-mono">
                              {b.date ? b.date.split("T")[0] : ""} @ {b.timeSlot}
                            </td>
                            <td className="p-3.5 text-xs text-slate-700 dark:text-gray-300 font-medium">{b.service}</td>
                            <td className="p-3.5 text-xs text-slate-800 dark:text-white font-mono">₹{b.price}</td>
                            <td className="p-3.5 text-center">
                              <span
                                className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full tracking-wider border ${
                                  b.status === "Confirmed"
                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                    : b.status === "Completed"
                                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                    : b.status === "Pending"
                                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReportsWorkspace;
