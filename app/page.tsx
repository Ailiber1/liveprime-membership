import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/features/HeroSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import WhySection from "@/components/features/WhySection";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import HowItWorksSection from "@/components/features/HowItWorksSection";
import CTASection from "@/components/features/CTASection";
// StarBackground削除

function SectionDivider() {
  return (
    <div className="relative h-px mx-auto max-w-4xl px-8" aria-hidden="true">
      <div className="h-px bg-gradient-to-r from-transparent via-[#f59e0b]/20 to-transparent" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* StarBackground削除 */}
      <Header />
      <main className="relative z-[1]">
        <HeroSection />
        <FeaturesSection />
        <SectionDivider />
        <WhySection />
        <SectionDivider />
        <TestimonialsSection />
        <SectionDivider />
        <HowItWorksSection />
        <SectionDivider />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
