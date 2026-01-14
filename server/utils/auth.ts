import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createError,
  deleteCookie,
  getCookie,
  getRequestHeader,
  setCookie,
} from "h3";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const DEFAULT_ACCESS_TTL = 60 * 15;
const DEFAULT_REFRESH_TTL = 60 * 60 * 24 * 7;

type TokenType = "access" | "refresh";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  type: TokenType;
};

function getAuthConfig() {
  const config = useRuntimeConfig();
  return {
    secret: config.authSecret,
    issuer: config.authIssuer || "finger-automation",
    accessTtl: config.accessTokenTtl || DEFAULT_ACCESS_TTL,
    refreshTtl: config.refreshTokenTtl || DEFAULT_REFRESH_TTL,
    cookieSecure:
      config.authCookieSecure ?? process.env.NODE_ENV === "production",
  };
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(user: { id: string; email: string }) {
  const { secret, issuer, accessTtl } = getAuthConfig();
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Auth secret is missing",
    });
  }

  return jwt.sign(
    { sub: user.id, email: user.email, type: "access" satisfies TokenType },
    secret,
    { expiresIn: accessTtl, issuer },
  );
}

export function signRefreshToken(user: { id: string; email: string }) {
  const { secret, issuer, refreshTtl } = getAuthConfig();
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Auth secret is missing",
    });
  }

  return jwt.sign(
    { sub: user.id, email: user.email, type: "refresh" satisfies TokenType },
    secret,
    { expiresIn: refreshTtl, issuer },
  );
}

export function verifyToken(token: string, expected: TokenType) {
  const { secret, issuer } = getAuthConfig();
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Auth secret is missing",
    });
  }

  const payload = jwt.verify(token, secret, { issuer }) as AuthTokenPayload;
  if (payload.type !== expected) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token type",
    });
  }
  return payload;
}

export function getAccessToken(event: Parameters<typeof getCookie>[0]) {
  const header = getRequestHeader(event, "authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }
  return getCookie(event, ACCESS_TOKEN_COOKIE) || null;
}

export function setRefreshCookie(
  event: Parameters<typeof setCookie>[0],
  token: string,
  maxAge: number,
) {
  const { cookieSecure } = getAuthConfig();
  setCookie(event, REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function setAccessCookie(
  event: Parameters<typeof setCookie>[0],
  token: string,
  maxAge: number,
) {
  const { cookieSecure } = getAuthConfig();
  setCookie(event, ACCESS_TOKEN_COOKIE, token, {
    httpOnly: false,
    secure: cookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function getRefreshToken(event: Parameters<typeof getCookie>[0]) {
  return getCookie(event, REFRESH_TOKEN_COOKIE) || null;
}

export function clearAuthCookies(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, ACCESS_TOKEN_COOKIE, { path: "/" });
  deleteCookie(event, REFRESH_TOKEN_COOKIE, { path: "/" });
}

export function getAuthTtl() {
  const { accessTtl, refreshTtl } = getAuthConfig();
  return { accessTtl, refreshTtl };
}

export async function resolveAuthUser(event: Parameters<typeof getCookie>[0]) {
  const token = getAccessToken(event);
  if (token) {
    try {
      const payload = verifyToken(token, "access");
      return { id: payload.sub, email: payload.email };
    } catch {
      // Fall through to session lookup.
    }
  }

  try {
    const session = await getUserSession(event);
    if (session?.user?.id) {
      return { id: session.user.id, email: session.user.email ?? "" };
    }
  } catch {
    return null;
  }

  return null;
}

export async function requireAuthUser(event: Parameters<typeof getCookie>[0]) {
  const user = await resolveAuthUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Missing access token",
    });
  }
  return user;
}
