import { generateId, generateTimestamp } from './utils';
import { Observable, pipe, Subject } from 'rxjs';
import * as RxOps from 'rxjs/operators';
import { Notification, ValueMeta } from './interfaces';

const init = () => <T>(source: Observable<T>): Observable<ValueMeta<T>> =>
  source.pipe(
    RxOps.map(value => ({
      value,
      previousValueId: null,
      valueId: generateId(),
    })),
  );

const clean = () => <T>(source: Observable<ValueMeta<T>>): Observable<T> =>
  source.pipe(RxOps.map(x => x.value));

const createNotification = <T>(
  streamId: string,
  step: number,
  type,
  valueMeta,
  stepName?: string,
): Notification<T> => ({
  streamId,
  step,
  stepName,
  type,
  valueMeta,
  timestamp: generateTimestamp(),
});

const notificationSenderCreator = <T>(
  receiver: Subject<Notification<T>>,
  streamId: string,
  step: number,
  stepName?: string,
) => (type: 'N' | 'E' | 'C', valueMeta: ValueMeta<T> | { error: any } | null) =>
  receiver.next(createNotification(streamId, step, type, valueMeta, stepName));

const copyCreator = <T>(
  receiver: Subject<Notification<T>>,
  streamId: string,
) => (step: number, stepName?: string) => (
  source: Observable<ValueMeta<T>>,
): Observable<ValueMeta<T>> => {
  const notificationSender = notificationSenderCreator(
    receiver,
    streamId,
    step,
    stepName,
  );

  return source.pipe(
    RxOps.tap(
      valueMeta => notificationSender('N', valueMeta),
      error => notificationSender('E', { error }),
      () => notificationSender('C', null),
    ),
  );
};

export const observeCreator = (receiver: Subject<Notification<any>>) => (
  stepNames?: string[],
) => {
  return new Proxy(pipe, {
    apply: (target, thisArg, argumentsList) => {
      const copy = copyCreator(receiver, generateId());
      const observedOperators = argumentsList.reduce(
        (operators: any[], next: any, step: number) =>
          operators.concat([next, copy(step + 1, stepNames[step] || '')]),
        [],
      );

      // @ts-ignore
      return target(init(), copy(0, 'init'), ...observedOperators, clean());
    },
  });
};
