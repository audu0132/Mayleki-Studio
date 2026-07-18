import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const servicesList = [
    "Makeup Services (Bridal/Party/Sider)",
    "Academy Courses (Basic to Advanced)",
    "Hair Treatments & Styling",
    "Skin Care Treatments",
    "General Inquiry",
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Invalid phone number (must be 10 digits)";
    }

    if (!formData.service) errors.service = "Please select a service interest";
    if (!formData.message.trim()) errors.message = "Message cannot be empty";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      setFormErrors({});
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Spacer for Fixed Header */}
      <div className="h-20" />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-b from-muted/30 to-background border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary-foreground)/10,transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#ec4899] bg-[#ec4899]/5 px-3 py-1 rounded-full border border-[#ec4899]/20"
            >
              Get In Touch
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight"
            >
              Let's Create Beauty Together
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg max-w-2xl mx-auto text-primary/70 font-light leading-relaxed"
            >
              Have questions about our bridal makeovers, studio appointments, or academy enrollment? Drop us a message, and our beauty specialists will get back to you shortly.
            </motion.p>
          </div>
        </section>

        {/* Form and Details Layout */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#ec4899]/5 to-transparent w-40 h-40 rounded-full blur-2xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-primary">Send a Message</h2>
                      <p className="text-xs text-primary/60 mt-1 uppercase tracking-wider font-semibold">We typically reply within 2 hours</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-primary/70 uppercase tracking-wider">Full Name *</label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          className={`w-full bg-background border rounded-xl p-3 text-xs focus:outline-none transition-all ${
                            formErrors.name
                              ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-border focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]"
                          }`}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {formErrors.name && (
                          <span className="text-[10px] font-semibold text-red-500 block mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> {formErrors.name}
                          </span>
                        )}
                      </div>

                      {/* Email & Phone grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-primary/70 uppercase tracking-wider">Email Address *</label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            className={`w-full bg-background border rounded-xl p-3 text-xs focus:outline-none transition-all ${
                              formErrors.email
                                ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-border focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]"
                            }`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                          {formErrors.email && (
                            <span className="text-[10px] font-semibold text-red-500 block mt-1 flex items-center gap-1">
                              <AlertCircle size={10} /> {formErrors.email}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-primary/70 uppercase tracking-wider">Phone Number *</label>
                          <input
                            type="text"
                            placeholder="10-digit number"
                            className={`w-full bg-background border rounded-xl p-3 text-xs focus:outline-none transition-all ${
                              formErrors.phone
                                ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-border focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]"
                            }`}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                          {formErrors.phone && (
                            <span className="text-[10px] font-semibold text-red-500 block mt-1 flex items-center gap-1">
                              <AlertCircle size={10} /> {formErrors.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Service Dropdown */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-primary/70 uppercase tracking-wider">I am interested in... *</label>
                        <select
                          className={`w-full bg-background border rounded-xl p-3 text-xs focus:outline-none transition-all ${
                            formErrors.service
                              ? "border-red-500/50 focus:border-red-500"
                              : "border-border focus:border-[#ec4899]"
                          }`}
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option value="">Select an option...</option>
                          {servicesList.map((srv) => (
                            <option key={srv} value={srv}>{srv}</option>
                          ))}
                        </select>
                        {formErrors.service && (
                          <span className="text-[10px] font-semibold text-red-500 block mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> {formErrors.service}
                          </span>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-primary/70 uppercase tracking-wider">Your Message *</label>
                        <textarea
                          placeholder="How can we help you?"
                          rows={4}
                          className={`w-full bg-background border rounded-xl p-3 text-xs focus:outline-none transition-all ${
                            formErrors.message
                              ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-border focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]"
                          }`}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        {formErrors.message && (
                          <span className="text-[10px] font-semibold text-red-500 block mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> {formErrors.message}
                          </span>
                        )}
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto px-8 py-5 uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-xl transition-all"
                        >
                          <Send size={13} className={isSubmitting ? "animate-pulse" : ""} />
                          {isSubmitting ? "Sending message..." : "Send Message"}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500">
                      <CheckCircle2 size={36} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif font-bold text-primary">Thank You!</h3>
                      <p className="text-sm text-primary/70 font-light max-w-sm mx-auto">
                        Your inquiry has been successfully sent. A Mayleki representative will review your message and reach out shortly.
                      </p>
                    </div>
                    <div>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="rounded-xl uppercase tracking-widest text-[10px] px-6 py-4.5"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right: Info & Address Panels */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Address / Contacts Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg space-y-6"
              >
                <h3 className="text-lg font-serif font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-[#ec4899]" />
                  Contact Info
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="p-2.5 rounded-xl bg-muted text-[#ec4899] shrink-0">
                      <MapPin size={16} />
                    </span>
                    <div>
                      <span className="block text-[10px] font-bold text-primary/50 uppercase tracking-wider">Studio Location</span>
                      <p className="text-sm font-medium text-primary/80 mt-1 leading-relaxed">
                        Vishnuprasad Apartment, near Dr. Pol Clinic,<br />
                        Rahuri, Maharashtra 413705
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="p-2.5 rounded-xl bg-muted text-[#ec4899] shrink-0">
                      <Phone size={16} />
                    </span>
                    <div>
                      <span className="block text-[10px] font-bold text-primary/50 uppercase tracking-wider">Phone Number</span>
                      <p className="text-sm font-mono font-bold text-primary/80 mt-1">
                        +91 87678 75492
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="p-2.5 rounded-xl bg-muted text-[#ec4899] shrink-0">
                      <Mail size={16} />
                    </span>
                    <div>
                      <span className="block text-[10px] font-bold text-primary/50 uppercase tracking-wider">Email Support</span>
                      <p className="text-sm font-mono text-primary/80 mt-1">
                        info@mayleki.com
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg space-y-6"
              >
                <h3 className="text-lg font-serif font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
                  <Clock size={18} className="text-[#ec4899]" />
                  Operating Hours
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-primary/70">Monday - Friday</span>
                    <span className="font-mono text-primary/95">10:00 AM - 08:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-primary/70">Saturday</span>
                    <span className="font-mono text-primary/95">10:00 AM - 09:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-primary/70">Sunday (Appointments Only)</span>
                    <span className="font-mono text-primary/95">11:00 AM - 07:00 PM</span>
                  </div>
                </div>
              </motion.div>

              {/* Embedded Interactive Map */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="overflow-hidden rounded-2xl border border-border shadow-lg aspect-video w-full h-[220px]"
              >
                <iframe
                  title="Mayleki Studio location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3758.8252277150165!2d74.64696001202863!3d19.387532381816788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc97fae69e38e1%3A0xe54e6fae101f28b4!2sDr.%20Pol%20Clinic!5e0!3m2!1sen!2sin!4v1721310000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>

            </div>

          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
