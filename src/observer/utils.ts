export function generateId(): string {
  return Math.round(Math.random() * 1e15).toString();
}

export function generateTimestamp(): number {
  return Date.now();
}
