import * as React from 'react';
import { Group, Line } from 'react-konva';
import { from, Subject } from 'rxjs';
import { StreamBar } from './StreamBar';
import { flatten, groupBy, values } from 'ramda';
import { Colors } from '../constants/colors';
import { Notification } from '../observer/interfaces';
import { filter, map, switchMap } from '../observer/operators';
import { observeCreator } from '../observer/observe';

export interface State {
  [stepId: string]: any[];
}

export class Stream extends React.Component<{}, State> {
  public state: State = {};

  private unsubscribe$ = new Subject<void>();

  private memory: any = {};
  private memory2: any[] = [];
  private receiver = new Subject<Notification<any>>();

  private memory3: any = {};

  constructor(props: {}) {
    super(props);

    this.receiver.subscribe((v: any) => {
      console.log(v);

      // if (this.memory3[v.step]) {
      //   this.memory3[v.step].push(v);
      // } else {
      //   this.memory3[v.step] = [v];
      // }
      //
      // this.setState({});
    });

    this.testFn.bind(this);
  }

  public componentDidMount() {
    const observe = observeCreator(this.receiver);

    const stream1$ = from([1, 2]).pipe(
      observe(
        map(x => x * 2),
        switchMap(x => [x, 2, 3]),
        filter(x => x >= 4),
      ),
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
