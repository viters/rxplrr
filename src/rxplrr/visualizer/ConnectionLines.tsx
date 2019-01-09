import { ValueConnections } from './VisualizeManager';
import * as React from 'react';
import { Colors } from '../constants/colors';
import { Group, Line } from 'react-konva';
import { rectSizes } from './rectSizes';

interface ConnectionLinesProps {
  startOffsetX?: number;
  startOffsetY?: number;
  endOffsetX?: number;
  endOffsetY?: number;
  valueConnections: ValueConnections;
}

export const ConnectionLines = ({
  valueConnections,
}: ConnectionLinesProps) => {
  const endOffsetX = 10;
  const startOffsetX = rectSizes.width - endOffsetX;
  const offsetY = rectSizes.height / 2;

  const startPoint = [
    valueConnections.parent.x + startOffsetX,
    valueConnections.parent.y + offsetY,
  ];
  const children = valueConnections.children
    .valueSeq()
    .map(pos => [
      ...startPoint,
      pos.x + endOffsetX,
      pos.y + offsetY,
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
