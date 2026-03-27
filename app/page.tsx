import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/features/HeroSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import WhySection from "@/components/features/WhySection";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import HowItWorksSection from "@/components/features/HowItWorksSection";
import CTASection from "@/components/features/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WhySection />
        <TestimonialsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
