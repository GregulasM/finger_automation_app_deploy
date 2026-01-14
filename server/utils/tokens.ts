import { createHash, randomBytes, randomInt } from "node:crypto";

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function generateNumericCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
