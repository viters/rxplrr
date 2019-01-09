import styled from 'styled-components';
import { Colors } from '../constants/colors';

export const VisualizerButton = styled.button`
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
