import { clearAuthCookies } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  clearAuthCookies(event);
  await clearUserSession(event);
  return { ok: true };
});
