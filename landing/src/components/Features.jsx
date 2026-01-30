import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Keyboard, Clipboard, Gamepad2 } from 'lucide-react';

const features = [
  {
    title: 'Virtual Webcam',
    description: 'Transform your phone\'s high-resolution camera into a professional-quality webcam for your PC.',
    icon: Camera,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20'
  },
  {
    title: 'Remote Input',
    description: 'Control your phone using your laptop\'s keyboard and trackpad with HID over IP technology.',
    icon: Keyboard,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20'
  },
  {
    title: 'Universal Clipboard',
    description: 'Copy on one device, paste on another—instantly with AES-256 encrypted syncing.',
    icon: Clipboard,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20'
  },
  {
    title: 'Accessory Passthrough',
    description: 'Use laptop peripherals (microphones, controllers) as inputs for Android with zero latency.',
    icon: Gamepad2,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20'
  }
];

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`p-10 glass-card group relative overflow-hidden transition-all duration-500 bg-white/5 border-white/10 ${feature.border} hover:bg-white/[0.08] transform-gpu`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        <feature.icon className={`w-8 h-8 ${feature.color}`} />
      </div>
      
      <h3 className="text-3xl font-bold mb-4 tracking-tight">{feature.title}</h3>
      <p className="text-foreground/60 leading-relaxed text-lg font-medium">
        {feature.description}
      </p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-40 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
              Powerful Features. <br />
              <span className="text-foreground/20 italic">Simple Experience.</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
