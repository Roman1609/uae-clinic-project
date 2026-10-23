"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can foreign doctors or international investors own 100% of a medical clinic in Dubai?",
    answer:
      "Yes. Under UAE commercial law and the Foreign Direct Investment (FDI) framework, foreign nationals can hold 100% full ownership of mainland healthcare companies and Dubai Healthcare City (DHCC) freezone clinics. A local UAE national shareholder is no longer mandatory.",
  },
  {
    question: "How long does a complete turnkey clinic setup take in Dubai?",
    answer:
      "A typical turnkey setup takes approximately 45 to 60 calendar days from initial feasibility to operational licensing. Our established relationships with the Dubai Health Authority (DHA) and fast-tracked architectural reviews minimize standard government waiting periods significantly.",
  },
  {
    question: "What is the difference between Dubai Mainland (DHA) and Dubai Healthcare City (DHCC)?",
    answer:
      "Mainland clinics are licensed by the DHA and can operate anywhere in Dubai (e.g., Jumeirah, Downtown, Business Bay, Dubai Marina) with direct access to local UAE residents and private medical insurance networks. DHCC is a specialized healthcare free zone operating under DHCCA regulations, ideal for regional medical hubs.",
  },
  {
    question: "Do we need to sign a commercial lease before getting DHA approval?",
    answer:
      "No. We strongly advise against signing binding commercial leases prior to regulatory assessment. DubaiMed Consult secures your DHA Initial Approval first, verifying that your proposed clinical scope is sanctioned before committing capital to a physical tenancy contract.",
  },
  {
    question: "Are international physicians required to sit for the DHA examination?",
    answer:
      "Specialists with Tier-1 certifications (such as UK CCT/CCST, American Board, Canadian Fellowship, German Facharzt, or Australian Fellowship) are generally exempt from DHA written examinations under current PQR guidelines. We handle their direct credentialing and license conversion seamlessly.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-28 bg-obsidian-light border-t border-white/[0.05]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-card border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 shadow-gold-glow">
            <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
            Advisory Insights
          </div>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Essential regulatory, legal, and operational facts on launching healthcare practices in Dubai.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? "bg-obsidian-card border-gold-500/40 shadow-gold-glow"
                    : "bg-obsidian-card/50 border-white/[0.07] hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 sm:px-8 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-playfair text-base sm:text-lg font-bold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-gold-500/20 text-gold-400 rotate-180"
                        : "bg-obsidian-surface text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 sm:px-8 pb-6 pt-2 text-sm text-slate-300 font-light leading-relaxed border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
