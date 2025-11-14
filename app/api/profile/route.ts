import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/session";
import { db } from "@/db";
import { participants } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const teamName = body.teamName?.trim() || null;
    
    if (teamName && teamName.toLowerCase() === 'admin') {
      return NextResponse.json(
        { error: "Team name 'ADMIN' is reserved and cannot be used" },
        { status: 400 }
      );
    }
    
    const sanitizedTeamName = teamName && teamName.length > 0 && teamName.length <= 50 ? teamName : null;

    if (sanitizedTeamName && sanitizedTeamName !== user.teamName) {
      const existingTeam = await db
        .select()
        .from(participants)
        .where(
          and(
            eq(participants.teamName, sanitizedTeamName),
            ne(participants.id, user.id)
          )
        )
        .limit(1);

      if (existingTeam.length > 0) {
        return NextResponse.json(
          { error: "This team name is already taken. To join this team, ask one of its members to add you from your participant page." },
          { status: 400 }
        );
      }
    }

    const updateData = {
      name: body.name,
      phoneNumber: body.phoneNumber,
      wantsToBuild: body.wantsToBuild,
      profile: body.profile,
      website: body.website || null,
      linkedInHandle: body.linkedInHandle || null,
      githubHandle: body.githubHandle || null,
      xHandle: body.xHandle || null,
      organization: body.organization || null,
      hasBuilt: body.hasBuilt || null,
      avatarSeed: body.avatarSeed || null,
      teamName: sanitizedTeamName,
    };

    const [updated] = await db
      .update(participants)
      .set(updateData)
      .where(eq(participants.id, user.id))
      .returning();

    revalidatePath("/");
    revalidatePath(`/p/${user.id}`);

    return NextResponse.json({ success: true, participant: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating profile" },
      { status: 500 }
    );
  }
}
