import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Contact Growblic - Start a Project",
  description:
    "Contact Growblic for website development, software, mobile apps, SaaS products, dashboards, and AI automation projects.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
