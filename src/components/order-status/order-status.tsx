import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const statusColor: { [key: string]: string } = {
  pending: '#E52B1A',
  done: '#00CCCC',
  default: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const textStyle = statusColor[status] ?? statusColor.default;

  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
