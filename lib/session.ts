import { db } from "@/db";
import { sessions, participants } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  generateSecureRandomString,
  hashSecret,
  constantTimeEqual,
} from "./auth";
import { cookies } from "next/headers";
import { cache } from "react";

const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24;

export interface SessionWithToken {
  id: string;
  secretHash: string;
  userId: string;
  createdAt: Date;
  token: string;
}

export async function createSession(userId: string): Promise<SessionWithToken> {
  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);

  const token = `${id}.${secret}`;

  const [session] = await db
    .insert(sessions)
    .values({
      id,
      secretHash,
      userId,
      createdAt: new Date(),
    })
    .returning();

  return {
    ...session,
    token,
  };
}

export async function validateSessionToken(
  token: string
): Promise<{ session: typeof sessions.$inferSelect; user: typeof participants.$inferSelect } | null> {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 2) {
    return null;
  }
  const sessionId = tokenParts[0];
  const sessionSecret = tokenParts[1];

  const session = await getSession(sessionId);
  if (!session) {
    return null;
  }

  const tokenSecretHash = await hashSecret(sessionSecret);
  const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
  if (!validSecret) {
    return null;
  }

  const [user] = await db
    .select()
    .from(participants)
    .where(eq(participants.id, session.userId));

  if (!user) {
    return null;
  }

  return { session, user };
}

export async function getSession(
  sessionId: string
): Promise<typeof sessions.$inferSelect | null> {
  const now = new Date();

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId));

  if (!session) {
    return null;
  }

  if (
    now.getTime() - session.createdAt.getTime() >=
    SESSION_EXPIRES_IN_SECONDS * 1000
  ) {
    await deleteSession(sessionId);
    return null;
  }

  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function validateSessionTokenInMiddleware(
  token: string
): Promise<boolean> {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 2) {
      return false;
    }
    const sessionId = tokenParts[0];
    const sessionSecret = tokenParts[1];

    const now = new Date();

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    if (!session) {
      return false;
    }

    if (
      now.getTime() - session.createdAt.getTime() >=
      SESSION_EXPIRES_IN_SECONDS * 1000
    ) {
      await deleteSession(sessionId);
      return false;
    }

    const tokenSecretHash = await hashSecret(sessionSecret);
    const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
    
    return validSecret;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
}

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);
  if (!result) {
    return { session: null, user: null };
  }
  return result;
});

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRES_IN_SECONDS,
    path: "/",
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
