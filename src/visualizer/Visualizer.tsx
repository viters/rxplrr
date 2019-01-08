import * as React from 'react';
import { Group } from 'react-konva';
import { Notification } from '../observer/interfaces';
import { observeCreator } from '../observer/observe';
import { List, Map } from 'immutable';
import { StreamBar } from './StreamBar';
import * as Ops from '../observer/operators';
import * as RxOps from 'rxjs/operators';
import * as Rx from 'rxjs';
import { OutgoingConnections } from './OutgoingConnections';

export type VisualizeFn = (
  observe: typeof Rx.pipe,
  ops: typeof Ops,
  rx: typeof Rx,
  rxOps: typeof RxOps,
) => void;

export interface ValueConnections {
  visible: boolean;
  parent: { x: number; y: number };
  children: Map<string, { x: number; y: number }>;
}

interface StreamProps {
  visualize: VisualizeFn;
}

interface StreamState {
  itemsBySteps: Map<number, List<Notification<any>>>;
  valueConnectionsMap: Map<string, ValueConnections>;
}

export class Visualizer extends React.Component<StreamProps, StreamState> {
  state: StreamState = { itemsBySteps: Map(), valueConnectionsMap: Map() };

  private unsubscribe$ = new Rx.Subject<void>();

  private receiver = new Rx.Subject<Notification<any>>();

  constructor(props: StreamProps) {
    super(props);

    this.receiver
      .pipe(RxOps.takeUntil(this.unsubscribe$))
      .subscribe((notification: Notification<any>) => {
        this.setState(state => {
          const key = notification.step;
          const currentItems = state.itemsBySteps.get(key);
          const newItems = (currentItems || List()).push(notification);

          return {
            itemsBySteps: state.itemsBySteps.set(key, newItems),
          };
        });
      });

    this.handleNotificationReposition = this.handleNotificationReposition.bind(
      this,
    );
    this.handleItemHide = this.handleItemHide.bind(this);
  }

  componentDidMount() {
    const observe = observeCreator(this.receiver);

    this.props.visualize(observe, Ops, Rx, RxOps);
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleNotificationReposition(
    notification: Notification<any>,
    x: number,
    y: number,
  ) {
    if (notification.type !== 'N') {
      return;
    }

    this.setState(state => {
      let updatedMap = state.valueConnectionsMap;

      const currentKey = notification.valueMeta.valueId;
      const current = state.valueConnectionsMap.get(currentKey);
      const currentWithNewPosition = {
        ...(current || { children: Map() }),
        parent: { x, y },
        visible: true,
      };

      updatedMap = updatedMap.set(currentKey, currentWithNewPosition);

      if (notification.valueMeta.previousValueId !== null) {
        const previousKey = notification.valueMeta.previousValueId;
        const parent = state.valueConnectionsMap.get(previousKey);
        const parentWithNewChild = {
          ...parent,
          children: parent.children.set(currentKey, { x, y }),
        };

        updatedMap = updatedMap.set(previousKey, parentWithNewChild);
      }

      return {
        valueConnectionsMap: updatedMap,
      };
    });
  }

  handleItemHide(notification: Notification<any>) {
    if (notification.type !== 'N') {
      return;
    }

    this.setState(state => {
      const currentKey = notification.valueMeta.valueId;
      const current = state.valueConnectionsMap.get(currentKey);
      const currentHidden = {
        ...(current || { children: Map(), parent: { x: 0, y: 0 } }),
        visible: false,
      };

      return {
        valueConnectionsMap: state.valueConnectionsMap.set(
          currentKey,
          currentHidden,
        ),
      };
    });
  }

  render() {
    return (
      <Group>
        {this.state.itemsBySteps.keySeq().map(step => (
          <StreamBar
            key={step}
            x={150 * step}
            y={0}
            title={step.toString()}
            items={this.state.itemsBySteps.get(step)}
            limit={10}
            onItemHide={this.handleItemHide}
            onItemReposition={this.handleNotificationReposition}
            onItemClick={notification => console.log(notification)}
          />
        ))}
        {this.state.valueConnectionsMap
          .valueSeq()
          .map((valueConnections, index) => (
            <OutgoingConnections
              key={index}
              startOffsetX={95}
              startOffsetY={15}
              endOffsetX={5}
              endOffsetY={15}
              valueConnections={valueConnections}
            />
          ))}
      </Group>
    );
  }
}
