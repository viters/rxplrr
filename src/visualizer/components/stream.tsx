import * as React from 'react';
import { Group } from 'react-konva';
import { Colors } from '../../constants/colors';
import { isEven } from '../../lib/numbers';
import { LeftyTextRect } from './text-rect';

export const Stream = ({ title, items }: { title: string; items: any[] }) => (
  <Group>
    <LeftyTextRect
      text={title}
      y={0}
      rectColor={Colors.purplish}
      textColor={Colors.white}
    />
    {items.map((x: any, i: number) => (
      <LeftyTextRect
        key={i}
        text={x}
        rectColor={isEven(i) ? Colors.lightBlue : Colors.skinny}
        textColor={Colors.darkBrown}
        y={(i + 1) * 30}
      />
    ))}
  </Group>
);
