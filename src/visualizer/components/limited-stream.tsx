import { takeLast } from 'ramda';
import { mapProps } from 'recompose';
import { Stream, StreamProps } from './stream';

interface LimitedStreamProps extends StreamProps {
  limit: number;
}

export const LimitedStream = mapProps((props: LimitedStreamProps) => ({
  ...props,
  items: takeLast(props.limit, props.items)
}))(Stream);
