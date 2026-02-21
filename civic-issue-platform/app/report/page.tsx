import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReportForm } from "@/components/report-form";

export default function ReportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Report a Civic Issue
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Help us make your city better. Fill in the details below and your
              report will be routed to the right department.
            </p>
          </div>
          <ReportForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
