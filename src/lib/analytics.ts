export function track(event: string, payload?: Record<string, unknown>): void {
  console.log(`[birtravel] ${event}`, payload ?? {});
}
