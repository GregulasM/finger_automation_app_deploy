import { createError } from "h3";
import { prisma } from "../../../app/lib/prisma";
import {
  getAuthTtl,
  setAccessCookie,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
} from "../../utils/auth";
import { loginSchema, readValidatedBody } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema);
  const email = body.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

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
