import jwt from "jsonwebtoken";

export const COOKIE = "auth_token";
const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export function signToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): Record<string, unknown> | null {
    try {
        return jwt.verify(token, SECRET) as Record<string, unknown>;
    } catch {
        return null;
    }
}