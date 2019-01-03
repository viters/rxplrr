import { Notification, Observable, OperatorFunction, Subject } from 'rxjs';
import { dematerialize, map, materialize, tap } from 'rxjs/operators';

function randomNum() {
  return Math.round(Math.random() * 100000000);
}

export interface TaggedValue<T> extends Notification<T> {
  stepId: number;
  streamId: number;
  valueId: number;
  timestamp: number;
}

export function spawn<T>(
  receiver: Subject<any>,
): (source: Observable<T>) => Observable<TaggedValue<T>> {
  return source => {
    const streamId = randomNum();
    const stepId = 0;

    return source.pipe(
      materialize(),
      map(x =>
        Object.assign(x, {
          streamId,
          stepId,
          valueId: randomNum(),
          timestamp: Date.now(),
        }),
      ),
      tap(receiver),
    );
  };
}

export function wrapFactory<T, R>(
  receiver: Subject<any>,
): (
  operator: OperatorFunction<T, R>,
) => (source: Observable<TaggedValue<T>>) => Observable<TaggedValue<R>> {
  return operator => source => {
    let metadata = new Map<any, { stepId: number; streamId: number; valueId: number }>();

    return source.pipe(
      tap(
        ({ valueId, stepId, streamId }) =>
          (metadata.set()),
      ),
      dematerialize(),
      operator,
      materialize(),
      map(x => Object.assign(x, metadata, { timestamp: Date.now() })),
      tap(receiver),
    );
  };
}
