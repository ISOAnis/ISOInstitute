import { Instagram, Linkedin, Mail, Youtube } from "lucide-react";

type Page = "home" | "pathways" | "about" | "community" | "call-iso";

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer
      className="text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5"
      style={{ background: "#111111" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Left Column - Logo and Tagline */}
          <div>
            <div className="mb-6">
              <img
                src="/ISO OFFICIAL.png"
                alt="ISO Logo"
                className="h-12 w-auto object-contain mb-4"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div className="space-y-1">
                <p
                  className="text-white text-lg"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  THE COMMUNITY.
                </p>
                <p
                  className="text-white text-lg"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  THE MOVEMENT.
                </p>
                <p
                  className="text-white text-lg"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  THE EXPERIENCE.
                </p>
              </div>
            </div>
          </div>

          {/* Resources Column */}
          <div>
            <h4
              className="mb-4 font-semibold uppercase tracking-wide"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: "#a8a8a8",
              }}
            >
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4
              className="mb-4 font-semibold uppercase tracking-wide"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: "#a8a8a8",
              }}
            >
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate?.("about")}
                  className="text-white hover:text-orange-500 transition-colors text-left"
                >
                  Our Story
                </button>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white hover:text-orange-500 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h4
              className="mb-4 font-semibold uppercase tracking-wide"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: "#a8a8a8",
              }}
            >
              Follow Us
            </h4>
            <div className="grid grid-cols-2 gap-3 w-fit">
              <a
                href="https://www.instagram.com/isoinstitute/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/company/isoinstitute/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@isoinstitute"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition-colors"
                aria-label="Follow us on YouTube"
              >
                <Youtube className="w-6 h-6 text-white" />
              </a>
              <a
                href="mailto:info@isoinstitute.com"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition-colors"
                aria-label="Send us an email"
              >
                <Mail className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/70">
          <p>
            &copy; {new Date().getFullYear()} ISO Institute. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
