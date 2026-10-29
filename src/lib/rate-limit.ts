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
