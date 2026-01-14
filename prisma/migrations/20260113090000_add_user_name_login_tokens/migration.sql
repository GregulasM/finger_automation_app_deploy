-- AlterTable
ALTER TABLE "User" ADD COLUMN "name" VARCHAR(120);

-- CreateTable
CREATE TABLE "LoginVerificationToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginVerificationToken_tokenHash_key" ON "LoginVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "LoginVerificationToken_userId_idx" ON "LoginVerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "LoginVerificationToken" ADD CONSTRAINT "LoginVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
