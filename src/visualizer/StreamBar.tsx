import * as React from 'react';
import { Group } from 'react-konva';
import { Colors } from '../constants/colors';
import { StreamBarItem } from './StreamBarItem';
import { LeftyTextRect } from './TextRect';
import { takeLast } from 'ramda';
import { TaggedValue } from './streamSpy';

export interface StreamBarProps {
  title: string;
  items: TaggedValue<any>[];
  x: number;
  y: number;
  limit: number;
  onUpdate: (items: any[]) => void;
}

export class StreamBar extends React.Component<StreamBarProps> {
  private memory: { valueId: number; x: number; y: number }[] = [];

  constructor(props: StreamBarProps) {
    super(props);

    this.handleOnUpdate = this.handleOnUpdate.bind(this);
  }

  handleOnUpdate(currentItems: TaggedValue<any>[], item: TaggedValue<any>) {
    return (y: number) => {
      const currentKeys = currentItems
        .map(x => x.valueId)
        .filter(x => x !== item.valueId);

      this.memory = this.memory.filter(x =>
        currentKeys.some(y => x.valueId === y),
      );

      this.memory.push({ y, valueId: item.valueId, x: this.props.x });

      this.props.onUpdate(this.memory);
    };
  }

  render() {
    const currentItems = takeLast(this.props.limit, this.props.items);

    return (
      <Group x={this.props.x} y={this.props.y}>
        <LeftyTextRect
          text={this.props.title}
          y={0}
          rectColor={Colors.purplish}
          textColor={Colors.white}
        />
        {currentItems.map((v, i) => (
          <StreamBarItem
            key={i}
            value={v.hasValue ? v.value : v.kind}
            position={i}
            onUpdate={this.handleOnUpdate(currentItems, v)}
          />
        ))}
      </Group>
    );
  }
}
