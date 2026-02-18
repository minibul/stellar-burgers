import { useEffect, FC } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchProfileOrders,
  selectProfileOrders
} from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
