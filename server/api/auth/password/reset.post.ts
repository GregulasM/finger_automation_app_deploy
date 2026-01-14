import { createError } from "h3";
import { prisma } from "../../../../app/lib/prisma";
import { hashPassword } from "../../../utils/auth";
import { hashToken } from "../../../utils/tokens";
import {
  passwordResetSchema,
  readValidatedBody,
} from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, passwordResetSchema);
  const tokenHash = hashToken(body.token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid token",
    });
  }

  if (record.usedAt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token already used",
    });
  }

  if (record.expiresAt < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token expired",
    });
  }

  const passwordHash = await hashPassword(body.password);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true };
});
