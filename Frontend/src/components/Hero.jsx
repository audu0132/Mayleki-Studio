import { Button } from "./ui/button";
import home from "../assets/home.jpeg";


const Hero = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/918767875492", "_blank", "noopener,noreferrer");
  };

  const scrollToAcademy = () => {
    const section = document.getElementById("academy");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-secondary"
    >
      {/* Background */}
      <div className="absolute inset-y-0 left-1/2 right-1/2 z-0 -ml-[50vw] -mr-[50vw] w-screen">
        <img
          src={home}
          alt="Luxury salon interior"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 w-full ">
        <div className="max-w-2xl mt-16 md:mt-0">
          <span className="inline-block mb-6 border border-primary/30 bg-white/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
            Premium Beauty Destination
          </span>

          <h1 className="mb-6 text-5xl md:text-7xl font-serif font-medium leading-tight text-primary">
            Reveal Your <br />
            <span className="italic font-light">Natural Radiance</span>
          </h1>

          <p className="mb-10 max-w-lg text-lg md:text-xl font-light leading-relaxed text-primary/80">
            Experience the art of beauty at Mayleki Makeup Studio & Academy.
            Where luxury meets expertise in Rahuri.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-none bg-primary px-8 py-6 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              onClick={openWhatsApp}
            >
              Book Appointment
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-none border-primary bg-white/30 px-8 py-6 text-sm font-semibold uppercase tracking-widest text-primary backdrop-blur-sm hover:bg-primary hover:text-white"
              onClick={scrollToAcademy}
            >
              Join Academy
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
