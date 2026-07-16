"use client";

import { useState } from "react";

import ContactSection from "./ContactSection";
import FAQ from "./FAQ";

export default function HomepageContactFlow() {
  const [contactVisible, setContactVisible] = useState(false);

  return (
    <>
      <div className="growblic-scroll-reveal">
        <FAQ
          onStartProject={() => {
            setContactVisible(true);

            requestAnimationFrame(() => {
              document
                .getElementById("homepage-contact")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            });
          }}
        />
      </div>

      {contactVisible && (
        <div id="homepage-contact" className="growblic-scroll-reveal">
          <ContactSection />
        </div>
      )}
    </>
  );
}
