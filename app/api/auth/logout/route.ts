import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { deleteSession, deleteSessionCookie } from "@/lib/session";

export async function POST() {
  try {
    const { session } = await getCurrentSession();

    if (session) {
      await deleteSession(session.id);
    }

    await deleteSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
