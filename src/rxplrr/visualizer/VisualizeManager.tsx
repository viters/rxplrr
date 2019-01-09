import * as React from 'react';
import { Group } from 'react-konva';
import { Notification, VisualizeFn } from '../types';
import { observeCreator } from '../observer/observe';
import { List, Map } from 'immutable';
import * as Ops from '../observer/operators';
import { ConnectionLines } from './ConnectionLines';
import { Stream } from './Stream';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ValueConnections {
  visible: boolean;
  parent: { x: number; y: number };
  children: Map<string, { x: number; y: number }>;
}

interface VisualizerProps {
  observeHook: VisualizeFn;
  onNotificationClick: (notification: Notification<any>) => void;
}

interface VisualizerState {
  streams: Map<string, Map<number, List<Notification<any>>>>;
  valueConnectionsMap: Map<string, ValueConnections>;
}

export class VisualizeManager extends React.Component<
  VisualizerProps,
  VisualizerState
> {
  state: VisualizerState = { streams: Map(), valueConnectionsMap: Map() };

  private unsubscribe$ = new Subject<void>();

  private receiver = new Subject<Notification<any>>();

  constructor(props: VisualizerProps) {
    super(props);

    this.receiver
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((notification: Notification<any>) => {
        this.setState(state => {
          const streamKey = notification.streamId;
          const stepsMap = state.streams.get(streamKey) || Map();

          const stepKey = notification.step;
          const notifications = stepsMap.get(stepKey) || List();

          const newStepsMap = stepsMap.set(
            stepKey,
            notifications.push(notification),
          );

          return {
            streams: state.streams.set(streamKey, newStepsMap),
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

    this.props.observeHook(observe, Ops);
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
        <Group>
          {this.state.streams.keySeq().map((streamId, i) => (
            <Stream
              key={streamId}
              streamId={streamId}
              position={i}
              notificationsBySteps={this.state.streams.get(streamId)}
              onItemHide={this.handleItemHide}
              onItemReposition={this.handleNotificationReposition}
              onItemClick={this.props.onNotificationClick}
            />
          ))}
        </Group>
        {this.state.valueConnectionsMap
          .valueSeq()
          .map((valueConnections, index) => (
            <ConnectionLines
              key={index}
              valueConnections={valueConnections}
            />
          ))}
      </Group>
    );
  }
}
