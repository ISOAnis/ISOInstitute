export function WhatIsISO() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* First Section: Large Hero Text */}
        <div className="mb-24 lg:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Large Text */}
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span className="text-slate-400">Where faith and</span>
                <br />
                <span className="text-white">coaching meet the</span>
                <br />
                <span className="text-white">language of basketball</span>
              </h2>
            </div>
            
            {/* Right: Description */}
            <div>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ISO Institute bridges the gap between spiritual guidance and professional development, 
                using basketball as the universal language that connects coaches and players.
              </p>
            </div>
          </div>
        </div>

        {/* Second Section: What Calling an ISO Means */}
        <div className="border-t border-slate-800 pt-16 lg:pt-20">
          {/* Section Header */}
          <div className="mb-12">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What Calling an ISO means
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: "Call an ISO" Large Text */}
            <div>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span className="text-slate-400">Call</span>
                <br />
                <span className="text-white">an ISO</span>
              </h3>
            </div>
            
            {/* Right: Description */}
            <div>
              <div className="space-y-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                  In basketball, calling an ISO means isolating a player one-on-one against their defender. 
                  It's about trusting your skills, relying on your preparation, and taking control of the moment.
                </p>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                  At ISO Institute, "Calling an ISO" means connecting with a coach who understands your unique 
                  journey. It's about finding guidance in faith, direction in career, and courage in personal growth. 
                  Your coach helps you navigate life's court with confidence and purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

