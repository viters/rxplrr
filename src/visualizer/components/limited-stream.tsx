import { takeLast } from 'ramda';
import * as React from 'react';
import { Stream } from './stream';

export const LimitedStream = ({
  items,
  limit,
  title
}: {
  items: any;
  limit: number;
  title: string;
}) => <Stream title={title} items={takeLast(limit, items)} />;
