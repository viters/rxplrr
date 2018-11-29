import * as React from 'react';
import { Group, Line } from 'react-konva';
import { interval, Subject } from 'rxjs';
import { filter, scan, takeUntil } from 'rxjs/operators';
import { Colors } from '../../constants/colors';
import { LimitedStream } from './limited-stream';

export interface State {
  items: number[];
  items2: number[];
}

export class StreamDisplay extends React.Component<{}, State> {
  public state: State = { items: [], items2: [] };

  private unsubscribe$ = new Subject<void>();

  constructor(props: {}) {
    super(props);

    const stream1$ = interval(2000);
    const stream2$ = stream1$.pipe(filter(x => x > 4));

    stream1$
      .pipe(
        scan((acc: number[], v: number) => acc.concat([v]), []),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(items => this.setState({ items }));

    stream2$
      .pipe(
        scan((acc: number[], v: number) => acc.concat([v]), []),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(items2 => this.setState({ items2 }));

    this.testFn.bind(this);
  }

  public componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public testFn(name: string) {
    return (v: any, x: number) => (y: number) => console.log(name, {v, x, y});
  }

  public render() {
    return (
      <Group>
        <LimitedStream
          x={0}
          y={0}
          title="interval"
          items={this.state.items}
          limit={6}
          onItemUpdate={this.testFn('interval')}
        />

        <LimitedStream
          x={150}
          y={0}
          title="filter"
          items={this.state.items2}
          limit={6}
          onItemUpdate={this.testFn('filter')}
        />

        <Line points={[90, 45, 160, 45]} stroke={Colors.purplish} tension={1} />
      </Group>
    );
  }
}
