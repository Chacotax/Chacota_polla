function bytesToHex(buffer) {
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export function randomCode(prefix = "GRP", length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < length; i++) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}${value}`;
}

export function randomSalt(length = 24) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let value = "";
  for (let i = 0; i < length; i++) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return value;
}

export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(digest);
}

export async function createPassword(password) {
  const salt = randomSalt();
  const hash = await hashPassword(password, salt);
  return { salt, hash };
}

export async function verifyPassword(password, salt, expectedHash) {
  const hash = await hashPassword(password, salt);
  return hash === expectedHash;
}

export function makeToken(user) {
  const raw = `${user.id_usuario}:${user.usuario}:${Date.now()}:${Math.random()}`;
  return btoa(raw);
}
