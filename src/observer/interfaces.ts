export interface ValueMeta<T> {
  previousValueId: string | null;
  value: T;
  valueId: string;
}

interface NotificationBase {
  step: number;
  stepName?: string;
  streamId: string;
  timestamp: number;
}

export interface NextNotification<T> extends NotificationBase {
  type: 'N';
  valueMeta: ValueMeta<T>;
}

export interface ErrorNotification extends NotificationBase {
  type: 'E';
  valueMeta: { error: any };
}

export interface CompletedNotification extends NotificationBase {
  type: 'C';
  valueMeta: null;
}

export type Notification<T> =
  | NextNotification<T>
  | ErrorNotification
  | CompletedNotification;
