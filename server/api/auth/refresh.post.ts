import { createError } from "h3";
import { prisma } from "../../../app/lib/prisma";
import {
  getAuthTtl,
  getRefreshToken,
  setAccessCookie,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const refreshToken = getRefreshToken(event);
  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Missing refresh token",
    });
  }

  const payload = verifyToken(refreshToken, "refresh");
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not found",
    });
  }

  const accessToken = signAccessToken(user);
  const nextRefreshToken = signRefreshToken(user);
  const { accessTtl, refreshTtl } = getAuthTtl();

  setAccessCookie(event, accessToken, accessTtl);
  setRefreshCookie(event, nextRefreshToken, refreshTtl);

  return { accessToken };
});
