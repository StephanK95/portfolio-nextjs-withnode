import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutCards from "@/components/AboutCards";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Experience from "@/components/Experience";
import Approach from "@/components/Approach";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutCards />
      <Projects />
      <Testimonials />
      <Experience />
      <Approach />
      <Contact />
      <Footer />
    </main>
  );
}
