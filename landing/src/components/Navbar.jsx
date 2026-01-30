import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Vision', href: '#vision' },
    { name: 'Features', href: '#features' },
    { name: 'Maintainer', href: '#maintainer' },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: -100 },
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-8 pointer-events-none"
    >
      <div className={`transition-all duration-700 ease-[0.16,1,0.3,1] pointer-events-auto ${
        isScrolled ? 'w-[90%] max-w-3xl' : 'w-[95%] max-w-7xl'
      }`}>
        <div className={`relative glass-nav px-8 py-4 rounded-full flex items-center justify-between transition-all duration-700 ease-[0.16,1,0.3,1] ${
          isScrolled ? 'bg-black/40 border-white/10' : 'bg-transparent border-transparent'
        }`}>
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "anticipate" }}
              className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src="/assets/logo.svg" alt="EcoBridge Logo" className="w-6 h-6 relative z-10" />
            </motion.div>
            <AnimatePresence>
              {!isScrolled && (
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="font-black text-2xl tracking-tighter uppercase italic"
                >
                  EcoBridge
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-accent transition-all relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-foreground text-background px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-background transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
