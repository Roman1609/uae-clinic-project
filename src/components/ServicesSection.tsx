"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  Users2,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  Award,
} from "lucide-react";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: typeof ShieldCheck;
  description: string;
  deliverables: string[];
  timeline: string;
  authority: string;
}

const services: ServiceItem[] = [
  {
    id: "licensing",
    number: "01",
    title: "Regulatory & Licensing (DHA / MOH / DOH)",
    subtitle: "Complete medical facility & practitioner approvals",
    icon: ShieldCheck,
    description:
      "End-to-end administration through Dubai Health Authority (DHA), UAE Ministry of Health and Prevention (MOHAP), and Abu Dhabi Department of Health (DOH). We guarantee zero rejection risk.",
    deliverables: [
      "DHA Initial Approval & Health Facility Identification",
      "Medical Practitioner & Allied Staff Credentialing",
      "Radiation Protection, Laser & Specialized Unit Permits",
      "Official Final Audit & Operating License Clearance",
    ],
    timeline: "20 - 35 Business Days",
    authority: "DHA & MOHAP Certified",
  },
  {
    id: "legal",
    number: "02",
    title: "Legal Structuring & Company Registration",
    subtitle: "Mainland (DED) & Free Zone (DHCC) Incorporation",
    icon: Building2,
    description:
      "Full 100% foreign ownership corporate setups tailored for medical operations. Commercial license issuance, corporate bank account facilitation, and medical partnership structuring.",
    deliverables: [
      "100% Foreign Ownership Mainland / Free Zone Setup",
      "Dubai Healthcare City (DHCC) Authority Registration",
      "Corporate Banking Onboarding with Top UAE Tier-1 Banks",
      "Notarized Articles of Association & Legal Representation",
    ],
    timeline: "10 - 15 Business Days",
    authority: "Dubai Economy & Tourism (DET) / DHCC",
  },
  {
    id: "fitout",
    number: "03",
    title: "Facility Leasing & Medical Compliance Fit-out",
    subtitle: "DHA Engineering Guidelines & Civil Defence Approvals",
    icon: Stethoscope,
    description:
      "Strategic prime real estate acquisition in Jumeirah, Downtown, and Business Bay. Complete architectural MEP engineering strictly validated against DHA Room Sizing & HVAC protocols.",
    deliverables: [
      "Prime Healthcare Location Scouting & Lease Negotiation",
      "DHA Architectural & Clinical Engineering Approval",
      "Dubai Civil Defence (DCD) & Municipality Clearance",
      "Cleanroom, Airborne Infection & Medical Waste Verification",
    ],
    timeline: "30 - 60 Calendar Days",
    authority: "Dubai Municipality & Civil Defence",
  },
  {
    id: "procurement",
    number: "04",
    title: "Equipment Procurement & Professional Staffing",
    subtitle: "Tier-1 Medical Technology & Licensed Talent Sourcing",
    icon: Users2,
    description:
      "Turnkey medical supply chain management. We partner directly with global OEM distributors for CE/FDA certified medical diagnostic devices and source licensed healthcare specialists worldwide.",
    deliverables: [
      "Global OEM Device Procurement (Siemens, Philips, GE)",
      "Medical Director & Specialist Physician Recruitment",
      "DHA License Conversions for International Practitioners",
      "Staff Visa Processing, Malpractice Insurance & Onboarding",
    ],
    timeline: "Ongoing & Rapid Turnaround",
    authority: "OEM Direct & HR Compliance",
  },
];

export default function ServicesSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="services" className="relative py-32 bg-obsidian overflow-hidden">
      {/* Background ambient gold glows */}
      <div className="ambient-glow w-[600px] h-[600px] bg-gold-500/5 -top-40 right-10" />
      <div className="ambient-glow w-[500px] h-[500px] bg-gold-600/5 bottom-10 -left-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-card border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            End-To-End Advisory Ecosystem
          </div>

          <h2 className="font-playfair text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Comprehensive Solutions for <br />
            <span className="gold-gradient-text">Healthcare Business</span>
          </h2>

          <p className="font-jakarta text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            From initial sovereign regulatory feasibility to the ribbon-cutting of your state-of-the-art facility, our specialized Dubai team orchestrates every critical milestone.
          </p>
        </div>

        {/* 4 Glassmorphism Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            const isHovered = hoveredCard === service.id;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-500 flex flex-col justify-between group overflow-hidden ${
                  isHovered
                    ? "bg-obsidian-card/90 border-gold-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.2)] -translate-y-1.5"
                    : "bg-obsidian-card/50 border-white/[0.08] shadow-card-dark"
                } border backdrop-blur-xl`}
              >
                {/* Corner Number Badge */}
                <div className="absolute top-8 right-8 font-playfair text-3xl sm:text-4xl font-bold text-white/[0.07] group-hover:text-gold-500/20 transition-colors duration-300">
                  {service.number}
                </div>

                {/* Subtle top gold accent bar on hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div>
                  {/* Icon & Authority Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-obsidian-surface to-obsidian border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-inner group-hover:scale-110 group-hover:border-gold-400 transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-obsidian/80 px-3 py-1 rounded-full border border-white/5">
                      {service.authority}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-playfair text-2xl font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gold-400/90 mb-4">
                    {service.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm font-light leading-relaxed mb-8">
                    {service.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="space-y-3 pt-4 border-t border-white/[0.06] mb-8">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Key Deliverables & Clearances
                    </div>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-200 leading-snug font-normal">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Timeline & Action */}
                <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      Typical Turnaround
                    </span>
                    <span className="text-xs font-semibold text-gold-300">
                      {service.timeline}
                    </span>
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-gold-400 transition-colors"
                  >
                    <span>Inquire Solution</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dubai Government Accreditations Trust Bar */}
        <div className="mt-16 p-8 rounded-2xl bg-obsidian-card/40 border border-white/[0.06] backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-playfair text-lg font-bold text-white">
                  Direct Institutional Liaison in the UAE
                </h4>
                <p className="text-xs text-slate-400">
                  Fully aligned with Dubai Health Authority (DHA), MOHAP UAE, and Dubai Department of Economy and Tourism (DET).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="hover:text-gold-400 transition-colors">DHA Dubai</span>
              <span className="text-white/20">•</span>
              <span className="hover:text-gold-400 transition-colors">MOHAP Federal</span>
              <span className="text-white/20">•</span>
              <span className="hover:text-gold-400 transition-colors">DHCC Freezone</span>
              <span className="text-white/20">•</span>
              <span className="hover:text-gold-400 transition-colors">DOH Abu Dhabi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
