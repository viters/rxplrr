import * as React from 'react';
import { Colors } from '../constants/colors';
import { isEven } from '../lib/numbers';
import { LeftyTextRect } from './TextRect';
import { Notification } from '../types';
import { rectSizes } from './rectSizes';

interface StreamBarItemProps {
  position: number;
  notification: Notification<any>;
  onReposition?: (notification: Notification<any>, yOffset: number) => void;
  onHide?: (notification: Notification<any>) => void;
  onClick?: (notification: Notification<any>) => void;
}

export class StreamBarItem extends React.Component<StreamBarItemProps> {
  get yOffset() {
    return (this.props.position + 1) * rectSizes.height;
  }

  get text(): string {
    if (this.props.notification.type === 'N') {
      const value = this.props.notification.valueMeta.value;

      if (Array.isArray(value)) {
        return '[Array]';
      }

      if (typeof value === 'function') {
        return '(Function)';
      }

      if (typeof value === 'object' && value !== null) {
        return '{Object}';
      }

      if (value === undefined) {
        return '|undefined|';
      }

      if (value === null) {
        return '|null|';
      }

      return value.toString();
    }

    if (this.props.notification.type === 'E') {
      return '!ERROR!';
    }

    return '|COMPLETED|';
  }

  componentDidMount() {
    this.notifyReposition();
  }

  componentDidUpdate(prevProps: StreamBarItemProps) {
    if (
      this.props.notification !== prevProps.notification ||
      this.props.position !== prevProps.position
    ) {
      this.notifyReposition();
    }
  }

  notifyReposition() {
    if (this.props.onReposition && this.props.position >= 0) {
      this.props.onReposition(this.props.notification, this.yOffset);
    } else if (this.props.onHide && this.props.position < 0) {
      this.props.onHide(this.props.notification);
    }
  }

  render() {
    if (this.props.position < 0) {
      return null;
    }

    return (
      <LeftyTextRect
        text={this.text}
        rectColor={
          isEven(this.props.position) ? Colors.lightBlue : Colors.skinny
        }
        textColor={Colors.darkBrown}
        y={this.yOffset}
        onClick={() => this.props.onClick(this.props.notification)}
      />
    );
  }
}
