import crypto from "crypto";

export function encryptData(data: any): string {
  const encryptionMethod =
    process.env.NEXT_PUBLIC_ENCRYPTION_METHOD ||
    process.env.ENCRYPTION_METHOD ||
    "aes-256-cbc";
  const secretKey =
    process.env.NEXT_PUBLIC_SECRET_KEY ||
    process.env.SECRET_KEY ||
    "";
  const secretIv =
    process.env.NEXT_PUBLIC_SECRET_IV ||
    process.env.SECRET_IV ||
    "";

  if (!secretKey || !secretIv) {
    throw new Error("Encryption keys are not configured");
  }

  const key = crypto
    .createHash("sha512")
    .update(secretKey)
    .digest("hex")
    .substring(0, 32);

  const encryptionIV = crypto
    .createHash("sha512")
    .update(secretIv)
    .digest("hex")
    .substring(0, 16);

  const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex"),
  ).toString("base64");
}