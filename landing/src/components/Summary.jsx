import React from 'react';
import { motion } from 'framer-motion';

const Summary = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter leading-tight"
          >
            A high-performance bridge <br />
            <span className="text-foreground/40 italic">for your digital ecosystem.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-foreground/50 leading-relaxed mb-20 max-w-3xl mx-auto font-medium"
          >
            EcoBridge is an open-source ecosystem bridge that breaks down the proprietary walls between your devices. Built with Flutter and Electron, it delivers low-latency performance with end-to-end encryption.
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Latency', value: '< 100ms', desc: 'Real-time sync' },
              { label: 'Security', value: 'AES-256', desc: 'End-to-end' },
              { label: 'Quality', value: '1080p/60', desc: 'High definition' },
              { label: 'Open Source', value: 'MIT', desc: 'Community driven' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="glass-card p-8 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-3xl font-black text-accent mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-xs text-foreground/40 uppercase tracking-[0.2em] font-black mb-4">{stat.label}</div>
                <div className="text-sm text-foreground/30 font-medium">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summary;
