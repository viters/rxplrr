import * as React from 'react';
import styled from 'styled-components';
import { Colors } from './constants/colors';
import { Screen } from './visualizer/Screen';
import { VisualizeFn } from './visualizer/Visualizer';
import { Notification } from './observer/interfaces';
import { NotificationViewer } from './visualizer/NotificationViewer';

const FlexRow = styled.div`
  display: flex;
  height: 100%;
`;

const Sidebar = styled.div`
  box-shadow: 5px 0px 21px -9px rgba(0, 0, 0, 0.75);
  background-color: ${Colors.darkBrown};
  height: 100%;
  flex: 0 0 450px;
  max-width: 450px;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const mockInput: VisualizeFn = (observe, ops, rx, rxOps) => {
  rx.interval(2000)
    .pipe(
      observe(
        ops.map(x => x * 3),
        ops.mergeMap(x => rx.of(x).pipe(rxOps.delay(Math.random() * 5000))),
        ops.filter(x => x % 2 === 0),
        ops.mergeMap(x =>
          rx.of(String.fromCharCode(97 + (x % 27))).pipe(
            rxOps.delay(Math.random() * 5000),
            rxOps.switchMap(
              x => (x === 's' ? rx.throwError('Cannot use s!') : rx.of(x)),
            ),
          ),
        ),
      ),
    )
    .subscribe();
};

export class App extends React.Component<
  {},
  { notification: Notification<any> }
> {
  state = { notification: null };

  render() {
    return (
      <FlexRow>
        <Sidebar>
          <div>Input</div>
          <NotificationViewer notification={this.state.notification} />
        </Sidebar>
        <Screen
          visualize={mockInput}
          onNotificationClick={notification => this.setState({ notification })}
        />
      </FlexRow>
    );
  }
}
