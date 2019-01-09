import * as React from 'react';
import { Notification } from '../observer/interfaces';
import { List, Map } from 'immutable';
import { StreamBar } from './StreamBar';
import { Group } from 'react-konva';
import { rectSizes } from './rectSizes';

interface StreamProps {
  streamId: string;
  notificationsBySteps: Map<number, List<Notification<any>>>;
  position: number;
  onItemReposition?: (
    notification: Notification<any>,
    x: number,
    y: number,
  ) => void;
  onItemHide?: (notification: Notification<any>) => void;
  onItemClick?: (notification: Notification<any>) => void;
}

export const Stream = (props: StreamProps) => {
  const createTitle = (step: number) => {
    const stepName = props.notificationsBySteps
      .get(step)
      .first({ stepName: '' }).stepName;

    return `${props.streamId.slice(0, 3)}: ${stepName}(${step.toString()})`;
  };
  const offsetY = 360 * props.position;

  return (
    <Group>
      {props.notificationsBySteps.keySeq().map(step => (
        <StreamBar
          key={step}
          x={(rectSizes.width + 50) * step}
          y={offsetY}
          title={createTitle(step)}
          items={props.notificationsBySteps.get(step)}
          limit={10}
          onItemHide={props.onItemHide}
          onItemReposition={props.onItemReposition}
          onItemClick={props.onItemClick}
        />
      ))}
    </Group>
  );
};
