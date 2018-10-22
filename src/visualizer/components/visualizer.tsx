import { fromNullable, Option } from 'fp-ts/lib/Option';
import { Vector2d } from 'konva';
import { lift, pick, pipe, range } from 'ramda';
import * as React from 'react';
import { Circle, Layer, Rect, Stage } from 'react-konva';
import { fromEvent, Subject } from 'rxjs';
import { mapTo, startWith, takeUntil } from 'rxjs/operators';
import styled from 'styled-components';
import { Colors } from '../../constants/colors';

interface State {
  height: number;
  width: number;
  offset: Vector2d;
}

export class Visualizer extends React.Component<any, State> {
  public state = {
    height: 0,
    offset: { x: 0, y: 0 },
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
          (o: Option<{ height: number; width: number }>) =>
            o.fold(null, x =>
              this.setState({
                ...x,
                offset: { x: -(x.width / 2), y: -(x.height / 2) }
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
            {range(0, 10).map((x, i) => i === 0 ? <Circle x={-400} y={0} radius={13} fill={Colors.darkBlue} key={i}/> :
            <Rect x={-400 + i * 80} y={0} width={40} height={26} cornerRadius={10} offsetY={13} fill={Colors.darkBlue}  key={i}/>)}
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
