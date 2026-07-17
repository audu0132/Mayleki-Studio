import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Clock,
  Sliders,
  Globe,
  Save,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Instagram,
  Facebook,
  Award
} from "lucide-react";
import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import LoadingState from "./components/LoadingState";

const SettingsWorkspace = ({
  API_BASE_URL,
  getAuthHeaders,
  schedulerSettings,
  onSaveSchedulerSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Database business settings state
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    businessHours: { start: "10:00 AM", end: "08:00 PM" },
    autoConfirmBookings: true,
    instagramLink: "",
    facebookLink: "",
    googleReviewLink: ""
  });

  // Local state for Scheduler presets editing
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");

  const subTabs = [
    { id: "general", label: "General Settings", icon: Building2 },
    { id: "bookings", label: "Booking Rules", icon: Clock },
    { id: "scheduler", label: "Scheduler Config", icon: Sliders },
    { id: "socials", label: "Social Links", icon: Globe },
  ];

  // Fetch settings from MongoDB
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      if (!res.ok) {
        throw new Error(`Failed to load business settings: ${res.status}`);
      }
      const data = await res.json();
      if (data) {
        setFormData({
          businessName: data.businessName || "Mayleki Studio & Academy",
          email: data.email || "info@mayleki.com",
          phone: data.phone || "+91 87678 75492",
          whatsappNumber: data.whatsappNumber || "918767875492",
          address: data.address || "Mayleki Studio, Near Main Road, Pune, Maharashtra",
          businessHours: data.businessHours || { start: "10:00 AM", end: "08:00 PM" },
          autoConfirmBookings: data.autoConfirmBookings !== undefined ? data.autoConfirmBookings : true,
          instagramLink: data.instagramLink || "https://instagram.com/mayleki_studio",
          facebookLink: data.facebookLink || "https://facebook.com/mayleki_studio",
          googleReviewLink: data.googleReviewLink || "https://g.page/r/mayleki_studio"
        });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      setError(err.message || "Failed to load settings from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [API_BASE_URL]);

  // Handle PUT submission to server
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized. Please log in as administrator.");
        }
        throw new Error(`Server returned error: ${res.status}`);
      }

      const updated = await res.json();
      setFormData({
        businessName: updated.businessName,
        email: updated.email,
        phone: updated.phone,
        whatsappNumber: updated.whatsappNumber,
        address: updated.address,
        businessHours: updated.businessHours,
        autoConfirmBookings: updated.autoConfirmBookings,
        instagramLink: updated.instagramLink,
        facebookLink: updated.facebookLink,
        googleReviewLink: updated.googleReviewLink
      });

      setSuccess(true);

      // Sync settings with local scheduler settings
      if (onSaveSchedulerSettings && schedulerSettings) {
        onSaveSchedulerSettings({
          ...schedulerSettings,
          autoConfirm: updated.autoConfirmBookings,
          businessHours: updated.businessHours,
        });
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Add Time Slot (local storage scheduler settings)
  const handleAddTimeSlot = (e) => {
    e.preventDefault();
    if (!newTimeSlot) return;
    
    // Simple validation (e.g. 10:00 AM)
    if (!schedulerSettings.timeSlots.includes(newTimeSlot)) {
      const sortedSlots = [...schedulerSettings.timeSlots, newTimeSlot].sort((a, b) => {
        // Convert to comparable formats
        const getMinutes = (str) => {
          const [time, modifier] = str.split(" ");
          let [hours, minutes] = time.split(":");
          hours = parseInt(hours);
          minutes = parseInt(minutes || 0);
          if (modifier === "PM" && hours < 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;
          return hours * 60 + minutes;
        };
        return getMinutes(a) - getMinutes(b);
      });

      onSaveSchedulerSettings({
        ...schedulerSettings,
        timeSlots: sortedSlots
      });
      setNewTimeSlot("");
    }
  };

  // Delete Time Slot (local storage scheduler settings)
  const handleDeleteTimeSlot = (slotToDelete) => {
    const updatedSlots = schedulerSettings.timeSlots.filter(slot => slot !== slotToDelete);
    onSaveSchedulerSettings({
      ...schedulerSettings,
      timeSlots: updatedSlots
    });
  };

  // Add Service Preset (local storage scheduler settings)
  const handleAddServicePreset = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    const parsedPrice = parseInt(newServicePrice);
    if (isNaN(parsedPrice)) return;

    const exists = schedulerSettings.services.some(
      s => s.name.toLowerCase() === newServiceName.toLowerCase()
    );

    if (!exists) {
      onSaveSchedulerSettings({
        ...schedulerSettings,
        services: [...schedulerSettings.services, { name: newServiceName, price: parsedPrice }]
      });
      setNewServiceName("");
      setNewServicePrice("");
    }
  };

  // Delete Service Preset (local storage scheduler settings)
  const handleDeleteServicePreset = (serviceName) => {
    const updatedServices = schedulerSettings.services.filter(s => s.name !== serviceName);
    onSaveSchedulerSettings({
      ...schedulerSettings,
      services: updatedServices
    });
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Loading business configuration details..." />
      </div>
    );
  }

  return (
    <motion.div
      key="settings-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">Settings Workspace</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
            Manage business configurations, scheduler parameters & platform details
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

      {/* Error and Success Banners */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-semibold"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400 text-xs font-semibold"
          >
            <Check size={16} className="shrink-0" />
            <span>Changes successfully saved to database & synchronized!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Inner Contents */}
      <div className="grid grid-cols-1 gap-6">
        <form onSubmit={handleSaveSettings}>
          <AnimatePresence mode="wait">
            {/* GENERAL SETTINGS */}
            {activeSubTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card title="Business Info" subtitle="Setup your basic brand attributes">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    <Input
                      label="Business Name"
                      placeholder="Mayleki Studio & Academy"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      icon={Building2}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="info@mayleki.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      icon={Mail}
                      required
                    />
                    <Input
                      label="Phone Number"
                      placeholder="+91 87678 75492"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      icon={Phone}
                      required
                    />
                    <div className="space-y-1.5">
                      <Input
                        label="WhatsApp Number (API Format)"
                        placeholder="918767875492"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        icon={MessageSquare}
                        required
                      />
                      <p className="text-[9px] text-gray-500 leading-tight pl-1 font-medium uppercase tracking-wide">
                        * Input international format without plus (+) signs or spaces (e.g. 918767875492)
                      </p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <Textarea
                      label="Physical Address"
                      placeholder="Mayleki Studio, Near Main Road..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* BOOKING RULES */}
            {activeSubTab === "bookings" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card title="Booking Workflow" subtitle="Configure automated rules and service hours">
                  <div className="space-y-6 mt-2">
                    {/* Toggle auto confirm */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] p-4.5 rounded-2xl">
                      <div className="space-y-1 pr-4">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Auto-Confirm Bookings</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                          If enabled, new customer bookings are instantly marked as 'Confirmed'. If disabled, bookings enter 'Pending' status awaiting admin approval.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            autoConfirmBookings: !formData.autoConfirmBookings
                          })
                        }
                        className={`relative inline-flex h-6.5 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ec4899]/50 cursor-pointer shrink-0 ${
                          formData.autoConfirmBookings
                            ? "bg-gradient-to-r from-[#d946ef] to-[#ec4899]"
                            : "bg-gray-800"
                        }`}
                      >
                        <span
                          className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform ${
                            formData.autoConfirmBookings ? "translate-x-6.5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Business Hours start/end */}
                    <div className="bg-slate-50 dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Clock size={14} className="text-[#ec4899]" />
                        Daily Operation Hours
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Start Time"
                          placeholder="10:00 AM"
                          value={formData.businessHours.start}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessHours: { ...formData.businessHours, start: e.target.value }
                            })
                          }
                          required
                        />
                        <Input
                          label="End Time"
                          placeholder="08:00 PM"
                          value={formData.businessHours.end}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessHours: { ...formData.businessHours, end: e.target.value }
                            })
                          }
                          required
                        />
                      </div>
                      <p className="text-[9px] text-gray-500 leading-tight font-medium uppercase tracking-wide">
                        * Changes here automatically update the default operational windows of your front desk.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* SCHEDULER CONFIG (LOCAL STORAGE SETTINGS) */}
            {activeSubTab === "scheduler" && (
              <motion.div
                key="scheduler"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Time Slots Section */}
                <Card title="Appointment Time Slots" subtitle="Manage available booking slots on the scheduler">
                  <div className="space-y-5 mt-2">
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] rounded-2xl min-h-[80px] items-center">
                      {schedulerSettings?.timeSlots?.length === 0 ? (
                        <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mx-auto">
                          No active slots. Add slots below.
                        </p>
                      ) : (
                        schedulerSettings?.timeSlots?.map((slot, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-100 dark:bg-[#1f2937] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-gray-200 text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 select-none"
                          >
                            <span>{slot}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTimeSlot(slot)}
                              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Input
                        placeholder="Add slot (e.g. 10:30 AM)"
                        value={newTimeSlot}
                        onChange={(e) => setNewTimeSlot(e.target.value)}
                        className="max-w-[240px]"
                      />
                      <Button variant="secondary" onClick={handleAddTimeSlot} className="shrink-0 flex items-center gap-1.5">
                        <Plus size={13} /> Add Slot
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Quick Services Presets */}
                <Card title="Quick-Add Service Presets" subtitle="Manage shortcuts for rapid appointment drafting">
                  <div className="space-y-5 mt-2">
                    <div className="bg-white dark:bg-[#0c0b10] border border-slate-200 dark:border-[#232033] rounded-2xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-[#232033] bg-slate-50 dark:bg-[#111827]">
                            <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Service Name</th>
                            <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Default Price</th>
                            <th className="p-3.5 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-center w-20">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#232033]/50">
                          {schedulerSettings?.services?.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="p-8 text-center text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
                                No service presets registered.
                              </td>
                            </tr>
                          ) : (
                            schedulerSettings?.services?.map((srv, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                <td className="p-3.5 text-xs text-slate-800 dark:text-white font-medium">{srv.name}</td>
                                <td className="p-3.5 text-xs text-slate-500 dark:text-gray-400 font-mono">₹{srv.price}</td>
                                <td className="p-3.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteServicePreset(srv.name)}
                                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3.5">
                      <Input
                        placeholder="Service Name (e.g. Bleach)"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="sm:flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Price (e.g. 500)"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="sm:w-[150px]"
                      />
                      <Button variant="secondary" onClick={handleAddServicePreset} className="shrink-0 flex items-center gap-1.5">
                        <Plus size={13} /> Add Preset
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* SOCIAL LINKS */}
            {activeSubTab === "socials" && (
              <motion.div
                key="socials"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card title="Social Accounts & Integrations" subtitle="Embed links for online reviews and social catalogs">
                  <div className="grid grid-cols-1 gap-5 mt-2">
                    <Input
                      label="Instagram Link"
                      placeholder="https://instagram.com/mayleki_studio"
                      value={formData.instagramLink}
                      onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                      icon={Instagram}
                    />
                    <Input
                      label="Facebook Link"
                      placeholder="https://facebook.com/mayleki_studio"
                      value={formData.facebookLink}
                      onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
                      icon={Facebook}
                    />
                    <Input
                      label="Google Review / Map Link"
                      placeholder="https://g.page/r/mayleki_studio"
                      value={formData.googleReviewLink}
                      onChange={(e) => setFormData({ ...formData, googleReviewLink: e.target.value })}
                      icon={Award}
                    />
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Actions footer */}
          {activeSubTab !== "scheduler" && (
            <div className="mt-8 flex justify-end">
              <Button type="submit" loading={saving} className="flex items-center gap-2">
                <Save size={14} />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default SettingsWorkspace;
