import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/session";
import { db } from "@/db";
import { participants } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.teamName) {
      return NextResponse.json(
        { error: "You must have a team to manage team members" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { participantId, action } = body;

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      );
    }

    if (!action || !["add", "remove"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'add' or 'remove'" },
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

    if (action === "remove") {
      if (!targetParticipant.teamName) {
        return NextResponse.json(
          { error: "Participant is not on any team" },
          { status: 400 }
        );
      }

      if (targetParticipant.teamName !== user.teamName) {
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

    if (action === "add") {
      if (targetParticipant.teamName) {
        return NextResponse.json(
          { error: "Participant already belongs to a team" },
          { status: 403 }
        );
      }

      const teamMembers = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(participants)
        .where(eq(participants.teamName, user.teamName));

      const currentTeamSize = teamMembers[0]?.count || 0;

      if (currentTeamSize >= 5) {
        return NextResponse.json(
          { error: "Team is full (maximum 5 members)" },
          { status: 400 }
        );
      }

      const [updated] = await db
        .update(participants)
        .set({
          teamName: user.teamName,
        })
        .where(eq(participants.id, participantId))
        .returning();

      revalidatePath("/");
      revalidatePath(`/p/${participantId}`);

      return NextResponse.json({
        success: true,
        participant: updated,
        action: "added",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Team management error:", error);
    return NextResponse.json(
      { error: "An error occurred while managing team" },
      { status: 500 }
    );
  }
}
