import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 group cursor-default"
          >
            <img src="/assets/logo.svg" alt="EcoBridge" className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="font-black text-xl text-foreground/20 group-hover:text-foreground transition-colors duration-500 tracking-tighter uppercase italic">EcoBridge</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/20 text-xs font-black uppercase tracking-[0.2em] text-center"
          >
            © 2026 EcoBridge. MIT License.
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            {[
              { label: 'GitHub', href: 'https://github.com/amaansyed27/EcoBridge' },
              { label: 'Docs', href: '#' },
            ].map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-foreground/20 hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
