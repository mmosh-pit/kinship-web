import crypto from "crypto";
export const decryptData = (data: string): string => {
    try {
        const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || process.env.SECRET_KEY || "";
        const encryptionMethod = process.env.NEXT_PUBLIC_ENCRYPTION_METHOD || process.env.ENCRYPTION_METHOD || "aes-256-cbc";
        const secretIv = process.env.NEXT_PUBLIC_SECRET_IV || process.env.SECRET_IV || "";

        if (!secretKey || !secretIv) return "";

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

        const decipher = crypto.createDecipheriv(
            encryptionMethod,
            key,
            encryptionIV
        );

        const encryptedHex = Buffer.from(data, "base64").toString("hex");

        return (
            decipher.update(encryptedHex, "hex", "utf8") +
            decipher.final("utf8")
        );
    } catch (error) {
        return "";
    }
};

export const encryptData = (data: string): string => {
    try {
        const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || process.env.SECRET_KEY || "";
        const encryptionMethod = process.env.NEXT_PUBLIC_ENCRYPTION_METHOD || process.env.ENCRYPTION_METHOD || "aes-256-cbc";
        const secretIv = process.env.NEXT_PUBLIC_SECRET_IV || process.env.SECRET_IV || "";

        if (!secretKey || !secretIv) return "";

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

        const encrypted =
            cipher.update(data, "utf8", "hex") + cipher.final("hex");

        return Buffer.from(encrypted, "hex").toString("base64") || "";
    } catch (error) {
        return "";
    }
};