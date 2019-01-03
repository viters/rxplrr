import * as React from 'react';
import styled from 'styled-components';
import { Colors } from './constants/colors';
import { Screen } from './visualizer/Screen';

export class App extends React.Component {
  public render() {
    return (
      <FlexRow>
        <Editor />
        <Screen />
      </FlexRow>
    );
  }
}

const FlexRow = styled.div`
  display: flex;
  height: 100%;
`;

const Editor = styled.div`
  box-shadow: 5px 0px 21px -9px rgba(0, 0, 0, 0.75);
  background-color: ${Colors.darkBrown};
  height: 100%;
  flex-basis: 450px;
`;
