import { fromNullable, Option } from 'fp-ts/lib/Option';
import { lift, pick, pipe } from 'ramda';
import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import { fromEvent, Subject } from 'rxjs';
import { mapTo, startWith, takeUntil } from 'rxjs/operators';
import styled from 'styled-components';
import { VisualizeFn, Visualizer } from './Visualizer';
import { Notification } from '../observer/interfaces';

const Container = styled.div`
  height: 100%;
  flex-grow: 1;
`;

interface ScreenProps {
  visualize: VisualizeFn;
  onNotificationClick: (notification: Notification<any>) => void;
}

interface ScreenState {
  height: number;
  width: number;
}

export class Screen extends React.Component<ScreenProps, ScreenState> {
  state = {
    height: 0,
    width: 0,
  };

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
            <Visualizer
              visualize={this.props.visualize}
              onNotificationClick={this.props.onNotificationClick}
            />
          </Layer>
        </Stage>
      </Container>
    );
  }
}
