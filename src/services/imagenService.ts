import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "token";

const IMAGES_API_URL = (
  process.env.EXPO_PUBLIC_IMAGES_API_URL ??
  "https://api-imagenes-healthymind.onrender.com"
).replace(/\/+$/, "");

async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export interface ImagenSubidaResult {
  url: string;
  id: string;
}

/**
 * Sube una imagen desde una URI local (cámara o galería) al servicio de imágenes.
 * Usa fetch + FormData nativo de React Native (no Axios).
 */
export async function subirImagenDesdeUri(
  uri: string,
  mimeHint?: string,
  context = "diario_pagina"
): Promise<ImagenSubidaResult> {
  const token = await getToken();
  if (!token) throw new Error("Debes iniciar sesión");

  const ext = uri.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType = mimeHint ?? (ext === "png" ? "image/png" : "image/jpeg");
  const fileName = `upload_${Date.now()}.${ext}`;

  const formData = new FormData();
  formData.append("image", {
    uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);
  formData.append("context", context);

  const res = await fetch(`${IMAGES_API_URL}/api/images/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.status === 401) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
  if (res.status === 413 || res.status === 400) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? "Imagen demasiado grande (máx 5 MB).");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? "Error al subir la imagen.");
  }

  const data = (await res.json()) as { url?: string; id?: string; secureUrl?: string };
  const url = (data.url ?? data.secureUrl ?? "").trim();
  if (!url || !url.startsWith("http")) {
    throw new Error("La API no devolvió una URL válida de la imagen.");
  }

  return { url, id: data.id ?? "" };
}
