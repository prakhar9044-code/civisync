import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Overview of all civic issues, analytics, and management tools
            </p>
          </div>
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
