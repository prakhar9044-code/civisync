import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { IssueDetail } from "@/components/issue-detail";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-10 lg:px-8">
        <IssueDetail id={id} />
      </main>
      <Footer />
    </div>
  );
}
