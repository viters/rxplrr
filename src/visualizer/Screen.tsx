import { fromNullable, Option } from 'fp-ts/lib/Option';
import { lift, pick, pipe } from 'ramda';
import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import { fromEvent, Subject } from 'rxjs';
import { mapTo, startWith, takeUntil } from 'rxjs/operators';
import styled from 'styled-components';
import { Stream } from './Stream';

interface State {
  height: number;
  width: number;
}

const initialState: State = {
  height: 0,
  width: 0,
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

  public componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public render() {
    return (
      <Container ref={this.containerRef}>
        <Stage {...this.state}>
          <Layer>
            <Stream />
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
