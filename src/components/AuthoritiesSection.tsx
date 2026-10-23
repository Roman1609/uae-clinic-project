"use client";

import { Award, ShieldCheck, TrendingUp, Users, CheckCircle2 } from "lucide-react";

const metrics = [
  {
    value: "100%",
    label: "DHA Audit Pass Rate",
    description: "Every facility designed by our architects passes regulatory inspection without costly rework.",
  },
  {
    value: "50+",
    label: "Clinics Launched",
    description: "Successfully established aesthetic centers, dental clinics, and polyclinics across Dubai.",
  },
  {
    value: "45 Days",
    label: "Average Setup Speed",
    description: "From corporate incorporation to preliminary architectural approval and license receipt.",
  },
  {
    value: "AED 250M+",
    label: "Client Assets Deployed",
    description: "Guiding international doctors, venture funds, and private investors in Dubai healthcare.",
  },
];

export default function AuthoritiesSection() {
  return (
    <section id="authorities" className="relative py-24 bg-obsidian-surface border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-obsidian-card/70 border border-white/[0.08] hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="font-playfair text-4xl sm:text-5xl font-extrabold gold-gradient-text mb-3">
                  {m.value}
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                  {m.label}
                </div>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>

        {/* Sovereign Authorities & Institutional Compliance Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-obsidian-card via-obsidian-card/90 to-obsidian border border-gold-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-gold-glow">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              Sovereign Regulatory Alignment
            </div>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
              Direct Relationships with UAE Health Regulators
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              We eliminate intermediaries by directly submitting and defending your clinical applications with the Dubai Health Authority (DHA) and UAE Ministry of Health and Prevention (MOHAP).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="#contact"
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-obsidian bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 shadow-gold-glow hover:scale-105 transition-all duration-300"
            >
              Verify Your Eligibility
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
