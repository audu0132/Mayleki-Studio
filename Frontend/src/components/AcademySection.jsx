import React from "react";
import { Button } from "./ui/button";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/academy1.png";

const ACADEMY_COURSES_LOCAL = [
  {
    id: 1,
    title: "Professional Makeup Artist Course",
    duration: "2 Months",
    features: [
      "Basic to Advanced Techniques",
      "Bridal & HD Makeup",
      "Product Knowledge",
      "Certification",
    ],
    image: img1,
  },
  {
    id: 2,
    title: "Self-Grooming Workshop",
    duration: "1 Week",
    features: [
      "Daily Wear Makeup",
      "Skin Care Basics",
      "Hairstyling 101",
      "Personal Kit Consultation",
    ],
    image: img1,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const CourseCard = ({ course, index, onEnquire }) => {
  const { features = [] } = course;

  return (
    <motion.div
      custom={0.2 + index * 0.15}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white/90 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_25px_80px_rgba(0,0,0,0.14)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#f3eee8]" />
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-black/5 blur-2xl" />

      <div className="relative p-6 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-black/60">
              <Sparkles size={12} />
              Featured
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-black leading-snug">
              {course.title}
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-black px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-md">
            {course.duration}
          </span>
        </div>

        <ul className="mb-8 grid gap-3">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-[15px] text-black/70"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-sm">
                <CheckCircle2 size={16} />
              </span>
              <span className="font-light">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onEnquire(course)}
          className="w-full rounded-full bg-black text-white hover:bg-black/90 h-12 text-xs uppercase tracking-[0.25em] transition-all duration-300 group-hover:scale-[1.02]"
        >
          Enquire Now
          <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

const AcademySection = () => {
  const navigate = useNavigate();

  const handleEnquire = (course) => {
    navigate("/contact", {
      state: {
        selectedCourse: course.title,
      },
    });
  };

  const handleExploreAcademy = () => {
    navigate("/academy");
  };

  return (
    <section
      id="academy"
      className="relative overflow-hidden bg-[#f8f5f2] py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-neutral-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-6 -top-6 hidden h-full w-full rounded-[2rem] border border-black/10 lg:block" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_25px_80px_rgba(0,0,0,0.16)]">
              <img
                src={ACADEMY_COURSES_LOCAL[0].image}
                alt="Makeup Academy Training"
                className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[620px] transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                    Mayleki Academy
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white">
                    Learn. Practice. Transform.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Professional beauty education for beginners and aspiring
                    artists.
                  </p>

                  <Button
                    onClick={handleExploreAcademy}
                    className="mt-5 rounded-full bg-white text-black hover:bg-white/90 px-6"
                  >
                    Explore Academy
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-[0.35em] text-black/50">
                Education
              </span>

              <h2 className="max-w-2xl text-4xl font-serif leading-tight text-black sm:text-5xl lg:text-6xl">
                Master the Art of Makeup
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-black/65 sm:text-lg">
                Join the Mayleki Academy and turn your passion into a profession.
                Our carefully designed courses help you build practical skills,
                creative confidence, and industry-ready expertise.
              </p>
            </motion.div>

            <div className="space-y-6">
              {ACADEMY_COURSES_LOCAL.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  onEnquire={handleEnquire}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademySection;