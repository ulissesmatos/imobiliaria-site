"use server";

import { redirect } from "next/navigation";

import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export type LoginState = {
  error?: string;
};

export async function signIn(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "E-mail ou senha inválidos." };
  }

  const admin = await prisma.adminProfile.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!admin || !admin.isActive) {
    return { error: "E-mail ou senha incorretos." };
  }

  const passwordMatches = await verifyPassword(
    parsed.data.password,
    admin.passwordHash
  );

  if (!passwordMatches) {
    return { error: "E-mail ou senha incorretos." };
  }

  await createSession({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
  });

  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}
