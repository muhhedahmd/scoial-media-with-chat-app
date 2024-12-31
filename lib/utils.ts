import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const countries = [
  { code: "US", label: "United States", phone: "1", flag: "🇺🇸" },
  { code: "CA", label: "Canada", phone: "1", flag: "🇨🇦" },
  { code: "MX", label: "Mexico", phone: "52", flag: "🇲🇽" },
  { code: "DE", label: "Germany", phone: "49", flag: "🇩🇪" },
  { code: "FR", label: "France", phone: "33", flag: "🇫🇷" },
  { code: "GB", label: "United Kingdom", phone: "44", flag: "🇬🇧" },
  { code: "IT", label: "Italy", phone: "39", flag: "🇮🇹" },
  { code: "JP", label: "Japan", phone: "81", flag: "🇯🇵" },
  { code: "CN", label: "China", phone: "86", flag: "🇨🇳" },
  { code: "IN", label: "India", phone: "91", flag: "🇮🇳" },
  { code: "BR", label: "Brazil", phone: "55", flag: "🇧🇷" },
  { code: "ZA", label: "South Africa", phone: "27", flag: "🇿🇦" },
  { code: "EG", label: "Egypt", phone: "20", flag: "🇪🇬" },
  // Add more countries as needed
];


import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// const algorithm = 'aes-256-cbc';
// const key = 'mysecretkey16bytmysecretkey16byt'

// export function encryptMessage(message: string): { encryptedContent: Buffer, iv: Buffer } {
//   const iv = randomBytes(16);
//   const cipher = createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(message, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return { encryptedContent: Buffer.from(encrypted, 'hex'), iv };
// }

// export function decryptMessage(encryptedContent: Buffer, iv: Buffer): string {
//   try {
//     const decipher = createDecipheriv(algorithm, key, iv);
//     let decrypted = decipher.update(encryptedContent);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString('utf8');
    
//   } catch (error) {
//     console.log(error) 
//     return ""
//   }
//   }


 
function convertWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray) {
  const arrayOfWords = wordArray.words;
  const length = wordArray.sigBytes;
  const uint8Array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8Array[i] = (arrayOfWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return uint8Array;
}

import CryptoJS from 'crypto-js';

const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'defaultkeydefaultkey';

export const encryptMessage = (message: string) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(message, key, { 
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {
    encryptedContent: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Hex)
  };
};

export const decryptMessage = (encryptedContent: string, iv: string) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, key, { 
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    return null;
  }
}



