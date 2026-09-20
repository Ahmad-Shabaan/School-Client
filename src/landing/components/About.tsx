import { aboutHeading, aboutText } from "@/landing/data/landing";
import SectionHeading from "./SectionHeading";

const About = () => (
  <section id="school" className="landing-section scroll-mt-36 bg-[var(--paper)] sm:scroll-mt-28">
    <div className="landing-container">
      <SectionHeading title={aboutHeading} />
      <p className="landing-heading-gap mx-auto max-w-2xl text-center text-[1.05rem] leading-[1.85] text-[var(--text-mute)] sm:text-[1.1rem]">
        {aboutText}
      </p>
    </div>
  </section>
);

export default About;