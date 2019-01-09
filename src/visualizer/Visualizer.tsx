import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import styled, { css } from 'styled-components';
import { VisualizeFn, VisualizeManager } from './VisualizeManager';
import { Notification } from '../observer/interfaces';
import { Colors } from '../constants/colors';

const Container = styled.div<{ hidden: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1000;
  background-color: #fff;

  ${props =>
    props.hidden &&
    css`
      display: none;
    `};
`;

const VisualizerButton = styled.button`
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 1001;
  width: 64px;
  height: 64px;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: ${Colors.darkBrown};
  border: 6px solid ${Colors.darkBrown};
  cursor: pointer;

  img {
    max-width: 100%;
    height: auto;
  }
`;

interface ScreenProps {
  visualize: VisualizeFn;
  onNotificationClick?: (notification: Notification<any>) => void;
}

interface ScreenState {
  height: number;
  width: number;
  visible: boolean;
}

export class Visualizer extends React.Component<ScreenProps, ScreenState> {
  state = {
    height: 0,
    width: 0,
    visible: false,
  };

  constructor(props) {
    super(props);

    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.handleVisibilityClick = this.handleVisibilityClick.bind(this);
  }

  handleVisibilityClick() {
    if (!this.state.visible) {
      const rect = document.documentElement.getBoundingClientRect();

      this.setState({
        height: rect.height,
        width: rect.width,
        visible: true,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  handleNotificationClick(notification: Notification<any>) {
    if (this.props.onNotificationClick) {
      this.props.onNotificationClick(notification);
    }
  }

  render() {
    return (
      <div>
        <Container hidden={!this.state.visible}>
          <Stage
            height={this.state.height - 50}
            offsetY={-50}
            width={this.state.width - 50}
            offsetX={-50}
          >
            <Layer>
              <VisualizeManager
                visualize={this.props.visualize}
                onNotificationClick={this.handleNotificationClick}
              />
            </Layer>
          </Stage>
        </Container>
        <VisualizerButton onClick={this.handleVisibilityClick}>
          <img src={require('./logo.png')} />
        </VisualizerButton>
      </div>
    );
  }
}
