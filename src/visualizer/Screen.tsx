import { fromNullable, Option } from 'fp-ts/lib/Option';
import { lift, pick, pipe } from 'ramda';
import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import { from, fromEvent, Subject } from 'rxjs';
import { mapTo, startWith, takeUntil } from 'rxjs/operators';
import styled from 'styled-components';
import { Visualizer, VisualizeFn } from './Visualizer';

interface ScreenState {
  height: number;
  width: number;
}

const initialState: ScreenState = {
  height: 0,
  width: 0,
};

const createInputStream: VisualizeFn = (observe, ops, rx, rxOps) => {
  rx.from([1, 2, 3])
    .pipe(
      observe(
        ops.mergeMap(x => rx.of(x).pipe(rxOps.delay(Math.random() * 5000))),
        ops.map(x => x * 5),
      ),
    )
    .subscribe();
};

export class Screen extends React.Component<any, ScreenState> {
  state = initialState;

  private unsubscribe$ = new Subject<void>();
  private containerRef = React.createRef<any>();

  componentDidMount() {
    fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        takeUntil(this.unsubscribe$),
        mapTo(fromNullable(this.containerRef.current)),
      )
      .subscribe(
        pipe(
          lift((x: HTMLElement) => x.getBoundingClientRect()),
          lift(pick(['height', 'width'])),
          (o: Option<{ height: number; width: number }>) =>
            o.fold(null, x => this.setState(x)),
        ),
      );
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  render() {
    return (
      <Container ref={this.containerRef}>
        <Stage
          height={this.state.height - 50}
          offsetY={-50}
          width={this.state.width - 50}
          offsetX={-50}
        >
          <Layer>
            <Visualizer visualize={createInputStream} />
          </Layer>
        </Stage>
      </Container>
    );
  }
}

const Container = styled.div`
  height: 100%;
  flex-grow: 1;
`;
