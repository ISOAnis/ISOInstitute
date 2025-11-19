import * as React from 'react';

interface HeroProps {
  onNavigate?: (page: 'home' | 'pathways' | 'about' | 'community') => void;
}

export function Hero({ onNavigate }: HeroProps = {}) {
  const scrollToCourt = () => {
    const courtSection = document.getElementById('iso-court');
    if (courtSection) {
      courtSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleLearnHowItWorks = () => {
    const productShowcaseSection = document.getElementById('product-showcase');
    if (productShowcaseSection) {
      productShowcaseSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <section 
      className="min-h-screen bg-slate-950 pt-32 pb-16"
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        paddingLeft: '80px',
        paddingRight: '80px'
      }}
    >
      <div 
        className="w-full"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '100px'
        }}
      >
        {/* Left Side: Text Content (48% width) */}
        <div 
          className="space-y-8"
          style={{ 
            width: '48%',
            paddingRight: '0'
          }}
        >
          <div className="space-y-6">
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}
              
            >
              At ISO, your defender becomes your coach.
            </h1>
            
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              You're not lost — you're just <span className="text-orange-500 font-semibold">In Search Of</span>.
            </h2>
            
            <p 
              className="text-lg md:text-xl lg:text-xl text-slate-300 leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              A faith-driven coaching movement rooted in authentic community uplift and empowerment. Inspired by basketball culture, ISO makes mentorship relatable, human, and culturally grounded for underserved communities.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={scrollToCourt}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg shadow-orange-500/20"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Explore Pathways
            </button>
            
            <button
              onClick={handleLearnHowItWorks}
              className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Learn How ISO Works
            </button>
          </div>
        </div>

        {/* Right Side: Image (52% width) */}
        <div 
          style={{ 
            width: '52%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            minHeight: '600px'
          }}
        >
          <div className="relative" style={{ width: '100%', height: '100%', maxWidth: '100%' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ 
              boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.3), 0 0 60px rgba(249, 115, 22, 0.1)',
              width: '100%',
              height: '100%',
              minHeight: '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/ChatGPT Image Nov 14, 2025, 12_50_27 AM.png" 
                alt="ISO Institute - Basketball Court with Mentorship Theme"
                style={{ 
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: '42% center'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
