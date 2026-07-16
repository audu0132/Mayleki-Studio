import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Heart,
  FileText,
  UploadCloud
} from "lucide-react";
import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import LoadingState from "./components/LoadingState";
import Modal from "./components/Modal";
import ConfirmDialog from "./components/ConfirmDialog";
import StatCard from "./components/StatCard";

const GalleryWorkspace = ({ API_BASE_URL, getAuthHeaders }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form state
  const [newItemForm, setNewItemForm] = useState({
    url: "",
    caption: "",
    likes: "0",
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const DEFAULT_POSTS = [
    {
      url: "https://images.unsplash.com/photo-1714381108184-5183cb40e932?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmlkYWwlMjBtYWtldXB8ZW58MHx8fHwxNzcwMTM2Njg1fDA&ixlib=rb-4.1.0&q=85",
      caption: "Beautiful bridal look",
      likes: "1.2k"
    },
    {
      url: "https://images.unsplash.com/photo-1606251706444-d069cd266189?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxicmlkYWwlMjBoYWlyc3R5bGV8ZW58MHx8fHwxNzcwMTM2NjkzfDA&ixlib=rb-4.1.0&q=85",
      caption: "Elegant bridal hairstyle",
      likes: "856"
    },
    {
      url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxtYWtldXAlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NzAxMzY3MDR8MA&ixlib=rb-4.1.0&q=85",
      caption: "Luxury makeup kit setup",
      likes: "2.5k"
    },
    {
      url: "https://images.unsplash.com/photo-1551392505-f4056032826e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXB8ZW58MHx8fHwxNzcwMTM2NzEzfDA&ixlib=rb-4.1.0&q=85",
      caption: "Stunning eye makeup details",
      likes: "3.1k"
    },
    {
      url: "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBicmlkYWwlMjBtYWtldXB8ZW58MHx8fHwxNzcwMTM2Njg1fDA&ixlib=rb-4.1.0&q=85",
      caption: "Classic Indian bridal makeup",
      likes: "945"
    },
    {
      url: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxtYWtldXAlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NzAxMzY3MDR8MA&ixlib=rb-4.1.0&q=85",
      caption: "Dynamic styling products",
      likes: "1.8k"
    }
  ];

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/gallery/admin`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        throw new Error(`Failed to load gallery items: ${res.status}`);
      }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load gallery items from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [API_BASE_URL]);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (!res.ok) throw new Error("Failed to toggle item status");
      
      const updated = await res.json();
      setItems(items.map(item => item._id === id ? updated : item));
      showToast(updated.isActive ? "Image published and live!" : "Image hidden from homepage feed.");
    } catch (err) {
      console.error(err);
      setError("Error toggling active status.");
    }
  };

  // Delete gallery item
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${itemToDelete}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete gallery item");

      setItems(items.filter(item => item._id !== itemToDelete));
      setItemToDelete(null);
      showToast("Gallery item removed successfully.");
    } catch (err) {
      console.error(err);
      setError("Error deleting item.");
    }
  };

  // Seed default images
  const handleSeedDefaults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ bulk: DEFAULT_POSTS })
      });

      if (!res.ok) throw new Error("Failed to seed default gallery items");
      fetchItems();
      showToast("Default gallery items successfully seeded!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to seed default items.");
    } finally {
      setLoading(false);
    }
  };

  // Add manual gallery image
  const handleAddItem = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newItemForm)
      });

      if (!res.ok) throw new Error("Failed to add gallery item");
      
      setNewItemForm({
        url: "",
        caption: "",
        likes: "0",
        isActive: true
      });
      setIsModalOpen(false);
      fetchItems();
      showToast("Gallery image added successfully!");
    } catch (err) {
      console.error(err);
      setFormError(err.message || "Failed to submit gallery item.");
    } finally {
      setFormLoading(false);
    }
  };

  // Calculations
  const totalCount = items.length;
  const activeCount = items.filter(item => item.isActive).length;
  const hiddenCount = items.filter(item => !item.isActive).length;

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Loading gallery details..." />
      </div>
    );
  }

  return (
    <motion.div
      key="gallery-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-sans tracking-tight">Gallery Workspace</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
            Manage your visual portfolio and publish client transformations to the frontend feed
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalCount === 0 && (
            <Button variant="secondary" size="sm" onClick={handleSeedDefaults} className="flex items-center gap-2">
              <UploadCloud size={14} /> Seed Default Images
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={14} /> Add Image
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Portfolio Images"
          value={totalCount}
          icon={Image}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
        />
        <StatCard
          title="Live on Homepage"
          value={activeCount}
          icon={Eye}
          iconBg="bg-green-500/10"
          iconColor="text-green-400"
        />
        <StatCard
          title="Hidden & Staged"
          value={hiddenCount}
          icon={EyeOff}
          iconBg="bg-red-500/10"
          iconColor="text-red-400"
        />
      </div>

      {/* Error and Success Alerts */}
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

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400 text-xs font-semibold"
          >
            <Check size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      {totalCount === 0 ? (
        <div className="py-24 bg-[#111827] border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
          <Image className="text-gray-600 mb-3" size={36} />
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">No portfolio images stored yet</p>
          <Button variant="secondary" onClick={handleSeedDefaults} className="flex items-center gap-2">
            <UploadCloud size={14} /> Seed Default Unsplash Portfolio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-[#111827] border border-white/8 rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all relative group"
            >
              {/* Image box with badges */}
              <div className="h-56 relative overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Active Indicator Badge */}
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 text-[8px] font-black uppercase rounded-full tracking-wider border shadow-md ${
                    item.isActive
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : "bg-red-500/20 border-red-500/30 text-red-400"
                  }`}
                >
                  {item.isActive ? "Live" : "Staged"}
                </span>

                {/* Simulated Likes Badge */}
                {item.likes && (
                  <span className="absolute bottom-3 right-3 bg-black/60 border border-white/10 px-2 py-1 rounded-lg text-[9px] font-bold text-gray-300 flex items-center gap-1">
                    <Heart size={10} className="text-[#ec4899]" fill="currentColor" />
                    {item.likes}
                  </span>
                )}
              </div>

              {/* Text content & controls */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={12} className="text-[#ec4899]" />
                    Caption
                  </h4>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                    {item.caption || <span className="italic text-gray-600">No caption defined</span>}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-auto">
                  {/* Toggle view live */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item._id, item.isActive)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      item.isActive
                        ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                        : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    {item.isActive ? (
                      <>
                        <Eye size={12} /> Live
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Staged
                      </>
                    )}
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => setItemToDelete(item._id)}
                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Image to Portfolio">
        <form onSubmit={handleAddItem} className="space-y-4 py-2">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] font-semibold flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <Input
              label="Image URL"
              placeholder="https://images.unsplash.com/photo-..."
              value={newItemForm.url}
              onChange={(e) => setNewItemForm({ ...newItemForm, url: e.target.value })}
              required
            />
            <p className="text-[9px] text-gray-500 leading-tight pl-1 mt-1 font-medium uppercase tracking-wide">
              * Enter any public image URL (Unsplash, Imgur, or direct links)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Simulated Likes (e.g. 1.5k)"
              placeholder="e.g. 1.2k"
              value={newItemForm.likes}
              onChange={(e) => setNewItemForm({ ...newItemForm, likes: e.target.value })}
            />
            
            {/* Toggle Switch to publish */}
            <div className="flex items-center justify-between border border-[#232033]/60 bg-[#0c0b10] p-3 rounded-xl">
              <div className="pr-2 select-none">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Publish Instantly</h4>
                <p className="text-[8px] text-gray-500 font-medium leading-none mt-0.5">Show on homepage immediately</p>
              </div>
              <button
                type="button"
                onClick={() => setNewItemForm({ ...newItemForm, isActive: !newItemForm.isActive })}
                className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ec4899]/50 cursor-pointer shrink-0 ${
                  newItemForm.isActive ? "bg-gradient-to-r from-[#d946ef] to-[#ec4899]" : "bg-gray-800"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    newItemForm.isActive ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <Textarea
              label="Image Description / Caption"
              placeholder="Describe the styling look..."
              value={newItemForm.caption}
              onChange={(e) => setNewItemForm({ ...newItemForm, caption: e.target.value })}
              rows={3}
            />
          </div>

          {/* Action buttons */}
          <div className="border-t border-white/5 pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              Add to Gallery
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        title="Delete Portfolio Image"
        description="Are you absolutely sure you want to delete this image? It will be permanently removed from the database and frontend portfolio."
        confirmText="Confirm Delete"
      />
    </motion.div>
  );
};

export default GalleryWorkspace;
