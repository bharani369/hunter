import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { WA_PHONE } from '../data';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-500 ease-in-out",
        scrolled 
          ? "bg-yellow-400/80 lg:bg-white/70 backdrop-blur-lg lg:backdrop-blur-md shadow-md py-3 text-black lg:text-fk-blue" 
          : "bg-yellow-400/80 lg:bg-fk-blue backdrop-blur-lg lg:backdrop-blur-none py-4 text-black lg:text-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className={cn(
               "p-2 rounded-sm transform -rotate-3 transition-colors duration-500",
               scrolled ? "bg-black lg:bg-fk-blue text-yellow-400 lg:text-white" : "bg-black lg:bg-fk-yellow text-yellow-400 lg:text-white"
            )}>
              <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-heading text-2xl font-bold leading-none tracking-tight transition-colors duration-500",
                scrolled ? "text-black lg:text-fk-blue" : "text-black lg:text-white"
              )}>HUNTER</span>
              <span className={cn(
                "text-[0.65rem] uppercase tracking-widest font-semibold leading-tight transition-colors duration-500",
                scrolled ? "text-fk-green lg:text-fk-green" : "text-black lg:text-fk-yellow"
              )}>Mens & Juniors</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-row items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "font-medium text-sm transition-all duration-300 hover:scale-105 relative group",
                  location.pathname === link.path 
                    ? (scrolled ? "text-fk-blue font-bold" : "text-fk-yellow font-bold") 
                    : (scrolled ? "text-gray-700 hover:text-fk-blue" : "text-white/90 hover:text-white")
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                  scrolled ? "bg-fk-blue" : "bg-fk-yellow",
                  location.pathname === link.path ? "w-full" : ""
                )}></span>
              </Link>
            ))}
            <a
              href={`https://wa.me/${WA_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 hover:-translate-y-1 bg-[#25D366] hover:bg-[#20BE5A] text-white font-semibold rounded text-sm transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)]"
            >
              Order on WhatsApp
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "transition-colors duration-300 hover:scale-110",
                scrolled ? "text-black" : "text-black"
              )}
            >
              <div className={cn("transition-transform duration-300", isOpen ? "rotate-90 scale-110" : "rotate-0")}>
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav (Yellow Glass Theme) */}
      <div 
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-500 ease-in-out absolute w-full backdrop-blur-lg shadow-2xl bg-yellow-400/80 border-b border-yellow-400/50",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 mt-2 flex flex-col items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block w-full text-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-300",
                location.pathname === link.path
                  ? "bg-white/40 text-black shadow-sm font-bold scale-105"
                  : "text-gray-900 hover:bg-white/30 hover:text-black hover:scale-105"
              )}
            >
              {link.name}
            </Link>
          ))}
          <a
            href={`https://wa.me/${WA_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 mt-4 text-center rounded-md text-base font-medium bg-[#25D366] text-white hover:bg-[#20BE5A] shadow-md transition-transform active:scale-95"
          >
             Order on WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
