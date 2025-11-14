import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/session";
import { db } from "@/db";
import { participants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { participantId, teamName } = body;

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      );
    }

    if (participantId === user.id) {
      return NextResponse.json(
        { error: "Use profile update to change your own team" },
        { status: 400 }
      );
    }

    const [targetParticipant] = await db
      .select()
      .from(participants)
      .where(eq(participants.id, participantId));

    if (!targetParticipant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (teamName === null || teamName === "") {
      if (
        targetParticipant.teamName &&
        targetParticipant.teamName !== user.teamName
      ) {
        return NextResponse.json(
          { error: "Cannot remove participant from a different team" },
          { status: 403 }
        );
      }

      const [updated] = await db
        .update(participants)
        .set({
          teamName: null,
        })
        .where(eq(participants.id, participantId))
        .returning();

      revalidatePath("/");
      revalidatePath(`/p/${participantId}`);

      return NextResponse.json({
        success: true,
        participant: updated,
        action: "removed",
      });
    }

    if (targetParticipant.teamName && targetParticipant.teamName !== user.teamName) {
      return NextResponse.json(
        { error: "Participant already belongs to a different team" },
        { status: 403 }
      );
    }

    if (targetParticipant.teamName && targetParticipant.teamName.toLowerCase() === 'admin') {
      return NextResponse.json(
        { error: "Cannot modify participants in the ADMIN team" },
        { status: 403 }
      );
    }

    const sanitizedTeamName = teamName.trim();
    if (sanitizedTeamName.length === 0 || sanitizedTeamName.length > 50) {
      return NextResponse.json(
        { error: "Team name must be between 1 and 50 characters" },
        { status: 400 }
      );
    }

    if (sanitizedTeamName.toLowerCase() === 'admin') {
      return NextResponse.json(
        { error: "Team name 'ADMIN' is reserved and cannot be used" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(participants)
      .set({
        teamName: sanitizedTeamName,
      })
      .where(eq(participants.id, participantId))
      .returning();

    revalidatePath("/");
    revalidatePath(`/p/${participantId}`);

    return NextResponse.json({
      success: true,
      participant: updated,
      action: "assigned",
    });
  } catch (error) {
    console.error("Team management error:", error);
    return NextResponse.json(
      { error: "An error occurred while managing team" },
      { status: 500 }
    );
  }
}
