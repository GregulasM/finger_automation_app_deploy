import { createError, getQuery } from "h3";
import { prisma } from "../../../app/lib/prisma";
import { hashToken } from "../../utils/tokens";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token;
  if (!token || typeof token !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing token",
    });
  }

  const tokenHash = hashToken(token);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid token",
    });
  }

  if (record.expiresAt < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token expired",
    });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.delete({
      where: { tokenHash },
    }),
  ]);

  return { ok: true };
});
