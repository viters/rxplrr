import * as React from 'react';
import { Group } from 'react-konva';
import { Colors } from '../constants/colors';
import { StreamBarItem } from './StreamBarItem';
import { LeftyTextRect } from './TextRect';
import { List } from 'immutable';
import { Notification } from '../types';

const getKeyForNotification = (notification: Notification<any>): string =>
  `${notification.timestamp}${notification.type}${notification.type === 'N' &&
    notification.valueMeta.valueId}`;

const getNotificationPosition = (index: number, size: number, limit: number) =>
  size <= limit ? index : index - size + limit;

interface StreamBarProps {
  title: string;
  items: List<Notification<any>>;
  x: number;
  y: number;
  limit: number;
  onItemReposition?: (
    notification: Notification<any>,
    x: number,
    y: number,
  ) => void;
  onItemHide?: (notification: Notification<any>) => void;
  onItemClick?: (notification: Notification<any>) => void;
}

export class StreamBar extends React.Component<StreamBarProps> {
  constructor(props: StreamBarProps) {
    super(props);

    this.handleItemReposition = this.handleItemReposition.bind(this);
  }

  handleItemReposition(notification: Notification<any>, yOffset: number) {
    if (this.props.onItemReposition) {
      const realY = this.props.y + yOffset;
      this.props.onItemReposition(notification, this.props.x, realY);
    }
  }

  render() {
    return (
      <Group x={this.props.x} y={this.props.y}>
        <LeftyTextRect
          text={this.props.title}
          y={0}
          rectColor={Colors.purplish}
          textColor={Colors.white}
        />
        {this.props.items.map((not, index) => (
          <StreamBarItem
            key={getKeyForNotification(not)}
            notification={not}
            position={getNotificationPosition(
              index,
              this.props.items.size,
              this.props.limit,
            )}
            onReposition={this.handleItemReposition}
            onHide={this.props.onItemHide}
            onClick={this.props.onItemClick}
          />
        ))}
      </Group>
    );
  }
}
