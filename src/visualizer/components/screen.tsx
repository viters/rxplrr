import { fromNullable, Option } from 'fp-ts/lib/Option';
import { Vector2d } from 'konva';
import { lift, pick, pipe } from 'ramda';
import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import { fromEvent, Subject } from 'rxjs';
import { mapTo, startWith, takeUntil, tap } from 'rxjs/operators';
import styled from 'styled-components';
import { StreamDisplay } from './stream-display';

interface State {
  height: number;
  width: number;
  offset: Vector2d;
}

const initialState: State = {
  height: 0,
  offset: { x: 0, y: 0 },
  width: 0
};

export class Screen extends React.Component<any, State> {
  public state = initialState;

  private unsubscribe$ = new Subject<void>();
  private containerRef = React.createRef<any>();

  public componentDidMount() {
    fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        takeUntil(this.unsubscribe$),
        tap(() => this.setState(initialState)),
        mapTo(fromNullable(this.containerRef.current))
      )
      .subscribe(
        pipe(
          lift((x: HTMLElement) => x.getBoundingClientRect()),
          lift(pick(['height', 'width'])),
          (o: Option<{ height: number; width: number }>) =>
            o.fold(null, x =>
              this.setState({
                ...x,
                offset: { x: 0, y: 0 }
              })
            )
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
            <StreamDisplay />
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
