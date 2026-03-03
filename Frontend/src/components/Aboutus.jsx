import React from "react";
const Aboutus = () => {
  return (
    <section id="aboutus" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-serif text-primary mb-4">About Us</h2>
                <p className="text-primary/80 font-light text-lg leading-relaxed">
                    At Mayleki, we are passionate about empowering individuals to express their unique beauty through the art of makeup. Founded in Rahuri, our mission is to provide high-quality makeup products and education that inspire creativity and confidence.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary">Our Story</h3>
                    <p className="text-primary/80 font-light text-sm leading-relaxed">
                        Mayleki was born out of a desire to make professional-grade makeup accessible to everyone. We started as a small local brand in Rahuri and have since grown into a trusted name in the beauty industry, known for our commitment to quality and customer satisfaction.
                    </p>    
                </div>
                <div className="space-y-4"> 
                    <h3 className="text-xl font-semibold text-primary">Our Values</h3>
                    <p className="text-primary/80 font-light text-sm leading-relaxed">
                        We believe in inclusivity, creativity, and sustainability. Our products are designed to cater to diverse skin tones and types, and we are committed to using eco-friendly packaging and cruelty-free ingredients.
                    </p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary">Our Team</h3>
                    <p className="text-primary/80 font-light text-sm leading-relaxed">
                        Our team is made up of passionate makeup artists, beauty enthusiasts, and industry experts who are dedicated to providing exceptional products and education. We work tirelessly to stay ahead of beauty trends and ensure that our customers have access to the best in the industry.
                    </p>
                </div>
            </div>
        </div>
    </section>
    );  
};

export default Aboutus;