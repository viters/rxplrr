import * as React from 'react';
import { Group, KonvaEventObject, Rect, Text } from 'react-konva';
import { lefty } from './positionModifiers';
import { rectSizes } from './rectSizes';

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
    <Rect x={0} y={0} width={rectSizes.width} height={rectSizes.height} fill={rectColor} />
    <Text
      width={rectSizes.width}
      height={rectSizes.height}
      align="center"
      text={text}
      verticalAlign="middle"
      fill={textColor}
      onClick={onClick}
    />
  </Group>
);

export const LeftyTextRect = lefty(TextRect);
