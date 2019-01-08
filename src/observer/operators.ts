import { from, Observable, OperatorFunction, pipe } from 'rxjs';
import * as RxOps from 'rxjs/operators';
import { generateId } from './utils';
import { ValueMeta } from './interfaces';

const nextMeta = <T, R>(value: T, meta: ValueMeta<R>): ValueMeta<T> => ({
  value,
  previousValueId: meta.valueId,
  valueId: generateId(),
});

const applyNextMeta = <T>(
  operator: OperatorFunction<ValueMeta<T>, ValueMeta<T>>,
) =>
  pipe(
    operator,
    RxOps.map((meta: ValueMeta<T>) => nextMeta(meta.value, meta)),
  );

const projectMeta = (project: Function) => <T>(
  meta: ValueMeta<T>,
  ...rest: any[]
) => nextMeta(project(meta.value, ...rest), meta);

const sinkMeta = (project: Function) => <T>(
  meta: ValueMeta<T>,
  ...rest: any[]
) => project(meta.value, ...rest);

const pipeMeta = (project: Function) => <T, R>(
  v: ValueMeta<T>,
  ...rest: any[]
): Observable<ValueMeta<R>> =>
  (from(project(v.value, ...rest)) as Observable<R>).pipe(
    RxOps.map(z => nextMeta(z, v)),
  );

export const map = new Proxy(RxOps.map, {
  apply: (target, thisArg, argumentsList) =>
    target(projectMeta(argumentsList[0]), thisArg),
});

export const filter = new Proxy(RxOps.filter, {
  apply: (target, thisArg, argumentsList) =>
    applyNextMeta(target(sinkMeta(argumentsList[0]), thisArg)),
});

export const delay = new Proxy(RxOps.delay, {
  apply: (target, thisArg, argumentsList) =>
    applyNextMeta(target(argumentsList[0], argumentsList[1])),
});

export const switchMap = new Proxy(RxOps.switchMap, {
  apply: (target, thisArg, argumentsList) =>
    target(pipeMeta(argumentsList[0]), argumentsList[1]),
});

export const mergeMap = new Proxy(RxOps.mergeMap, {
  apply: (target, thisArg, argumentsList) =>
    target(pipeMeta(argumentsList[0]), argumentsList[1]),
});
