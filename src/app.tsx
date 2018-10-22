import * as React from 'react';
import styled from 'styled-components';
import { Colors } from './constants/colors';
import { Visualizer } from './visualizer/components/visualizer';

export class App extends React.Component {
  public render() {
    return (
      <FlexRow>
        <Editor />
        <Visualizer />
      </FlexRow>
    );
  }
}

const FlexRow = styled.div`
  display: flex;
  height: 100%;
`;

const Editor = styled.div`
  box-shadow: 5px 0px 21px -9px rgba(0,0,0,0.75);
  background-color: ${Colors.darkBlue};
  height: 100%;
  flex-basis: 600px;
`;
