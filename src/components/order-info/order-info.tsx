import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectIsCurrentOrderLoading,
  selectFeedOrders,
  selectProfileOrders
} from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const isLoading = useSelector(selectIsCurrentOrderLoading);

  const orderFromStore = useMemo(() => {
    const orderNumber = Number(number);
    return (
      feedOrders.find((o) => o.number === orderNumber) ||
      profileOrders.find((o) => o.number === orderNumber) ||
      null
    );
  }, [number, feedOrders, profileOrders]);

  useEffect(() => {
    if (!orderFromStore && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [number, orderFromStore, dispatch]);

  const orderData = orderFromStore || currentOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
