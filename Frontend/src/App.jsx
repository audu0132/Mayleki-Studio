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
import Login from "./components/admin/Login";
import Dashboard from "./components/admin/Dashboard";

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
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;