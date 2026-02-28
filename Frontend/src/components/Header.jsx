import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Academy", href: "#academy" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  const openWhatsApp = () => {
    window.open("https://wa.me/918767875492", "_blank", "noopener,noreferrer");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 bg-background/95 backdrop-blur-md border-b border-border">
  <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-9x2">
    <div className="flex h-20 items-center justify-between px-4">
      
      {/* Logo – flush left */}
      <a
        href="/"
        className="text-2xl font-serif font-bold uppercase tracking-wider text-primary"
      >
        Mayleki
        <span className="block text-sm font-sans font-normal tracking-widest text-muted-foreground normal-case">
          Studio & Academy
        </span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="relative text-sm font-medium uppercase tracking-wide text-primary/80 hover:text-primary transition-colors group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
        ))}

        {/* Book Now – flush right */}
        <Button
          variant="outline"
          className="rounded-none border-primary text-primary hover:bg-primary hover:text-white uppercase text-xs tracking-widest px-6"
          onClick={openWhatsApp}
        >
          Book Now
        </Button>
      </nav>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="md:hidden text-primary"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>
</header>

  );
};

export default Header;
