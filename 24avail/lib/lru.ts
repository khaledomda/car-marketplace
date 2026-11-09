// Tiny TTL+LRU cache used for hot search queries (most people search the same few hundred names).
export class TTLCache<V> {
  private map = new Map<string, { v: V; exp: number }>();
  constructor(private max = 2000, private ttlMs = 60_000) {}
  get(k: string): V | undefined {
    const e = this.map.get(k);
    if (!e) return undefined;
    if (e.exp < Date.now()) { this.map.delete(k); return undefined; }
    this.map.delete(k); this.map.set(k, e);
    return e.v;
  }
  set(k: string, v: V) {
    if (this.map.size >= this.max) this.map.delete(this.map.keys().next().value as string);
    this.map.set(k, { v, exp: Date.now() + this.ttlMs });
  }
}
