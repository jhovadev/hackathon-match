import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import { ThemeToggle } from "@/components/theme-toggle";
import ProfileFormClient from "./profile-form-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 py-12">
        <div className="relative mb-12">
          <div className="absolute top-0 left-0 z-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-2 bg-background border-2 border-foreground text-foreground hover:bg-muted transition-colors duration-100 rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium uppercase">Home</span>
            </Link>
          </div>

          <div className="absolute top-0 right-0 z-20">
            <ThemeToggle />
          </div>
        </div>

        <ProfileFormClient participant={user} />
      </main>
    </div>
  );
}
