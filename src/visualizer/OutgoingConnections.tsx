import { ValueConnections } from './Visualizer';
import * as React from 'react';
import { Colors } from '../constants/colors';
import { Group, Line } from 'react-konva';

interface OutgoingConnectionsProps {
  startOffsetX?: number;
  startOffsetY?: number;
  endOffsetX?: number;
  endOffsetY?: number;
  valueConnections: ValueConnections;
}

export const OutgoingConnections = ({
  startOffsetX,
  startOffsetY,
  endOffsetX,
  endOffsetY,
  valueConnections,
}: OutgoingConnectionsProps) => {
  if (!valueConnections.visible) {
    return null;
  }

  const startPoint = [
    valueConnections.parent.x + (startOffsetX || 0),
    valueConnections.parent.y + (startOffsetY || 0),
  ];
  const children = valueConnections.children
    .valueSeq()
    .map(pos => [
      ...startPoint,
      pos.x + (endOffsetX || 0),
      pos.y + (endOffsetY || 0),
    ]);

  return (
    <Group>
      {children.map((points, index) => (
        <Line
          key={index}
          points={points}
          stroke={Colors.purplish}
          tension={0}
        />
      ))}
    </Group>
  );
};
