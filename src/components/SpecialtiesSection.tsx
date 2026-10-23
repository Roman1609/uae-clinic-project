"use client";

import { Sparkles, HeartPulse, Smile, Activity, FlaskConical, Stethoscope, Baby } from "lucide-react";

const specialties = [
  {
    icon: Sparkles,
    name: "Aesthetic & Plastic Surgery",
    location: "Jumeirah & Downtown Dubai",
    details: "High-spec Class 1 Day Surgery units, laminar flow ORs, and sterile recovery suites.",
    tag: "High ROI Sector",
  },
  {
    icon: Smile,
    name: "Dental & Implantology Centers",
    location: "Business Bay & DIFC",
    details: "DHA CBCT radiation room shielding, sterilization zones, and chair ergonomics.",
    tag: "Rapid Launch",
  },
  {
    icon: Activity,
    name: "Multi-Specialty Polyclinics",
    location: "Dubai Healthcare City (DHCC)",
    details: "Integrated diagnostic imaging, phlebotomy, and pharmacy integration approvals.",
    tag: "Full Scale",
  },
  {
    icon: FlaskConical,
    name: "Longevity & IV Therapy Lounges",
    location: "Palm Jumeirah & Marina",
    details: "DHA specialized protocol for vitamin infusion, hyperbaric oxygen, and cryotherapy.",
    tag: "Booming Market",
  },
  {
    icon: Stethoscope,
    name: "Dermatology & Laser Centers",
    location: "City Walk & Al Wasl",
    details: "Class 4 laser safety officer compliance, smoke evacuation, and consultation suites.",
    tag: "Premium Demand",
  },
  {
    icon: Baby,
    name: "Pediatric & Women's Health",
    location: "Dubai Hills & Arabian Ranches",
    details: "Family medicine, ultrasound diagnostic licenses, and specialized nursing ratios.",
    tag: "Community Need",
  },
];

export default function SpecialtiesSection() {
  return (
    <section id="specialties" className="relative py-28 bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-400 mb-3 block">
              Market Specialties
            </span>
            <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white leading-tight">
              Clinical Sectors We <br />
              <span className="gold-gradient-text">License & Launch</span>
            </h2>
          </div>
          <p className="font-jakarta text-slate-300 text-sm sm:text-base font-light max-w-md">
            Whether you are opening a boutique aesthetic lounge or a 20,000 sq ft day surgery hospital, our regulatory engineering covers all medical disciplines in the UAE.
          </p>
        </div>

        {/* Grid of Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-2xl bg-obsidian-card/60 border border-white/[0.07] hover:border-gold-500/40 hover:bg-obsidian-card transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-obsidian-surface border border-white/10 flex items-center justify-center text-gold-400 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400/90 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20">
                      {spec.tag}
                    </span>
                  </div>

                  <h3 className="font-playfair text-xl font-bold text-white mb-1.5 group-hover:text-gold-300 transition-colors">
                    {spec.name}
                  </h3>

                  <div className="text-xs text-slate-400 font-medium mb-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    {spec.location}
                  </div>

                  <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
                    {spec.details}
                  </p>
                </div>

                <a
                  href="#contact"
                  className="text-xs font-semibold text-gold-400 group-hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Consult for this specialty →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
