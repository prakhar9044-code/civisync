import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">CivicPulse</span>
        </div>
        <p className="max-w-md text-xs text-muted-foreground leading-relaxed">
          A Smart Civic Issue Reporting & Resolution Platform empowering
          citizens and authorities to build better cities together.
        </p>
        <p className="text-xs text-muted-foreground">
          Built for Smart Cities India Initiative
        </p>
      </div>
    </footer>
  );
}
