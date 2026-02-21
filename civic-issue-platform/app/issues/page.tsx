import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { IssuesExplorer } from "@/components/issues-explorer";

export default function IssuesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Track Civic Issues
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse all reported issues, filter by category or status, and upvote
            the ones that matter most.
          </p>
          <IssuesExplorer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
