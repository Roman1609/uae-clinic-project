"use client";

import { ShieldCheck, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-white/[0.08] text-slate-400 font-jakarta text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center shadow-gold-glow">
                <div className="w-8 h-8 rounded-lg bg-obsidian flex items-center justify-center">
                  <span className="font-playfair text-gold-400 font-bold text-base leading-none">
                    D<span className="text-white text-[10px]">M</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair tracking-[0.2em] text-base font-bold text-white uppercase">
                  DubaiMed
                </span>
                <span className="text-[9px] tracking-[0.3em] font-medium text-gold-400 uppercase">
                  Consult • UAE
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs font-light leading-relaxed max-w-sm">
              The premier healthcare licensing and medical clinic establishment advisory in the United Arab Emirates. Empowering world-class physicians and global healthcare investors with seamless regulatory execution.
            </p>

            <div className="flex items-center gap-2 text-gold-400/90 text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>DHA • MOHAP • DOH • DHCC Compliant Advisory</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" className="hover:text-gold-400 transition-colors">
                  DHA / MOH Licensing
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-400 transition-colors">
                  Mainland & DHCC Incorporation
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-400 transition-colors">
                  Clinic Architectural Fit-out
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-400 transition-colors">
                  Medical Device Procurement
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-400 transition-colors">
                  Physician Credentialing
                </a>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-white uppercase tracking-wider mb-4">
              Specialties
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#specialties" className="hover:text-gold-400 transition-colors">
                  Aesthetic Surgery Clinics
                </a>
              </li>
              <li>
                <a href="#specialties" className="hover:text-gold-400 transition-colors">
                  Dental & Implant Centers
                </a>
              </li>
              <li>
                <a href="#specialties" className="hover:text-gold-400 transition-colors">
                  Day Surgery Hospitals
                </a>
              </li>
              <li>
                <a href="#specialties" className="hover:text-gold-400 transition-colors">
                  Longevity & IV Therapy
                </a>
              </li>
              <li>
                <a href="#specialties" className="hover:text-gold-400 transition-colors">
                  Dermatology & Laser
                </a>
              </li>
            </ul>
          </div>

          {/* Dubai Headquarters */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-white uppercase tracking-wider mb-4">
              Executive Office
            </h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <p className="text-white font-medium">Al Sa&apos;ada Tower, Level 28</p>
              <p>DIFC / Downtown Business Bay</p>
              <p>Dubai, United Arab Emirates</p>
              <p className="pt-2">
                <a href="tel:+9714800633" className="text-gold-400 hover:text-white transition-colors">
                  +971 4 800 MED (633)
                </a>
              </p>
              <p>
                <a href="mailto:advisory@dubaimedconsult.com" className="text-gold-400 hover:text-white transition-colors">
                  advisory@dubaimedconsult.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 text-center md:text-left">
            © 2026 DubaiMed Consult LLC. All rights reserved. Registered healthcare setup advisory in Dubai, UAE.
          </p>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold-400 transition-colors">DHA Regulatory Guide</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
