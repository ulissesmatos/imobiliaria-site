import "server-only";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type SessionPayload = {
  adminId: string;
  email: string;
  name: string;
};

export async function getSession(): Promise<SessionPayload | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.adminProfile.findUnique({
    where: { id: user.id },
  });

  if (!profile || !profile.isActive) return null;

  return { adminId: profile.id, email: profile.email, name: profile.name };
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
