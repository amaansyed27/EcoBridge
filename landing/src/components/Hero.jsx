import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="min-h-screen flex items-center justify-center pt-32 pb-20 relative overflow-hidden bg-background"
    >
      {/* Background blobs with parallax */}
      <motion.div 
        style={{ y: y1, translateZ: 0 }}
        className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow pointer-events-none will-change-transform" 
      />
      <motion.div 
        style={{ y: y2, translateZ: 0 }}
        className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow pointer-events-none will-change-transform" 
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          style={{ opacity, scale, translateZ: 0 }}
          className="will-change-transform"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-bold glass-card border-white/20 bg-white/5 uppercase tracking-widest text-accent"
          >
            🌉 AcWoC 2026 Featured Project
          </motion.span>
          <h1 className="text-6xl md:text-9xl font-bold mb-8 tracking-tighter text-gradient leading-tight">
            Breaking the barriers <br />
            <span className="text-accent">between your devices</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Experience true device continuity. Turn your Android phone into a powerful extension of your Windows desktop—seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              href="https://github.com/amaansyed27/EcoBridge/archive/refs/heads/main.zip"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(61, 220, 132, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-5 bg-accent text-background font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center"
            >
              Get Started Free
            </motion.a>
            <motion.a
              href="https://github.com/amaansyed27/EcoBridge"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-5 glass-card font-black uppercase tracking-widest transition-all border-white/10 flex items-center justify-center"
            >
              View GitHub
            </motion.a>
          </div>
        </motion.div>

        {/* Mockup Preview with floating effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-32 relative max-w-6xl mx-auto will-change-transform"
        >
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card w-fit mx-auto overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative flex items-center justify-center p-2 md:p-3 transform-gpu"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-10" />
            <img 
              src="/Eco.png" 
              alt="EcoBridge App Interface" 
              className="max-w-full max-h-[70vh] w-auto h-auto rounded-xl relative z-0 object-contain shadow-2xl"
            />
          </motion.div>
          
          {/* Floating elements for "fluidity" */}
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -top-16 -right-12 w-56 h-56 glass-card p-8 hidden lg:flex flex-col justify-between border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl transform-gpu"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-accent animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">System Status</div>
              <div className="text-xl font-bold tracking-tight">Optimized</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -25, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-12 -left-12 w-48 h-48 glass-card p-8 hidden lg:flex flex-col justify-between border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl transform-gpu"
          >
            <div className="text-3xl font-bold text-accent-blue">99%</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-2">Latency Score</div>
              <div className="text-lg font-bold tracking-tight">Ultra Low</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
