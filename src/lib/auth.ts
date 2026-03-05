import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "bloom_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return null;

  try {
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
    const { id } = JSON.parse(decoded) as { id: string };

    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
    };
  } catch {
    return null;
  }
}

export function createSessionToken(profileId: string): string {
  return Buffer.from(JSON.stringify({ id: profileId })).toString("base64");
}

export { SESSION_COOKIE };
