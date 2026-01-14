import { createError } from "h3";
import { prisma } from "../../../app/lib/prisma";
import { getAccessToken, verifyToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const token = getAccessToken(event);
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Missing access token",
    });
  }

  const payload = verifyToken(token, "access");
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not found",
    });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt,
  };
});
