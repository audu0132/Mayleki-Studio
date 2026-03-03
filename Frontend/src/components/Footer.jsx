import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Button } from "./ui/button";


const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <a href="/" className="text-3xl font-serif font-bold tracking-wider uppercase text-white mb-6 block">
              Mayleki
            </a>
            <p className="text-white/60 font-light mb-8 leading-relaxed">
              Elevating beauty standards in Rahuri. Professional makeup services and industry-leading education.
            </p>
            <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
                    <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
                    <Facebook size={18} />
                </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-white">Explore</h4>
            <ul className="space-y-4">
                {['Home', 'Services', 'Academy', 'About Us', 'Reviews'].map((item) => (
                    <li key={item}>
                        <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-white/60 hover:text-white text-sm uppercase tracking-wider transition-colors">
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-white">Contact</h4>
            <ul className="space-y-6">
                <li className="flex items-start text-white/60 font-light">
                    <MapPin size={20} className="mr-4 mt-1 flex-shrink-0 text-accent" />
                    <span>Vishnuprasad Apartment, Tal, near Dr. Pol Clinic, Rahuri, Maharashtra 413705</span>
                </li>
                <li className="flex items-center text-white/60 font-light">
                    <Phone size={20} className="mr-4 flex-shrink-0 text-accent" />
                    <span>+91 87678 75492</span>
                </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
             <h4 className="text-lg font-serif mb-6 text-white">Book Your Spot</h4>
             <p className="text-white/60 font-light mb-6">
                Ready to transform? Book an appointment or enroll in our courses today.
             </p>
             <Button 
                className="w-full rounded-none bg-white text-primary hover:bg-accent uppercase tracking-widest font-bold py-6"
                onClick={() => window.open('https://wa.me/918767875492', '_blank')}
             >
                Call Now
             </Button>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm font-light">
            <p>&copy; {new Date().getFullYear()} Mayleki Makeup Studio & Academy. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
