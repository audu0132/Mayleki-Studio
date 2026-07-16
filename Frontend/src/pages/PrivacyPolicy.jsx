import React from "react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/30 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                        Privacy Policy
                    </h2>
                    <p className="text-primary/70 font-light text-lg">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </motion.div> 

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="prose prose-lg max-w-none text-primary/80"
                >
                    <h3 className="text-2xl font-semibold mb-4 text-primary">1. Information We Collect</h3>
                    <p className="mb-6 leading-relaxed">
                        We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4 text-primary">2. How We Use Your Information</h3>
                    <p className="mb-6 leading-relaxed">
                        We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users, develop safety features, authenticate users, and send product updates and administrative messages.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4 text-primary">3. Sharing of Information</h3>
                    <p className="mb-6 leading-relaxed">
                        We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: With third party service providers; in response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4 text-primary">4. Data Security</h3>
                    <p className="mb-8 leading-relaxed">
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>
                </motion.div>

                <div className="mt-12 text-center">
                    <Button
                        variant="outline"
                        className="rounded-none uppercase tracking-widest px-8 py-6"
                        onClick={() => window.location.href = '/'}
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
