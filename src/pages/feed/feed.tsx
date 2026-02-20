import { useEffect, FC } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchFeeds,
  selectFeedOrders,
  selectIsFeedLoading
} from '../../services/slices/feedSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectIsFeedLoading);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchFeeds());
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
