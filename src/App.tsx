import * as React from 'react';
import { Visualizer } from './visualizer/Visualizer';
import { VisualizeFn } from './visualizer/VisualizeManager';
import styled from 'styled-components';

const Container = styled.div`
  padding: 100px 15px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const mockInput: VisualizeFn = (observe, ops, rx, rxOps) => {
  rx.interval(2000)
    .pipe(
      observe(['map', 'mergeMap', 'filter', 'mergeMap'])(
        ops.map(x => x * 3),
        ops.mergeMap(x => rx.of(x).pipe(rxOps.delay(Math.random() * 5000))),
        ops.filter(x => x % 2 === 0),
        ops.mergeMap(x =>
          rx.of(String.fromCharCode(97 + (x % 27))).pipe(
            rxOps.delay(Math.random() * 5000),
            rxOps.switchMap(
              x => (x === 's' ? rx.throwError('Cannot use s!') : rx.of(x)),
            ),
          ),
        ),
      ),
    )
    .subscribe();
};

export const App = () => <div>
  <Container>
    <h1>Hello world!</h1>
    <p>This is an example React app using <strong>RxJS</strong> and <strong>rxplrr</strong>.</p>

    <p>Please use button in the bottom right to show this app streams visualization.</p>
  </Container>

  <Visualizer visualize={mockInput} />
</div>;
