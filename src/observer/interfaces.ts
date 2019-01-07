export interface ValueMeta<T> {
  previousValueId: string | null;
  value: T;
  valueId: string;
}

export interface Notification<T> {
  step: number;
  streamId: string;
  timestamp: number;
  type: 'N' | 'E' | 'C';
  value: ValueMeta<T> | { error: any } | null;
}
