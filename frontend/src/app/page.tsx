import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import TrustBar from "@/components/landing/trust-bar";
import MainOffer from "@/components/landing/main-offer";
import CourseGrid from "@/components/landing/course-grid";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustBar />
      <MainOffer />
      <CourseGrid />
      <Footer />
    </main>
  );
}
