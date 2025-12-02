import { useEffect } from "react";

export default function useSectionFadeIn() {
  useEffect(() => {
    const sections = document.querySelectorAll(".home-page section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // fade in once
          }
        });
      },
      {
        threshold: 0.15, // trigger when 15% visible
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
}
