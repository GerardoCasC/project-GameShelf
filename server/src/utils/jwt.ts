import jwt from "jsonwebtoken";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET no está configurado correctamente");
  }

  return secret;
}

export function createToken(userId: string): string {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: "HS256",
    subject: userId,
    expiresIn: "1d",
  });
}
