"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, PRIORITIES } from "@/lib/types";
import {
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Lightbulb,
  Waves,
  Trash2,
  Construction,
  Pipette,
  HelpCircle,
  Navigation,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  pothole: AlertTriangle,
  water_leak: Droplets,
  streetlight: Lightbulb,
  drainage: Waves,
  garbage: Trash2,
  road_damage: Construction,
  sewage: Pipette,
  other: HelpCircle,
};

export function ReportForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    reporter_name: "",
    reporter_email: "",
    reporter_phone: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/issues"), 2000);
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h2 className="text-xl font-bold text-emerald-800">
          Report Submitted Successfully
        </h2>
        <p className="text-sm text-emerald-600">
          Your issue has been reported and assigned to the relevant department.
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">
          Category <span className="text-destructive">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.value] || HelpCircle;
            const isSelected = form.category === cat.value;
            return (
              <button
                type="button"
                key={cat.value}
                onClick={() => update("category", cat.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                <Icon className="h-5 w-5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Title & Description */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Issue Title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g., Large pothole on MG Road"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe the issue in detail - what, where, how severe..."
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">
          Priority
        </label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => update("priority", p.value)}
              className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
                form.priority === p.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Location
          </label>
          <button
            type="button"
            onClick={handleLocate}
            disabled={locating}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-secondary disabled:opacity-50"
          >
            {locating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Navigation className="h-3 w-3" />
            )}
            {locating ? "Detecting..." : "Use My Location"}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={form.latitude}
            onChange={(e) => update("latitude", e.target.value)}
            placeholder="Latitude"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            value={form.longitude}
            onChange={(e) => update("longitude", e.target.value)}
            placeholder="Longitude"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Street address or landmark"
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Reporter Info */}
      <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
        <p className="text-sm font-semibold text-foreground">Your Details</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            value={form.reporter_name}
            onChange={(e) => update("reporter_name", e.target.value)}
            placeholder="Full Name *"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="email"
            value={form.reporter_email}
            onChange={(e) => update("reporter_email", e.target.value)}
            placeholder="Email (optional)"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <input
          type="tel"
          value={form.reporter_phone}
          onChange={(e) => update("reporter_phone", e.target.value)}
          placeholder="Phone (optional)"
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.title || !form.description || !form.category || !form.reporter_name}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
