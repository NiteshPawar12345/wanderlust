import React from 'react';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
        
        {/* Social Icons */}
        <div className="flex items-center gap-5">
          <a href="#" aria-label="Facebook" className="hover:text-white transition-colors p-2.5 bg-slate-800 rounded-full hover:scale-110 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white transition-colors p-2.5 bg-slate-800 rounded-full hover:scale-110 transition-transform">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors p-2.5 bg-slate-800 rounded-full hover:scale-110 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>

        {/* Branding */}
        <div className="text-sm font-medium flex items-center gap-1.5 text-slate-300">
          <span>&copy; {new Date().getFullYear()} Wanderlust Private Limited. All rights reserved.</span>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-6 text-xs font-semibold tracking-wide uppercase">
          <a href="#" className="hover:text-white hover:underline transition-colors">
            Privacy Policy
          </a>
          <span className="text-slate-700 font-bold">•</span>
          <a href="#" className="hover:text-white hover:underline transition-colors">
            Terms of Service
          </a>
          <span className="text-slate-700 font-bold">•</span>
          <a href="#" className="hover:text-white hover:underline transition-colors">
            Contact Us
          </a>
        </div>

        <div className="flex items-center gap-1 text-slate-600 text-xs font-medium mt-2">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-brand fill-current" />
          <span>for premium travelers</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
