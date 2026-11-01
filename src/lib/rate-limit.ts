/**
 * Límite de envíos por IP, en memoria.
 *
 * Limitación conocida: en hosting serverless cada instancia tiene su propia
 * memoria, por lo que este límite es "de mejor esfuerzo". Para algo más
 * estricto, usá un store compartido (Upstash/Redis) o el rate limiting de la
 * plataforma (Vercel WAF, Cloudflare).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // Limpieza ocasional para que el mapa no crezca indefinidamente.
  if (hits.size > 500) {
    for (const [k, list] of hits) {
      if (list.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

// --- Duplicados (doble clic, reenvíos) -------------------------------------
const DUPLICATE_WINDOW_MS = 60 * 1000;
const sent = new Map<string, number>();

/** true si el mismo envío ya se despachó con éxito hace menos de un minuto. */
export function wasRecentlySent(fingerprint: string, now: number): boolean {
  const at = sent.get(fingerprint);
  return at !== undefined && now - at < DUPLICATE_WINDOW_MS;
}

/** Registrar solo después de un envío exitoso: un fallo debe poder reintentarse. */
export function markSent(fingerprint: string, now: number): void {
  sent.set(fingerprint, now);
  for (const [k, t] of sent) {
    if (now - t >= DUPLICATE_WINDOW_MS) sent.delete(k);
  }
}

/** Solo para pruebas. */
export function resetForTests(): void {
  hits.clear();
  sent.clear();
}
