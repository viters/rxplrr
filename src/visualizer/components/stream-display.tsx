import * as React from 'react';
import { interval, Subject } from 'rxjs';
import { scan, takeUntil } from 'rxjs/operators';
import { Stream } from './stream';

export interface State {
  items: number[];
}

export class StreamDisplay extends React.Component<{}, State> {
  public state: State = { items: [] };

  private unsubscribe$ = new Subject<void>();

  public componentWillMount() {
    interval(2000)
      .pipe(
        scan((acc: number[], v: number) => acc.concat([v]), []),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(items => this.setState({ items }));
  }

  public componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public render() {
    return <Stream title="interval" items={this.state.items} />;
  }
}
