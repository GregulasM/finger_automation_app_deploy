import { prisma } from "../../../../app/lib/prisma";
import { buildResetEmail, sendEmail } from "../../../utils/email";
import { generateToken, hashToken } from "../../../utils/tokens";
import { emailSchema, readValidatedBody } from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, emailSchema);
  const email = body.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    const resetToken = generateToken();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(resetToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    try {
      await sendEmail(buildResetEmail(resetToken, user.email));
    } catch (error) {
      console.warn("Password reset email failed", error);
    }
  }

  return { ok: true };
});
