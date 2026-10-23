"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    specialty: "Aesthetics & Plastic Surgery",
    timeline: "Within 3 Months",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const specialtiesList = [
    "Aesthetics & Plastic Surgery",
    "Dentistry & Implantology",
    "Multi-specialty Clinic",
    "Dermatology & Laser",
    "Longevity & IV Wellness",
    "Day Surgery Hospital",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error("Form submission error:", err);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 bg-obsidian overflow-hidden">
      {/* Background ambient lighting */}
      <div className="ambient-glow w-[500px] h-[500px] bg-gold-500/10 top-20 right-10" />
      <div className="ambient-glow w-[400px] h-[400px] bg-gold-600/5 -bottom-20 -left-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-card border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Strategic Consultation
          </div>

          <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Launch Your Medical <br />
            <span className="gold-gradient-text">Project in Dubai</span>
          </h2>

          <p className="font-jakarta text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Leave your request and our senior consultants will contact you for an initial strategic consultation.
          </p>
        </div>

        {/* Contact Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-obsidian-card/80 border border-white/[0.08] p-8 sm:p-12 backdrop-blur-2xl shadow-card-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700" />

            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gold-500/20 border-2 border-gold-400 flex items-center justify-center text-gold-400 mb-6 shadow-gold-glow animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
                  Consultation Request Received
                </h3>
                <p className="text-sm text-slate-300 font-light max-w-md mb-8 leading-relaxed">
                  Thank you, <span className="text-gold-400 font-medium">{formData.fullName || "Doctor"}</span>. A Senior Healthcare Setup Director will review your requirements and reach out via WhatsApp / phone within 2 business hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <a
                    href="https://wa.me/9714800633"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-obsidian bg-gold-400 hover:bg-gold-300 transition-colors shadow-gold-glow"
                  >
                    Open Direct WhatsApp Chat
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-white/10"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
                    <span>{errorMessage}</span>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="text-red-400 hover:text-white font-bold ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Full Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alexander Wright"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-obsidian-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Phone / WhatsApp Number <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +971 50 123 4567 or +44 7911 123456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-obsidian-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Preferred Clinic Specialty <span className="text-gold-400">*</span>
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-obsidian-surface border border-white/10 text-white text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  >
                    {specialtiesList.map((item) => (
                      <option key={item} value={item} className="bg-obsidian text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick specialty selection pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {specialtiesList.slice(0, 4).map((spec) => (
                    <button
                      type="button"
                      key={spec}
                      onClick={() => setFormData({ ...formData, specialty: spec })}
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all ${
                        formData.specialty === spec
                          ? "border-gold-400 bg-gold-500/10 text-gold-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                          : "border-white/10 bg-obsidian-surface/60 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Target Setup Timeline & Project Vision
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your estimated launch window, desired location (Downtown, Jumeirah, DHCC), or specific licensing queries..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-surface border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors resize-none"
                  />
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Request...</span>
                    </div>
                  ) : (
                    <>
                      <span>Get Consultation</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                  <Lock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Strict Confidentiality • Non-Disclosure Agreement (NDA) Protected</span>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Advisory Concierge (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office Card */}
            <div className="p-8 rounded-3xl bg-obsidian-card/60 border border-white/[0.08] backdrop-blur-xl">
              <h3 className="font-playfair text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_#D4AF37]" />
                Dubai Executive Headquarters
              </h3>

              <div className="space-y-5 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Al Sa&apos;ada Tower, Level 28</div>
                    <div className="text-slate-400 text-xs">
                      DIFC / Downtown Business Hub, Dubai, UAE
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Direct Medical Concierge</div>
                    <a
                      href="tel:+9714800633"
                      className="text-gold-300 hover:text-white transition-colors text-xs font-medium"
                    >
                      +971 4 800 MED (633)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Confidential Inquiries</div>
                    <a
                      href="mailto:advisory@dubaimedconsult.com"
                      className="text-gold-300 hover:text-white transition-colors text-xs font-medium"
                    >
                      advisory@dubaimedconsult.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Executive Advisory Hours</div>
                    <div className="text-slate-400 text-xs">
                      Monday – Saturday: 9:00 AM – 7:00 PM (GST)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp VIP Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-obsidian-surface to-obsidian-card border border-gold-500/30 shadow-gold-glow">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-2 block">
                Instant Response Channel
              </span>
              <h4 className="font-playfair text-lg font-bold text-white mb-2">
                Need Immediate DHA Guidance?
              </h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
                Connect directly with our Principal Healthcare Licensing Director via WhatsApp for immediate feasibility checks.
              </p>
              <a
                href="https://wa.me/9714800633"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-obsidian bg-gold-400 hover:bg-gold-300 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Chat with Senior Consultant
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
