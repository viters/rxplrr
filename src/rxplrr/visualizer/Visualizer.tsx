import * as React from 'react';
import { Layer, Stage } from 'react-konva';
import styled, { css } from 'styled-components';
import { VisualizeManager } from './VisualizeManager';
import { Notification, VisualizeFn } from '../types';
import { Colors } from '../constants/colors';
import { NotificationViewer } from './NotificationViewer';

const Container = styled.div<{ hide: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms;

  ${props =>
    props.hide &&
    css`
      transform: translateY(-100%);
      opacity: 0;
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

const NotificationViewerContainer = styled.div`
  position: fixed;
  bottom: 150px;
  right: 50px;
  z-index: 1001;
  padding: 15px;
  border-radius: 10px;
  background-color: ${Colors.darkBrown};
  color: white;
`;

interface ScreenProps {
  visualize: VisualizeFn;
  onNotificationClick?: (notification: Notification<any>) => void;
}

interface ScreenState {
  height: number;
  width: number;
  visible: boolean;
  zoomedNotification: Notification<any>;
}

export class Visualizer extends React.Component<ScreenProps, ScreenState> {
  state = {
    height: 0,
    width: 0,
    visible: false,
    zoomedNotification: null,
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
    this.setState({ zoomedNotification: notification });

    if (this.props.onNotificationClick) {
      this.props.onNotificationClick(notification);
    }
  }

  render() {
    return (
      <div>
        <Container hide={!this.state.visible}>
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
          {this.state.zoomedNotification && (
            <NotificationViewerContainer>
              <NotificationViewer
                notification={this.state.zoomedNotification}
              />
            </NotificationViewerContainer>
          )}
        </Container>

        <VisualizerButton onClick={this.handleVisibilityClick}>
          <img src={require('./logo.png')} />
        </VisualizerButton>
      </div>
    );
  }
}
