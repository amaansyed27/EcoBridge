import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Summary from './components/Summary';
import Vision from './components/Vision';
import Features from './components/Features';
import Maintainer from './components/Maintainer';
import Contributors from './components/Contributors';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <div className="relative">
          {/* Subtle separator gradients */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Summary />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <Vision />
        
        <Features />
        
        <Maintainer />
        
        <Contributors />
      </main>

      <Footer />
    </div>
  );
}

export default App;
