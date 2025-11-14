"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { LogOut, Shuffle } from "lucide-react";
import { generateAvatarSeed, getAvatarUrl } from "@/lib/avatar";
import type { Participant } from "@/db/schema";

interface ProfileFormClientProps {
  participant: Participant;
}

export default function ProfileFormClient({
  participant,
}: ProfileFormClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: participant.name,
    phoneNumber: participant.phoneNumber,
    wantsToBuild: participant.wantsToBuild,
    profile: participant.profile,
    website: participant.website || "",
    linkedInHandle: participant.linkedInHandle || "",
    githubHandle: participant.githubHandle || "",
    xHandle: participant.xHandle || "",
    organization: participant.organization || "",
    hasBuilt: participant.hasBuilt || "",
    avatarSeed: participant.avatarSeed || participant.id,
    hasTeam: participant.hasTeam,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
        setIsLoading(false);
        return;
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsLoading(false);
      router.refresh();
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Logout failed" });
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleRandomizeAvatar() {
    setFormData((prev) => ({
      ...prev,
      avatarSeed: generateAvatarSeed(),
    }));
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 rounded-sm shadow-lg">
        <CardContent className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight mb-2">
                Edit Profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Update your information for the hackathon
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div className="mb-8 flex items-center gap-6 pb-8 border-b-2 border-border">
            <div className="relative">
              <div className="w-32 h-32 border-2 border-foreground rounded-sm overflow-hidden bg-card">
                <Image
                  src={getAvatarUrl({
                    avatarSeed: formData.avatarSeed,
                    id: participant.id,
                  })}
                  alt="Avatar preview"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground uppercase tracking-wide">
                  Your Avatar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This pixel art avatar represents you in the hackathon
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleRandomizeAvatar}
                className="gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Randomize Avatar
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="profile"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  Profile *
                </label>
                <select
                  id="profile"
                  name="profile"
                  value={formData.profile}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                >
                  <option value="Engineer">Engineer</option>
                  <option value="Designer">Designer</option>
                  <option value="Product">Product</option>
                  <option value="Growth">Growth</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="organization"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  Organization
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="wantsToBuild"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  What do you want to build? *
                </label>
                <textarea
                  id="wantsToBuild"
                  name="wantsToBuild"
                  value={formData.wantsToBuild}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="hasBuilt"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  What have you built?
                </label>
                <textarea
                  id="hasBuilt"
                  name="hasBuilt"
                  value={formData.hasBuilt}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="website"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="linkedInHandle"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  LinkedIn
                </label>
                <input
                  id="linkedInHandle"
                  name="linkedInHandle"
                  type="url"
                  value={formData.linkedInHandle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="githubHandle"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  GitHub
                </label>
                <input
                  id="githubHandle"
                  name="githubHandle"
                  type="url"
                  value={formData.githubHandle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="xHandle"
                  className="text-sm font-medium text-foreground uppercase tracking-wide"
                >
                  X (Twitter)
                </label>
                <input
                  id="xHandle"
                  name="xHandle"
                  type="url"
                  value={formData.xHandle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-border bg-background text-foreground rounded-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={isLoading}
                  placeholder="https://x.com/username"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2 pt-4 border-t-2 border-border">
              <div className="flex items-center gap-3">
                <input
                  id="hasTeam"
                  name="hasTeam"
                  type="checkbox"
                  checked={formData.hasTeam}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasTeam: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 border-2 border-border rounded-sm bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  disabled={isLoading}
                />
                <label
                  htmlFor="hasTeam"
                  className="text-sm font-medium text-foreground uppercase tracking-wide cursor-pointer"
                >
                  I already have a team
                </label>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Check this if you&apos;re not looking for team members
              </p>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 border-2 rounded-sm ${
                  message.type === "success"
                    ? "border-green-500 bg-green-500/10 text-green-500"
                    : "border-red-500 bg-red-500/10 text-red-500"
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-primary text-primary-foreground font-medium uppercase tracking-wide border-2 border-primary hover:bg-primary/90 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={isLoading}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Email:</strong> {participant.email} (cannot be changed)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
