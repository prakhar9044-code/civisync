import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { StatsBar } from "@/components/stats-bar";
import { HowItWorks } from "@/components/how-it-works";
import { RecentIssues } from "@/components/recent-issues";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <RecentIssues />
      </main>
      <Footer />
    </div>
  );
}
