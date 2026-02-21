import { MapPin, Send, Eye, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: MapPin,
    title: "Spot the Problem",
    desc: "See a pothole, broken streetlight, or water leak? Open the app and tag the location.",
  },
  {
    icon: Send,
    title: "Submit a Report",
    desc: "Fill in the details, select a category, and submit. It is automatically routed to the right department.",
  },
  {
    icon: Eye,
    title: "Track Progress",
    desc: "Get real-time status updates. Upvote existing issues to boost their priority.",
  },
  {
    icon: CheckCircle2,
    title: "Issue Resolved",
    desc: "Authorities fix the issue and update the status. Transparency from start to finish.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Four simple steps to a better city
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
