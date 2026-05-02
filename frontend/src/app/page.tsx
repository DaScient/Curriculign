import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import EducatorToolkit from "@/components/landing/EducatorToolkit";
import HowItWorks from "@/components/landing/HowItWorks";
import TechStack from "@/components/landing/TechStack";
import CallToAction from "@/components/landing/CallToAction";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <EducatorToolkit />
      <HowItWorks />
      <TechStack />
      <CallToAction />
    </>
  );
}
