import * as React from 'react';
import { Visualizer, VisualizeFn } from './rxplrr';
import styled from 'styled-components';
import { from, interval, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

const Container = styled.div`
  padding: 100px 15px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const observeHook: VisualizeFn = (observe, ops) => {
  interval(2000)
    .pipe(
      observe(['map', 'mergeMap', 'filter', 'mergeMap'])(
        ops.map(x => x * 3),
        ops.mergeMap(x =>
          from([x, 2, 3, 4, 5]).pipe(delay(Math.random() * 5000)),
        ),
        ops.filter(x => x % 2 === 0),
        ops.mergeMap(x =>
          of(String.fromCharCode(97 + (x % 27))).pipe(
            delay(Math.random() * 5000),
            switchMap(x => (x === 's' ? throwError('Cannot use s!') : of(x))),
          ),
        ),
      ),
    )
    .subscribe();

  interval(4000)
    .pipe(
      observe(['map', 'into object', 'into array'])(
        ops.map(x => x * 15),
        ops.map(x => ({ x })),
        ops.map(x => [x]),
      ),
    )
    .subscribe();
};

export const App = () => (
  <div>
    <Container>
      <h1>Hello world!</h1>
      <p>
        This is an example React app using <strong>RxJS</strong> and{' '}
        <strong>rxplrr</strong>.
      </p>

      <p>
        Please use button in the bottom right to show this app streams
        visualization.
      </p>
    </Container>

    <Visualizer observeHook={observeHook} />
  </div>
);
