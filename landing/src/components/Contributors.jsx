import React from 'react';
import { motion } from 'framer-motion';

const contributors = [
  {
    name: "Rahil Halai",
    github: "https://github.com/RahilHalai7",
    avatar: "https://github.com/RahilHalai7.png",
    role: "Contributor"
  },
  {
    name: "Yash",
    github: "https://github.com/VITianYash42",
    avatar: "https://github.com/VITianYash42.png",
    role: "Contributor"
  },
  {
    name: "Shaikh Warsi",
    github: "https://github.com/ShaikhWarsi",
    avatar: "https://github.com/ShaikhWarsi.png",
    role: "Contributor"
  }
];

const ContributorCard = ({ contributor, index }) => (
  <motion.a
    href={contributor.github}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex flex-col items-center text-center group transition-all duration-300 border-white/10 hover:border-accent/30 bg-white/5 hover:bg-white/[0.08]"
  >
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-accent rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
      <img 
        src={contributor.avatar} 
        alt={contributor.name}
        className="w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-accent/50 transition-colors relative z-10"
      />
    </div>
    <h4 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">{contributor.name}</h4>
    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{contributor.role}</p>
  </motion.a>
);

const Contributors = () => {
  return (
    <section id="contributors" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Contributors</h2>
          <p className="text-lg text-foreground/60 mb-16 max-w-2xl mx-auto">
            EcoBridge is built by a community of passionate developers. 
            Join us in building the future of device continuity.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {contributors.map((contributor, i) => (
              <div key={contributor.github} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] max-w-[240px]">
                <ContributorCard contributor={contributor} index={i} />
              </div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <a 
              href="https://github.com/amaansyed27/EcoBridge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium group"
            >
              Become a contributor on GitHub <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contributors;
