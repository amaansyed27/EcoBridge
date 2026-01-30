import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Smartphone, Monitor } from 'lucide-react';

const Vision = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const x = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={sectionRef} id="vision" className="py-40 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-accent/5 pointer-events-none blur-[150px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-32">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-[0.2em] mb-10">
              The Vision
            </div>
            <h2 className="text-6xl md:text-8xl font-bold mb-10 tracking-tighter leading-[0.9]">
              The Universal <br />
              <span className="text-accent italic">Continuity <br />Alternative.</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/50 mb-12 leading-relaxed max-w-xl font-medium">
              Most "ecosystem" features are locked behind proprietary walls. EcoBridge provides a "Continuity-like" experience for everyone.
            </p>
            
            <div className="space-y-8">
              {[
                { title: 'Hardware Agnostic', desc: 'Works with any Android and Windows device.' },
                { title: 'Zero Lock-in', desc: 'No proprietary ecosystem requirements.' },
                { title: 'Privacy First', desc: 'Local processing with end-to-end encryption.' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.8 }}
                  className="flex gap-8 p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all duration-500 group border border-transparent hover:border-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-3 group-hover:scale-[2.5] group-hover:shadow-[0_0_20px_rgba(61,220,132,1)] transition-all duration-500" />
                  <div>
                    <h4 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">{item.title}</h4>
                    <p className="text-foreground/40 text-base leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            style={{ rotate, x, scale, translateZ: 0 }}
            className="flex-1 relative will-change-transform"
          >
            <div className="aspect-square glass-card flex items-center justify-center p-24 overflow-hidden relative group transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-accent-blue/20 opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
              
              <div className="flex items-center gap-12 relative z-10">
                {/* Mobile Logo */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden md:block text-accent opacity-20 group-hover:opacity-100 transition-opacity duration-700"
                >
                  <Smartphone size={64} strokeWidth={1.5} />
                </motion.div>

                <motion.div 
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="relative text-center transform-gpu"
                >
                  <div className="text-[180px] md:text-[220px] leading-none mb-8 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] grayscale group-hover:grayscale-0 transition-all duration-1000 cursor-default select-none">🌍</div>
                  <div className="text-4xl font-black tracking-widest uppercase opacity-10 group-hover:opacity-100 transition-all duration-1000 text-accent">Bridge the Gap</div>
                </motion.div>

                {/* Desktop Logo */}
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="hidden md:block text-accent-blue opacity-20 group-hover:opacity-100 transition-opacity duration-700"
                >
                  <Monitor size={64} strokeWidth={1.5} />
                </motion.div>
              </div>
              
              {/* Simplified immersive decorative elements */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-dashed border-white/5 rounded-full scale-110 transform-gpu pointer-events-none" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-white/5 rounded-full scale-125 transform-gpu pointer-events-none" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
