import * as React from 'react';
import { Group, KonvaEventObject, Rect, Text } from 'react-konva';
import { lefty } from './positionModifiers';

interface TextRectProps {
  rectColor: string;
  onClick?: (evt: KonvaEventObject<MouseEvent>) => void;
  text: string;
  textColor: string;
  x: number;
  y: number;
}

export const TextRect = ({
  rectColor,
  onClick,
  text,
  textColor,
  x,
  y,
}: TextRectProps) => (
  <Group x={x} y={y}>
    <Rect x={0} y={0} width={100} height={30} fill={rectColor} />
    <Text
      width={100}
      height={30}
      align="center"
      text={text}
      verticalAlign="middle"
      fill={textColor}
      onClick={onClick}
    />
  </Group>
);

export const LeftyTextRect = lefty(TextRect);
