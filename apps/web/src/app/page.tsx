import BusinessSections from "../components/BusinessSections";
import CaseStudies from "../components/CaseStudies";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import FloatingContactButton from "../components/FloatingContactButton";
import Hero from "../components/Hero";
import HomepageContactFlow from "../components/HomepageContactFlow";
import IntroAnimation from "../components/IntroAnimation";
import Journey from "../components/Journey";
import Navbar from "../components/Navbar";
import Process from "../components/Process";
import Scroll3DSection from "../components/Scroll3DSection";
import SmoothScroll from "../components/SmoothScroll";
import Stats from "../components/Stats";
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
        <Scroll3DSection className="growblic-scroll-reveal">
          <Stats />
        </Scroll3DSection>
        <Scroll3DSection className="growblic-scroll-reveal">
          <BusinessSections />
        </Scroll3DSection>
        <div className="growblic-scroll-reveal">
          <TrustSection />
        </div>
        <Scroll3DSection className="growblic-scroll-reveal">
          <FeaturedProducts />
        </Scroll3DSection>
        <div className="growblic-scroll-reveal">
          <CaseStudies />
        </div>
        <Scroll3DSection className="growblic-scroll-reveal">
          <Process />
        </Scroll3DSection>
        <div className="growblic-scroll-reveal">
        </div>
        <div className="growblic-scroll-reveal">
          <Journey />
        </div>
        <div className="growblic-scroll-reveal">
        </div>
        <HomepageContactFlow />
        <CTA />
      </main>
      <div className="growblic-scroll-reveal">
        <Footer />
      </div>
      <FloatingContactButton />
    </>
  );
}
