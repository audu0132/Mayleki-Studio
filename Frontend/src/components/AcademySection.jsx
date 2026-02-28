import React from 'react';
import { Button } from "./ui/button";
import { CheckCircle2 } from 'lucide-react';
import img1 from "../assets/academy1.png";

// Move data local to avoid Babel plugin recursion issue with imported arrays
const ACADEMY_COURSES_LOCAL = [
  {
    id: 1,
    title: "Professional Makeup Artist Course",
    duration: "2 Months",
    features: ["Basic to Advanced Techniques", "Bridal & HD Makeup", "Product Knowledge", "Certification"],
    image: img1
  },
  {
    id: 2,
    title: "Self-Grooming Workshop",
    duration: "1 Week",
    features: ["Daily Wear Makeup", "Skin Care Basics", "Hairstyling 101", "Personal Kit Consultation"],
    image: img1
  }
];

const CourseCard = ({ course }) => {
    // Destructure features to simplify AST for the babel plugin
    const { features = [] } = course;
    
    return (
        <div className="bg-background p-8 border border-border/50 hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif text-primary">{course.title}</h3>
                <span className="text-xs font-bold uppercase tracking-wider bg-secondary px-3 py-1 text-primary">
                    {course.duration}
                </span>
            </div>
            <ul className="space-y-3 mb-6">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-muted-foreground font-light">
                        <CheckCircle2 size={16} className="text-accent mr-3" />
                        {feature}
                    </li>
                ))}
            </ul>
            <Button variant="outline" className="w-full rounded-none border-primary hover:bg-primary hover:text-white uppercase tracking-widest text-xs">
                Enquire Now
            </Button>
        </div>
    );
};

const AcademySection = () => {
  return (
    <section id="academy" className="py-24 bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image Side */}
            <div className="relative">
                <div className="absolute -top-10 -left-10 w-full h-full border border-primary/20 z-0 hidden lg:block"></div>
                <img 
                    src={ACADEMY_COURSES_LOCAL[0].image} 
                    alt="Makeup Academy Training" 
                    className="relative z-10 w-full h-[600px] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
            </div>

            {/* Content Side */}
            <div className="space-y-8">
                <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Education</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Master the Art of Makeup</h2>
                    <p className="text-primary/80 font-light text-lg leading-relaxed">
                        Join the Mayleki Academy and turn your passion into a profession. Our comprehensive courses are designed for both beginners and aspiring professionals, taught by industry experts in Rahuri.
                    </p>
                </div>

                <div className="space-y-6">
                    {ACADEMY_COURSES_LOCAL.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default AcademySection;
