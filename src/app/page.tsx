import Navbar from "@/components/Navbar";
import HeroScrollCanvas from "@/components/HeroScrollCanvas";
import ServicesSection from "@/components/ServicesSection";
import ProcessRoadmap from "@/components/ProcessRoadmap";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import AuthoritiesSection from "@/components/AuthoritiesSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-obsidian text-white selection:bg-gold-500 selection:text-obsidian">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Sticky Scroll Hero Sequence Canvas */}
      <HeroScrollCanvas totalFrames={196} />

      {/* Authority Trust Metrics */}
      <AuthoritiesSection />

      {/* 4 Glassmorphism Service Cards */}
      <ServicesSection />

      {/* 4-Step Strategic Roadmap */}
      <ProcessRoadmap />

      {/* Clinical Sectors & Specialties */}
      <SpecialtiesSection />

      {/* Contact & Strategic Lead Generation */}
      <ContactSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Luxury Footer */}
      <Footer />
    </main>
  );
}
