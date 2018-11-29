import * as React from 'react';
import { Group } from 'react-konva';
import { Colors } from '../../constants/colors';
import { StreamItem } from './stream-item';
import { LeftyTextRect } from './text-rect';

export interface StreamProps {
  title: string;
  items: any[];
  x: number;
  y: number;
  onItemUpdate: (v: any, x: number) => (y: number) => void;
}

export const Stream = ({ title, items, x, y, onItemUpdate }: StreamProps) => (
  <Group x={x} y={y}>
    <LeftyTextRect
      text={title}
      y={0}
      rectColor={Colors.purplish}
      textColor={Colors.white}
    />
    {items.map((v: any, i: number) => (
      <StreamItem
        key={i}
        value={v}
        position={i}
        onUpdate={onItemUpdate(v, x)}
      />
    ))}
  </Group>
);
