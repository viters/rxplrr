import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { lefty } from './positionModifiers';

export const TextRect = ({
  text,
  rectColor,
  textColor,
  x,
  y,
}: {
  text: string;
  rectColor: string;
  textColor: string;
  x: number;
  y: number;
}) => (
  <Group x={x} y={y}>
    <Rect x={0} y={0} width={100} height={30} fill={rectColor} />
    <Text
      width={100}
      height={30}
      align="center"
      text={text}
      verticalAlign="middle"
      fill={textColor}
    />
  </Group>
);

export const LeftyTextRect = lefty(TextRect);
