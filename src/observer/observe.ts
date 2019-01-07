import { generateId, generateTimestamp } from './utils';
import { Observable, OperatorFunction, pipe, Subject } from 'rxjs';
import * as RxOps from 'rxjs/operators';
import { ValueMeta } from './interfaces';
import { Notification } from './interfaces';

const init = () => <T>(
  source: Observable<T>,
): Observable<ValueMeta<T>> =>
  source.pipe(
    RxOps.map(value => ({
      value,
      previousValueId: null,
      valueId: generateId(),
    })),
  );

const clean = () => <T>(
  source: Observable<ValueMeta<T>>,
): Observable<T> => source.pipe(RxOps.map(x => x.value));

const createNotification = <T>(
  streamId: string,
  step: number,
  type: 'N' | 'E' | 'C',
  value: ValueMeta<T> | { error: any } | null,
): Notification<T> => ({
  streamId,
  step,
  type,
  value,
  timestamp: generateTimestamp(),
});

const copyCreator = <T>(
  receiver: Subject<Notification<T>>,
  streamId: string,
) => (step: number) => (
  source: Observable<ValueMeta<T>>,
): Observable<ValueMeta<T>> =>
  source.pipe(
    RxOps.tap(
      value => receiver.next(createNotification(streamId, step, 'N', value)),
      error =>
        receiver.next(createNotification(streamId, step, 'E', { error })),
      () => receiver.next(createNotification(streamId, step, 'C', null)),
    ),
  );

export const observeCreator = (receiver: Subject<Notification<any>>) => {
  return new Proxy(pipe, {
    apply: (target, thisArg, argumentsList) => {
      const copy = copyCreator(receiver, generateId());

      // @ts-ignore
      return target(
        init(),
        ...argumentsList.reduce(
          (
            p: OperatorFunction<unknown, unknown>[],
            n: OperatorFunction<unknown, unknown>,
            index: number,
          ) => p.concat([copy(index), n]),
          [],
        ),
        copy(argumentsList.length),
        clean(),
      );
    },
  });
};
