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
import Scroll3DSection from "../components/Scroll3DSection";
import Services from "../components/Services";
import SmoothScroll from "../components/SmoothScroll";
import SpotlightImageReveal from "../components/SpotlightImageReveal";
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
        <SpotlightImageReveal
          baseImage="/growblic-website01/images/spotlight/base.svg"
          revealImage="/growblic-website01/images/spotlight/reveal.svg"
          alt="Growblic digital product interface preview"
          eyebrow="Interactive product layer"
          title="Reveal the intelligence behind every polished interface."
          description="Move your cursor across the preview to see how Growblic layers strategy, AI automation, and premium product design over clean business foundations."
        />
        <Scroll3DSection>
          <Stats />
        </Scroll3DSection>
        <Scroll3DSection>
          <BusinessSections />
        </Scroll3DSection>
        <Scroll3DSection>
          <Services compact />
        </Scroll3DSection>
        <TrustSection />
        <Scroll3DSection>
          <FeaturedProducts />
        </Scroll3DSection>
        <CaseStudies />
        <Scroll3DSection>
          <Process />
        </Scroll3DSection>
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
