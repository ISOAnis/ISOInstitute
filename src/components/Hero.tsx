export function Hero() {
  const scrollToCourt = () => {
    const courtSection = document.getElementById('basketball-court');
    if (courtSection) {
      courtSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-32 pb-8 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 bg-slate-950">
      <div className="w-full">
        {/* Main Content */}
        <div className="mb-16">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Basketball Court Image with ISO Text - Above Analytics */}
            <div className="pt-12 mt-8">
              <div className="relative w-full max-w-5xl mx-auto aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                {/* Placeholder for basketball court image - replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                  {/* Basketball court lines overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                    <circle cx="200" cy="100" r="30" fill="none" stroke="#f97316" strokeWidth="2" />
                    <line x1="200" y1="0" x2="200" y2="200" stroke="#f97316" strokeWidth="2" />
                  </svg>
                  
                  {/* Left figure placeholder */}
                  <div className="absolute left-[10%] bottom-0 w-20 h-40">
                    <div className="w-full h-full bg-slate-800/80 rounded-t-full shadow-2xl"></div>
                  </div>
                  
                  {/* ISO Text in Center */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <h2 className="text-7xl md:text-9xl font-bold text-white tracking-wider drop-shadow-[0_0_30px_rgba(249,115,22,0.9)]">
                      ISO
                    </h2>
                  </div>
                  
                  {/* Right figure placeholder */}
                  <div className="absolute right-[10%] bottom-0 w-20 h-40">
                    <div className="w-full h-full bg-slate-800/80 rounded-t-full shadow-2xl"></div>
                  </div>
                </div>
                
                {/* Uncomment and replace with actual image when available */}
                {/* <img 
                  src="/path-to-basketball-court-image.jpg" 
                  alt="Basketball court with two figures"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <h2 className="text-7xl md:text-9xl font-bold text-white tracking-wider drop-shadow-[0_0_30px_rgba(249,115,22,0.9)]">
                    ISO
                  </h2>
                </div> */}
              </div>
            </div>

            {/* Comparison Table Section */}
            <div className="pt-12 mt-8">
              <div className="mb-24 text-center max-w-5xl mx-auto">
                <h2 
                  className="text-5xl md:text-6xl font-bold text-white leading-tight mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  ISO <span className="text-orange-500">IS</span> <span className="text-orange-500">1 of 1</span>
                </h2>
                <p 
                  className="text-slate-400 text-lg md:text-xl leading-relaxed mt-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  The only mentorship platform built for faith-driven, community-first growth.
                </p>
              </div>
              
              {/* Responsive table container with horizontal scroll */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full border-collapse" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <thead>
                      <tr className="bg-slate-900 border-b-2 border-slate-700">
                        <th className="sticky left-0 z-20 bg-slate-900 px-4 py-3 text-left text-base font-bold text-white border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Key Features & Focus
                        </th>
                        <th className="px-4 py-3 text-center text-base font-bold text-white border-l-2 border-r-2 border-orange-500/50" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>ISO Institute</th>
                        <th className="px-4 py-3 text-center text-base font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Leland</th>
                        <th className="px-4 py-3 text-center text-base font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>MentorCruise</th>
                        <th className="px-4 py-3 text-center text-base font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>CoachHub</th>
                        <th className="px-4 py-3 text-center text-base font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>LinkedIn Coaches</th>
                      </tr>
                    </thead>
                    <tbody className="[&>tr:nth-child(odd)]:bg-slate-900/20">
                      {/* Holistic Mentorship */}
                      <tr className="border-b border-slate-800">
                        <td className="sticky left-0 z-10 bg-slate-900/20 px-4 py-3 text-sm font-medium text-slate-300 border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Holistic Mentorship (Career + Spiritual + Personal)
                        </td>
                        <td className="px-4 py-3 text-center text-base border-l-2 border-r-2 border-orange-500/40" style={{ backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>
                          <span className="text-xl" style={{ color: '#22c55e' }}>✓</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#ef4444' }}>✗</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#ef4444' }}>✗</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#ef4444' }}>✗</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#ef4444' }}>✗</span>
                        </td>
                      </tr>
                      {/* Mentor Freedom to Set Rate */}
                      <tr className="border-b border-slate-800">
                        <td className="sticky left-0 z-10 bg-slate-900/20 px-4 py-3 text-sm font-medium text-slate-300 border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Mentor Freedom to Set Rate
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-200 border-l-2 border-r-2 border-orange-500/40" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>Mentors choose price or offer free mentorship</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Coaches set price</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Coaches set price</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Fixed corporate contracts</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Coaches set price</td>
                      </tr>
                      {/* Brand-Building for Mentors */}
                      <tr className="border-b border-slate-800">
                        <td className="sticky left-0 z-10 bg-slate-900/20 px-4 py-3 text-sm font-medium text-slate-300 border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Brand-Building for Mentors
                        </td>
                        <td className="px-4 py-3 text-center text-base border-l-2 border-r-2 border-orange-500/40" style={{ backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>
                          <span className="text-xl" style={{ color: '#22c55e' }}>✓</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#22c55e' }}>✓</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#22c55e' }}>✓</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#ef4444' }}>✗</span>
                        </td>
                        <td className="px-4 py-3 text-center text-base">
                          <span className="text-xl" style={{ color: '#ef4444' }}>✗</span>
                        </td>
                      </tr>
                      {/* In-Person Grassroots Youth Engagement */}
                      <tr className="border-b border-slate-800">
                        <td className="sticky left-0 z-10 bg-slate-900/20 px-4 py-3 text-sm font-medium text-slate-300 border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          In-Person Grassroots Youth Engagement
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-200 border-l-2 border-r-2 border-orange-500/40" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>Visits schools, masajid, community centers</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>No in-person</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>No in-person</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Corporate HR events only</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>No in-person</td>
                      </tr>
                      {/* Target Audience */}
                      <tr className="border-b border-slate-800">
                        <td className="sticky left-0 z-10 bg-slate-900/20 px-4 py-3 text-sm font-medium text-slate-300 border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Target Audience
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-200 border-l-2 border-r-2 border-orange-500/40" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>Youth + first-gen + underserved communities</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>High-income professionals</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Tech workers + students</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Corporations</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Anyone on LinkedIn</td>
                      </tr>
                      {/* Pricing for Mentees */}
                      <tr className="border-b border-slate-800">
                        <td className="sticky left-0 z-10 bg-slate-900/20 px-4 py-3 text-sm font-medium text-slate-300 border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Pricing for Mentees
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-200 border-l-2 border-r-2 border-orange-500/40" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>Low-cost/free options available</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>$$$ expensive coaching</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>$$ mid-range</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>$$$ paid by employers</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>$-$$ depending on coach</td>
                      </tr>
                      {/* Platform Intention */}
                      <tr className="border-b border-slate-800">
                        <td className="sticky left-0 z-10 bg-slate-900/20 px-4 py-3 text-sm font-medium text-slate-300 border-r-2 border-slate-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Platform Intention
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-200 border-l-2 border-r-2 border-orange-500/40" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: 'rgba(249, 115, 22, 0.05)', borderLeft: '3px solid #f97316' }}>Community uplift + spiritual guidance + opportunity pipeline</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Career advancement</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Tech career help</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Corporate performance</td>
                        <td className="px-4 py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Freelance coaching</td>
                      </tr>
                    </tbody>
                  </table>
          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}