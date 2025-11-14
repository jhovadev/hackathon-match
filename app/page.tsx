import { db } from "@/db";
import { participants as participantsTable } from "@/db/schema";
import { PixelatedTitle } from "@/components/pixelated-title";
import { ThemeToggle } from "@/components/theme-toggle";
import { ParticipantGrid } from "@/components/participant-grid";
import Link from "next/link";
import { User } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  const participants = await db.select().from(participantsTable);

  // eslint-disable-next-line react-hooks/purity
  const randomSortedParticipants = participants.sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 py-12">
        <div className="relative mb-12">
          <div className="absolute top-0 right-0 z-20 flex gap-2">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3 py-2 bg-background border-2 border-foreground text-foreground hover:bg-muted transition-colors duration-100 rounded-sm h-10"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium uppercase hidden sm:inline">
                Profile
              </span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="text-center space-y-4">
            <PixelatedTitle />
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Meet the amazing builders of this hackathon
            </p>
          </div>
        </div>

        <ParticipantGrid initialParticipants={randomSortedParticipants} />
      </main>
    </div>
  );
}
