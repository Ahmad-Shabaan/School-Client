import "@/landing/landing.css";

import About from "../components/About";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Inquiries from "../components/Inquiries";
import Knowledge from "../components/Knowledge";
import Sheikhs from "../components/Sheikhs";

const Home = () => (
  <div className="landing-root" dir="rtl" lang="ar">
    <Header />
    <main>
      <Hero />
      <About />
      <Sheikhs />
      <Knowledge />
      <Inquiries />
      <FAQ />
    </main>
    <Footer />
  </div>
);

export default Home;