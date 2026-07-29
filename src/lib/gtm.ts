/** Helper tipado para dataLayer do GTM (GTM-WR3H8GCD). */
export type DataLayerEvent = Record<string, unknown> & {
  event: string;
};

export function pushDataLayer(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}
