import Link from "next/link"
import { Film, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-slate-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Film className="h-6 w-6 text-amber-500" />
              <span className="text-xl font-bold text-white">LUMIÈRE</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Experience cinema like never before. Book tickets, reserve parking, and win rewards with our AI-powered quiz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-amber-500 transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Win Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <a href="mailto:support@lumiere.cinema" className="text-gray-400 hover:text-amber-500 transition-colors">
                  support@lumiere.cinema
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-amber-500 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <span className="text-gray-400">Pan India Locations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-500 md:flex-row">
          <p>© {currentYear} LUMIÈRE Cinema. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-amber-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-amber-500 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-amber-500 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
