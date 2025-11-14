import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/session";
import { db } from "@/db";
import { participants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

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
      hasTeam: body.hasTeam ?? false,
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
