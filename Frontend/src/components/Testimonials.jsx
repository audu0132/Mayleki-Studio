import React from "react";
import { TESTIMONIALS } from "../data/mock";
import { Star } from "lucide-react";

export const Testimonials = () => {
  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary">
            Client Love
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review, index) => (
            <div
              key={review.id ?? index}
              className="bg-secondary p-10 relative group hover:bg-primary transition-colors duration-500"
            >
              {/* Quote */}
              <span className="absolute top-6 left-6 text-6xl font-serif text-primary/10 group-hover:text-white/10">
                "
              </span>

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-6 text-primary group-hover:text-accent">
                  {[...Array(review.rating || 0)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-primary/80 group-hover:text-white/90 font-light text-lg mb-8 leading-relaxed italic">
                  “{review.text}”
                </p>

                {/* Name */}
                <div className="flex items-center">
                  <div className="w-8 h-px bg-primary group-hover:bg-white/50 mr-4" />
                  <h4 className="font-serif text-primary group-hover:text-white text-lg">
                    {review.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
