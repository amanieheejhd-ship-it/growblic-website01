import BusinessSections from "../components/BusinessSections";
import CaseStudies from "../components/CaseStudies";
import ContactSection from "../components/ContactSection";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import FloatingContactButton from "../components/FloatingContactButton";
import Hero from "../components/Hero";
import Insights from "../components/Insights";
import IntroAnimation from "../components/IntroAnimation";
import Journey from "../components/Journey";
import Navbar from "../components/Navbar";
import Process from "../components/Process";
import Services from "../components/Services";
import SmoothScroll from "../components/SmoothScroll";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import FeaturedProducts from "../components/FeaturedProducts";
import TrustSection from "../components/TrustSection";
import { createPageMetadata } from "./seo";

export const metadata = createPageMetadata({
  title: "Growblic - Software Development Company",
  description:
    "Growblic builds premium websites, mobile apps, SaaS products, dashboards, AI automation systems, and business software for modern companies.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <IntroAnimation />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <BusinessSections />
        <Services compact />
        <TrustSection />
        <FeaturedProducts />
        <CaseStudies />
        <Process />
        <Insights />
        <Journey />
        <Testimonials />
        <FAQ />
        <ContactSection />
        <CTA />
      </main>
      <Footer />
      <FloatingContactButton />
    </>
  );
}
