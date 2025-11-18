type Page = 'home' | 'pathways' | 'about' | 'community' | 'call-iso';

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/ISOV1Logo.jpg" 
                alt="ISO Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback to emoji icon if logo doesn't exist yet
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              <div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <span className="text-white">☪️</span>
              </div>
              <div>
                <span className="text-white block font-bold">ISO</span>
              </div>
            </div>
            <p className="text-slate-400">
              Muslim-founded coaching institute helping you strengthen faith, discipline, and purpose.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Pathways</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#deen" className="hover:text-white transition-colors">Deen & Purpose</a></li>
              <li><a href="#health" className="hover:text-white transition-colors">Health & Fitness</a></li>
              <li><a href="#medicine" className="hover:text-white transition-colors">Medicine & Healthcare</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">More Paths</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#engineering" className="hover:text-white transition-colors">Engineering & Technology</a></li>
              <li><a href="#entrepreneurship" className="hover:text-white transition-colors">Entrepreneurship</a></li>
              <li><a href="#global" className="hover:text-white transition-colors">Global Affairs & Business</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">About ISO</a></li>
              <li><a href="#mentors" className="hover:text-white transition-colors">Our Coaches</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Coaching Nights</a></li>
              <li><span className="text-slate-500 text-sm uppercase tracking-wide">Coming Soon</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; 2025 ISO. In Search Of your next move.</p>
        </div>
      </div>
    </footer>
  );
}
