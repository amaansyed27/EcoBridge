import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Globe } from 'lucide-react';

const Maintainer = () => {
  return (
    <section id="maintainer" className="py-40 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-center gap-16 glass-card p-12 md:p-20 relative overflow-hidden group transform-gpu"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] -z-10 group-hover:bg-accent/20 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/5 blur-[80px] -z-10" />
            
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-56 h-56 rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <img 
                src="https://github.com/amaansyed27.png" 
                alt="Amaan Syed" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-[0.2em] mb-8">
                Project Maintainer
              </span>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Amaan Syed</h2>
              <p className="text-xl md:text-2xl text-foreground/50 mb-10 leading-relaxed font-medium">
                Software developer and AI Engineer specializing in Agentic AI systems and automation pipelines. Lead maintainer of EcoBridge, dedicated to seamless device integration.
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-8">
                {[
                  { icon: Github, href: "https://github.com/amaansyed27" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/amaansyed27/" }
                ].map((social, i) => (
                  <motion.a 
                    key={i}
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, color: "#3DDC84" }}
                    className="text-foreground/30 transition-colors p-3 glass-card rounded-2xl border-white/5 hover:border-accent/20"
                  >
                    <social.icon size={28} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Maintainer;
