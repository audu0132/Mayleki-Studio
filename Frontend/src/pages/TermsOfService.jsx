import React from "react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
                        Terms of Service
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
                    <h3 className="text-2xl font-semibold mb-4 text-primary">1. Acceptance of Terms</h3>
                    <p className="mb-6 leading-relaxed">
                        By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4 text-primary">2. Provision of Services</h3>
                    <p className="mb-6 leading-relaxed">
                        You agree and acknowledge that we are entitled to modify, improve or discontinue any of its services at its sole discretion and without notice to you even if it may result in you being prevented from accessing any information contained in it.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4 text-primary">3. Proprietary Rights</h3>
                    <p className="mb-6 leading-relaxed">
                        You acknowledge and agree that our website may contain proprietary and confidential information including trademarks, service marks and patents protected by intellectual property laws and international intellectual property treaties.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4 text-primary">4. Termination of Agreement</h3>
                    <p className="mb-8 leading-relaxed">
                        The Terms of this agreement will continue to apply in perpetuity until terminated by either party without notice at any time for any reason. Terms that are to continue in perpetuity shall be unaffected by the termination of this agreement.
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

export default TermsOfService;
