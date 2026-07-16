import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  AlertCircle,
  Check,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import LoadingState from "./components/LoadingState";
import Modal from "./components/Modal";
import ConfirmDialog from "./components/ConfirmDialog";
import StatCard from "./components/StatCard";

const ReviewsWorkspace = ({ API_BASE_URL, getAuthHeaders }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [activeSubTab, setActiveSubTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Form state
  const [newReviewForm, setNewReviewForm] = useState({
    name: "",
    text: "",
    rating: 5,
    source: "Manual",
    autoApprove: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const subTabs = [
    { id: "all", label: "All Reviews" },
    { id: "pending", label: "Pending Approval" },
    { id: "approved", label: "Approved & Live" },
  ];

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/reviews/admin`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        throw new Error(`Failed to load reviews: ${res.status}`);
      }
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load reviews from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [API_BASE_URL]);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Toggle approval on backend
  const handleToggleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}/approve`, {
        method: "PUT",
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to update approval status");
      
      const updated = await res.json();
      setReviews(reviews.map(r => r._id === id ? updated : r));
      showToast(updated.approved ? "Review approved and published!" : "Review hidden from public list.");
    } catch (err) {
      console.error(err);
      setError("Error toggling approval status.");
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewToDelete}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter(r => r._id !== reviewToDelete));
      setReviewToDelete(null);
      showToast("Review deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Error deleting review.");
    }
  };

  // Add manual review
  const handleAddReview = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReviewForm.name,
          text: newReviewForm.text,
          rating: newReviewForm.rating,
          source: newReviewForm.source
        })
      });

      if (!res.ok) throw new Error("Failed to submit review");
      const created = await res.json();

      // Auto approve sequence if selected
      if (newReviewForm.autoApprove) {
        await fetch(`${API_BASE_URL}/api/reviews/${created._id}/approve`, {
          method: "PUT",
          headers: getAuthHeaders()
        });
      }

      setNewReviewForm({
        name: "",
        text: "",
        rating: 5,
        source: "Manual",
        autoApprove: true
      });
      setIsModalOpen(false);
      fetchReviews();
      showToast("Manual review added successfully!");
    } catch (err) {
      console.error(err);
      setFormError(err.message || "Failed to submit review.");
    } finally {
      setFormLoading(false);
    }
  };

  // Calculations
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(r => r.approved).length;
  const pendingReviews = reviews.filter(r => !r.approved).length;
  
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  // Filtered list
  const getFilteredReviews = () => {
    if (activeSubTab === "pending") return reviews.filter(r => !r.approved);
    if (activeSubTab === "approved") return reviews.filter(r => r.approved);
    return reviews;
  };

  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Loading review database details..." />
      </div>
    );
  }

  return (
    <motion.div
      key="reviews-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-sans tracking-tight">Reviews Workspace</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
            Moderate client testimonials and publish customer feedback to your homepage
          </p>
        </div>
        <div>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={14} /> Add Review
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Rating"
          value={`${avgRating} / 5.0`}
          icon={Star}
          iconBg="bg-yellow-500/10"
          iconColor="text-yellow-400"
        />
        <StatCard
          title="Total Testimonials"
          value={totalReviews}
          icon={MessageSquare}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
        />
        <StatCard
          title="Published & Live"
          value={approvedReviews}
          icon={CheckCircle2}
          iconBg="bg-green-500/10"
          iconColor="text-green-400"
        />
        <StatCard
          title="Awaiting Moderation"
          value={pendingReviews}
          icon={AlertCircle}
          iconBg="bg-purple-500/10"
          iconColor="text-purple-400"
        />
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-white/5 overflow-x-auto gap-4 scrollbar-none pb-2">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${
                isActive
                  ? "bg-[#F9FAFB]/10 text-[#F9FAFB] border-white/10"
                  : "text-[#a1a1aa] hover:bg-white/5 hover:text-white border-transparent"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Error and Success Toast Alerts */}
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

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="md:col-span-2 py-16 bg-[#111827] border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
            <MessageSquare className="text-gray-600 mb-3" size={32} />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">No reviews in this category</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <Card
              key={rev._id}
              title={rev.name}
              subtitle={`${rev.source || "Website"} client`}
              actions={
                <div className="flex items-center gap-2">
                  {/* Approve/Reject button */}
                  <button
                    type="button"
                    onClick={() => handleToggleApprove(rev._id)}
                    title={rev.approved ? "Hide from website" : "Approve and publish"}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      rev.approved
                        ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                    }`}
                  >
                    {rev.approved ? <ThumbsUp size={13} /> : <ThumbsDown size={13} />}
                  </button>
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => setReviewToDelete(rev._id)}
                    title="Delete review"
                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              }
            >
              <div className="space-y-3.5 mt-1 select-none">
                {/* Rating stars */}
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < rev.rating ? "currentColor" : "none"}
                      className={i < rev.rating ? "text-yellow-400" : "text-gray-600"}
                    />
                  ))}
                  <span className="text-[10px] text-gray-500 font-bold ml-1.5 uppercase tracking-wide">
                    {rev.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                {/* Review Text */}
                <p className="text-xs text-gray-300 leading-relaxed font-light italic bg-[#0c0b10] border border-white/5 rounded-2xl p-4">
                  “{rev.text}”
                </p>
                {/* Log stamp */}
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider text-right">
                  Logged {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Manual Add Review Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manually Register Testimonial">
        <form onSubmit={handleAddReview} className="space-y-4 py-2">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] font-semibold flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Reviewer Name"
              placeholder="e.g. Ashwini Shelar"
              value={newReviewForm.name}
              onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source Channel</label>
              <select
                className="w-full bg-[#0c0b10] border border-[#232033] rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all"
                value={newReviewForm.source}
                onChange={(e) => setNewReviewForm({ ...newReviewForm, source: e.target.value })}
              >
                <option value="Manual">Manual Entry</option>
                <option value="Google">Google Maps</option>
                <option value="Website">Website</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Star Rating ({newReviewForm.rating})</label>
              <div className="flex gap-1.5 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewReviewForm({ ...newReviewForm, rating: i + 1 })}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={18}
                      fill={i < newReviewForm.rating ? "currentColor" : "none"}
                      className={i < newReviewForm.rating ? "text-yellow-400" : "text-gray-600"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle auto approve switch */}
            <div className="flex items-center justify-between border border-[#232033]/60 bg-[#0c0b10] p-3 rounded-xl">
              <div className="pr-2 select-none">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Publish Instantly</h4>
                <p className="text-[8px] text-gray-500 font-medium leading-none mt-0.5">Approve and push live immediately</p>
              </div>
              <button
                type="button"
                onClick={() => setNewReviewForm({ ...newReviewForm, autoApprove: !newReviewForm.autoApprove })}
                className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ec4899]/50 cursor-pointer shrink-0 ${
                  newReviewForm.autoApprove ? "bg-gradient-to-r from-[#d946ef] to-[#ec4899]" : "bg-gray-800"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    newReviewForm.autoApprove ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <Textarea
              label="Reviewer Comments"
              placeholder="Enter client comments and feedback..."
              value={newReviewForm.text}
              onChange={(e) => setNewReviewForm({ ...newReviewForm, text: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="border-t border-white/5 pt-4.5 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              Save Testimonial
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm deletion dialog */}
      <ConfirmDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDeleteReview}
        title="Delete Testimonial"
        description="Are you absolutely sure you want to delete this review? This action will permanently remove it from the database and website frontend."
        confirmText="Confirm Delete"
      />
    </motion.div>
  );
};

export default ReviewsWorkspace;
