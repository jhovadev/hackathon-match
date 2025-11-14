import { notFound } from "next/navigation";
import { db } from "@/db";
import { participants } from "@/db/schema";
import { eq } from "drizzle-orm";
import ParticipantDetailClient from "./participant-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const allParticipants = await db.select().from(participants);
  return allParticipants.map((participant) => ({
    id: participant.id,
  }));
}

export default async function ParticipantPage({ params }: PageProps) {
  const { id } = await params;
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.id, id));

  if (!participant) {
    notFound();
  }

  return <ParticipantDetailClient participant={participant} />;
}
