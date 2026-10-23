"use client";

import { useState, useEffect } from "react";
import { Phone, Menu, X, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Strategic Process", href: "#process" },
    { name: "Specialties", href: "#specialties" },
    { name: "Licensing & Authorities", href: "#authorities" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-obsidian/90 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-obsidian/90 via-obsidian/40 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300">
                <div className="w-[34px] h-[34px] rounded-lg bg-obsidian flex items-center justify-center">
                  <span className="font-playfair text-gold-400 font-bold text-lg leading-none tracking-tighter">
                    D<span className="text-white text-xs">M</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair tracking-[0.2em] text-lg font-bold text-white uppercase leading-tight group-hover:text-gold-300 transition-colors">
                  DubaiMed
                </span>
                <span className="text-[10px] tracking-[0.3em] font-medium text-gold-400 uppercase leading-none">
                  Consult • UAE
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden min-[1101px]:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-gold-400 transition-colors duration-200 tracking-wide relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Action buttons */}
            <div className="hidden min-[1101px]:flex items-center gap-4">
              <a
                href="https://wa.me/9714800633"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-gold-400 transition-colors px-3 py-2 rounded-lg border border-white/10 hover:border-gold-500/30"
              >
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>+971 4 800 MED</span>
              </a>

              <a
                href="#contact"
                className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5 font-bold">
                  Book Consultation
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex min-[1101px]:hidden items-center gap-3">
              <a
                href="#contact"
                className="px-3.5 py-1.5 text-xs font-bold text-obsidian bg-gold-400 rounded-md"
              >
                Book
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-lg bg-obsidian-card border border-white/10 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gold-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gold-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-2xl min-[1101px]:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full justify-between px-6 pt-28 pb-10">
          <div className="flex flex-col gap-6">
            <div className="text-[11px] font-semibold tracking-widest text-gold-400 uppercase">
              Navigation Menu
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-playfair text-2xl font-medium text-slate-200 hover:text-gold-400 transition-colors flex items-center justify-between py-2 border-b border-white/[0.06]"
                >
                  {link.name}
                  <ArrowUpRight className="w-5 h-5 text-gold-400/60" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <div className="p-4 rounded-xl bg-obsidian-card border border-gold-500/20">
              <div className="flex items-center gap-3 text-gold-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  DHA & MOH Approved Advisory
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Downtown Dubai / DIFC / Dubai Healthcare City
              </p>
            </div>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 rounded-xl shadow-gold-glow"
            >
              Get Free Consultation
            </a>

            <a
              href="https://wa.me/9714800633"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-center text-xs font-semibold text-slate-300 rounded-xl border border-white/10 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              Direct WhatsApp: +971 4 800 MED
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
