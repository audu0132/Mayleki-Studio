import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const AboutUs = () => {
    return (
        <section id="aboutus" className="py-24 bg-gradient-to-b from-background to-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                        About Mayleki
                    </h2>
                    <p className="text-primary/70 font-light text-lg max-w-3xl mx-auto leading-relaxed">
                        Empowering beauty through artistry, education, and passion.
                        We help individuals discover confidence through professional makeup services and industry-leading training.
                    </p>
                </motion.div>

                {/* Image + Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">

                    <motion.img
                        src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
                        alt="Makeup Studio"
                        className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    />

                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-semibold text-primary mb-4">
                            Our Story
                        </h3>
                        <p className="text-primary/70 font-light leading-relaxed mb-6">
                            Founded in Rahuri, Mayleki started with a simple vision — to make
                            professional-grade beauty accessible to everyone. What began as
                            a small studio has grown into a trusted academy and beauty brand.
                        </p>
                        <Button className="rounded-none uppercase tracking-widest"
                            onClick={() => window.location.href = '/'}
                        >
                            Explore Services
                        </Button>
                    </motion.div>
                </div>

                {/* Cards Section */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

                    {[
                        {
                            title: "Our Values",
                            desc: "Inclusivity, creativity, and sustainability guide everything we do. We celebrate every skin tone and believe beauty is for everyone.",
                            img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796"
                        },
                        {
                            title: "Our Team",
                            desc: "A passionate group of certified makeup artists and educators dedicated to excellence and staying ahead of beauty trends.",
                            img: "https://images.unsplash.com/photo-1487412912498-0447578fcca8"
                        },
                        {
                            title: "Our Mission",
                            desc: "To inspire confidence and empower future makeup professionals through world-class training and services.",
                            img: "https://images.unsplash.com/photo-1500840216050-6ffa99d75160"
                        }
                    ].map((card, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 group"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <img
                                src={card.img}
                                alt={card.title}
                                className="h-52 w-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="p-6">
                                <h4 className="text-xl font-semibold text-primary mb-3">
                                    {card.title}
                                </h4>
                                <p className="text-primary/70 font-light text-sm leading-relaxed">
                                    {card.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Buttons */}
                <motion.div
                    className="mt-20 flex flex-col sm:flex-row justify-center gap-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Button className="rounded-none uppercase tracking-widest px-8 py-6">
                        Learn More
                    </Button>

                    <Button
                        variant="outline"
                        className="rounded-none uppercase tracking-widest px-8 py-6"
                        onClick={() => window.location.href = '/'}
                    >
                        Back to Home
                    </Button>
                </motion.div>

            </div>
        </section>
    );
};

export default AboutUs;