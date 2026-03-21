/** Decodifica base64 (compatible con React Native, sin depender de atob). */
function base64Decode(str: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  str = str.replace(/[^A-Za-z0-9+/=]/g, "");
  for (let i = 0; i < str.length; i += 4) {
    const a = chars.indexOf(str[i]);
    const b = chars.indexOf(str[i + 1]);
    const c = chars.indexOf(str[i + 2]);
    const d = chars.indexOf(str[i + 3]);
    output += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== 64) output += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== 64) output += String.fromCharCode(((c & 3) << 6) | d);
  }
  return output;
}

/** Decodifica el payload del JWT y devuelve el nameid (ID del usuario). */
export function obtenerUserIdDesdeToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = base64Decode(base64);
    const data = JSON.parse(json);
    const nameid = data.nameid ?? data.sub ?? data.userId;
    return nameid != null ? String(nameid) : null;
  } catch (err) {
    void err;
    return null;
  }
}
