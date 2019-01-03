import * as React from 'react';
import { Group, Line } from 'react-konva';
import { interval, of, Subject } from 'rxjs';
import { delay, filter, map, mergeMap } from 'rxjs/operators';
import { spawn, TaggedValue, wrapFactory } from './streamSpy';
import { StreamBar } from './StreamBar';
import { flatten, groupBy, values } from 'ramda';
import { Colors } from '../constants/colors';

export interface State {
  [stepId: string]: TaggedValue<any>[];
}

export class Stream extends React.Component<{}, State> {
  public state: State = {};

  private unsubscribe$ = new Subject<void>();

  private memory: any = {};
  private memory2: any[] = [];
  private receiver = new Subject();

  private memory3: any = {};

  constructor(props: {}) {
    super(props);

    this.receiver.subscribe((v: TaggedValue<any>) => {
      console.log(v);

      if (this.memory3[v.stepId]) {
        this.memory3[v.stepId].push(v);
      } else {
        this.memory3[v.stepId] = [v];
      }

      this.setState({});
    });

    this.testFn.bind(this);
  }

  public componentDidMount() {
    const wrap = wrapFactory(this.receiver);

    const stream1$ = interval(1000).pipe(
      spawn(this.receiver),
      wrap(mergeMap((x: number) => of(x + 5).pipe(delay(500)))),
      wrap(filter((x: number) => x % 2 === 0)),
      wrap(map((x: number) => x * 2)),
    );

    stream1$.subscribe();
  }

  public componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public testFn(step: string) {
    return (items: any) => {
      this.memory[step] = items;

      const connections = groupBy(x => x.valueId, flatten(values(this.memory)));

      this.memory2 = values(connections).map(v =>
        flatten(v.map(z => [z.x + 50, z.y + 15])),
      );

      this.setState({});
    };
  }

  public render() {
    return (
      <Group>
        {Object.keys(this.memory3).map((x, i) => (
          <StreamBar
            key={x}
            x={150 * i}
            y={0}
            title={x}
            items={this.memory3[x]}
            limit={10}
            onUpdate={this.testFn(x)}
          />
        ))}
        {values(this.memory2).map((x, i) => (
          <Line key={i} points={x} stroke={Colors.purplish} tension={0} />
        ))}
      </Group>
    );
  }
}
