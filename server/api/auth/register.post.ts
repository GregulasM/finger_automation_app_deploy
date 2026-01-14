import { createError } from "h3";
import { prisma } from "../../../app/lib/prisma";
import {
  getAuthTtl,
  hashPassword,
  setAccessCookie,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
} from "../../utils/auth";
import { readValidatedBody, registerSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema);
  const email = body.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: "Email already registered",
    });
  }

  const passwordHash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: {
      name: body.name.trim(),
      email,
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const { accessTtl, refreshTtl } = getAuthTtl();

  setAccessCookie(event, accessToken, accessTtl);
  setRefreshCookie(event, refreshToken, refreshTtl);

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    loggedInAt: Date.now(),
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
    },
    accessToken,
  };
});
