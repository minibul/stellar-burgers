import { TOrdersData } from '@utils-types';

export type TFeedStats = Pick<TOrdersData, 'total' | 'totalToday'>;

export type FeedInfoUIProps = {
  feed: TFeedStats;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
