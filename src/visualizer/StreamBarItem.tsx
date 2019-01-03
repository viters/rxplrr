import * as React from 'react';
import { Colors } from '../constants/colors';
import { isEven } from '../lib/numbers';
import { LeftyTextRect } from './TextRect';

interface Props {
  position: number;
  value: any;
  onUpdate: (y: number) => void;
}

export class StreamBarItem extends React.Component<Props> {
  get y() {
    return (this.props.position + 1) * 30;
  }

  public componentDidMount() {
    this.props.onUpdate(this.y);
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      this.props.value !== prevProps.value ||
      this.props.position !== prevProps.position
    ) {
      this.props.onUpdate(this.y);
    }
  }

  public render() {
    return (
      <LeftyTextRect
        text={this.props.value.toString()}
        rectColor={
          isEven(this.props.position) ? Colors.lightBlue : Colors.skinny
        }
        textColor={Colors.darkBrown}
        y={this.y}
      />
    );
  }
}
