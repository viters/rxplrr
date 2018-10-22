import { fromNullable, Option } from 'fp-ts/lib/Option';
import { lift, pick, pipe } from 'ramda';
import * as React from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { fromEvent, Subject } from 'rxjs';
import { mapTo, startWith, takeUntil } from 'rxjs/operators';
import styled from 'styled-components';

export class Visualizer extends React.Component {
  public state = {
    height: 0,
    width: 0
  };

  private unsubscribe$ = new Subject<void>();
  private containerRef = React.createRef<any>();

  public componentDidMount() {
    fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        takeUntil(this.unsubscribe$),
        mapTo(fromNullable(this.containerRef.current))
      )
      .subscribe(
        pipe(
          lift((x: HTMLElement) => x.getBoundingClientRect()),
          lift(pick(['height', 'width'])),
          (x: Option<{ height: number; width: number }>) =>
            x.fold(null, this.setState.bind(this))
        )
      );
  }

  public componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public render() {
    return (
      <Container ref={this.containerRef}>
        <Stage {...this.state}>
          <Layer>
            <Rect
              x={20}
              y={50}
              width={100}
              height={100}
              fill="red"
              shadowBlur={10}
            />
          </Layer>
        </Stage>
      </Container>
    );
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
`;
