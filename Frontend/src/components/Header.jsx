import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import logo from "../assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  const navItems = [
    { name: "Home", href: isHomePage ? "#home" : "/#home" },
    { name: "Services", href: isHomePage ? "#services" : "/#services" },
    { name: "Academy", href: isHomePage ? "#academy" : "/#academy" },
    { name: "Reviews", href: isHomePage ? "#reviews" : "/#reviews" },
    { name: "Contact", href: isHomePage ? "#contact" : "/#contact" },
  ];

  const openWhatsApp = () => {
    window.open("https://wa.me/918767875492", "_blank", "noopener,noreferrer");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-9x2">
        <div className="flex h-20 items-center justify-between px-4">
          
          {/* Logo – flush left */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <img src={logo} alt="Mayleki Logo" className="h-14 w-auto object-contain" />
          </Link>

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

            {/* Customer Authentication Links */}
            {user ? (
              <div className="flex items-center gap-4 border-l border-border pl-6">
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1.5"
                >
                  <User size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold uppercase tracking-wider text-primary hover:underline border-l border-border pl-6"
              >
                Login
              </Link>
            )}

            {/* Book Now */}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-6 space-y-4 flex flex-col absolute top-20 left-0 w-full shadow-lg">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium uppercase tracking-wide text-primary/80 hover:text-primary transition-colors"
            >
              {item.name}
            </a>
          ))}

          <hr className="border-border" />

          {/* Auth section in Mobile */}
          {user ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold uppercase tracking-wide text-primary flex items-center gap-2"
              >
                <User size={16} />
                Dashboard ({user.name.split(" ")[0]})
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-sm font-semibold uppercase tracking-wide text-red-500 text-left flex items-center gap-2 cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold uppercase tracking-wide text-primary"
            >
              Login
            </Link>
          )}

          <Button
            variant="outline"
            className="rounded-none border-primary text-primary hover:bg-primary hover:text-white uppercase text-xs tracking-widest px-6 w-full"
            onClick={() => {
              setIsOpen(false);
              openWhatsApp();
            }}
          >
            Book Now
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
