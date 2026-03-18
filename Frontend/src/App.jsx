import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import AcademySection from "./components/AcademySection";
import InstagramFeed from "./components/InstagramFeed";
import OfferBanner from "./components/OfferBanner";
import { Testimonials } from "./components/Testimonials";
import Footer from "./components/Footer";

import AdminPanel from "./components/AdminPanel";
import AdminBookings from "./components/admin/AdminBookings";
import AdminLogin from "./components/admin/AdminLogin";
import Dashboard from "./components/admin/Dashboard";
import AboutUs from "./components/AboutUs";
import AdminRegistration from "./components/admin/AdminRegistration";

function HomePage() {
  return (
    <>
      <Header />
      <OfferBanner />
      <Hero />
      <ServicesSection />
      <AcademySection />
      <InstagramFeed />
      <Testimonials />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/registration" element={<AdminRegistration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;