"use client";

import { CheckCircle2, ChevronRight, Clock, FileCheck, Layers, Sparkles } from "lucide-react";

const steps = [
  {
    phase: "01",
    title: "Feasibility & Corporate Structuring",
    duration: "Week 1 - 2",
    description:
      "We define the clinical scope, choose optimal jurisdiction (Mainland vs DHCC Freezone), reserve commercial trade names, and execute 100% foreign-ownership structuring.",
    highlights: ["Clinical Scope Definition", "Trade Name Reservation", "Foreign Ownership Structure"],
  },
  {
    phase: "02",
    title: "Real Estate & DHA Architectural Approval",
    duration: "Week 3 - 4",
    description:
      "Selection of pre-qualified medical real estate. Drafting of architectural drawings compliant with DHA Health Facility Guidelines and securing preliminary engineering NOCs.",
    highlights: ["Medical Lease Scouting", "DHA Architectural Drawing Approvals", "Civil Defence / Municipality NOC"],
  },
  {
    phase: "03",
    title: "Facility Fit-out & Medical Credentialing",
    duration: "Week 5 - 7",
    description:
      "Overseeing contractor execution for specialized cleanrooms, radiation rooms, medical gas lines, and processing DHA licenses for Doctors, Medical Directors, and Allied staff.",
    highlights: ["MEP & Clinical Fit-out Supervision", "Physician DHA Credentialing", "Medical Equipment Installation"],
  },
  {
    phase: "04",
    title: "Final DHA Audit & Operational Handover",
    duration: "Week 8",
    description:
      "Conducting pre-audit mock inspections. Accompanying Dubai Health Authority inspectors for official site verification, receiving the permanent operational license.",
    highlights: ["Mock Authority Audit", "DHA Final Site Inspection", "Permanent Operating License Issued"],
  },
];

export default function ProcessRoadmap() {
  return (
    <section id="process" className="relative py-28 bg-obsidian-light border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-card border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 shadow-gold-glow">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            Predictable 45 to 60-Day Delivery
          </div>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white mb-6">
            The Strategic <span className="gold-gradient-text">Execution Roadmap</span>
          </h2>
          <p className="font-jakarta text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            A battle-tested 4-step framework engineered to eliminate administrative bottlenecks and accelerate your time-to-market in Dubai’s booming medical sector.
          </p>
        </div>

        {/* 4 Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={step.phase}
              className="relative p-7 rounded-2xl bg-obsidian-card border border-white/[0.07] hover:border-gold-500/50 hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-playfair text-3xl font-extrabold text-gold-400/80 group-hover:text-gold-300 transition-colors">
                    {step.phase}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-obsidian px-2.5 py-1 rounded-md border border-white/5">
                    {step.duration}
                  </span>
                </div>

                <h3 className="font-playfair text-xl font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                {step.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 text-center">
          <p className="text-sm text-slate-400">
            Need an accelerated fast-track for an existing medical license or clinic takeover?{" "}
            <a href="#contact" className="text-gold-400 font-semibold underline underline-offset-4 hover:text-gold-300">
              Request an emergency advisory session →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
