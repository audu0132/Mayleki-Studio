import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { SERVICES } from '../data/mock';
import { Button } from "./ui/button";
import BookingModal from "./BookingModal";
import { useState } from 'react';

const ServiceCard = ({ service }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="border-none shadow-none bg-transparent group cursor-pointer">
        <div className="relative overflow-hidden aspect-[3/4] mb-6">
          <img 
            src={service.image} 
            alt={service.title} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
        </div>

        <CardHeader className="p-0 mb-3">
          <CardTitle className="font-serif text-2xl font-normal text-primary group-hover:text-primary/80 transition-colors">
            {service.title}
          </CardTitle>
          <div className="h-0.5 w-12 bg-accent mt-2 group-hover:w-full transition-all duration-500"></div>
        </CardHeader>

        <CardContent className="p-0 mb-4">
          <p className="text-muted-foreground font-light leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </CardContent>

        <CardFooter className="p-0 flex justify-between items-center">
          <span className="text-sm font-bold tracking-wide text-primary">
            {service.price}
          </span>

          <Button 
            onClick={() => setOpen(true)}
            variant="linked"
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>

      {/* Booking Modal */}
      {open && (
        <BookingModal
          service={service}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6"> curated Services</h2>
          <p className="text-muted-foreground font-light text-lg">
            From everyday elegance to bridal perfection, we offer a range of services designed to enhance your unique beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
