import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isFeedLoading: boolean;

  profileOrders: TOrder[];
  isProfileOrdersLoading: boolean;

  orderRequest: boolean;
  orderModalData: TOrder | null;

  currentOrder: TOrder | null;
  isCurrentOrderLoading: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isFeedLoading: true,

  profileOrders: [],
  isProfileOrdersLoading: false,

  orderRequest: false,
  orderModalData: null,

  currentOrder: null,
  isCurrentOrderLoading: false
};

export const fetchFeeds = createAsyncThunk('feed/fetchAll', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchProfileOrders = createAsyncThunk(
  'feed/fetchProfileOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const createOrder = createAsyncThunk(
  'feed/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isFeedLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isFeedLoading = false;
      })

      .addCase(fetchProfileOrders.pending, (state) => {
        state.isProfileOrdersLoading = true;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state) => {
        state.isProfileOrdersLoading = false;
      })

      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isCurrentOrderLoading = true;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isCurrentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.isCurrentOrderLoading = false;
      });
  }
});

export const { clearOrderModalData, clearCurrentOrder } = feedSlice.actions;
export default feedSlice.reducer;

export const selectFeedOrders = (state: { feed: TFeedState }) =>
  state.feed.orders;
export const selectFeedTotal = (state: { feed: TFeedState }) =>
  state.feed.total;
export const selectFeedTotalToday = (state: { feed: TFeedState }) =>
  state.feed.totalToday;
export const selectIsFeedLoading = (state: { feed: TFeedState }) =>
  state.feed.isFeedLoading;
export const selectProfileOrders = (state: { feed: TFeedState }) =>
  state.feed.profileOrders;
export const selectIsProfileOrdersLoading = (state: { feed: TFeedState }) =>
  state.feed.isProfileOrdersLoading;
export const selectOrderRequest = (state: { feed: TFeedState }) =>
  state.feed.orderRequest;
export const selectOrderModalData = (state: { feed: TFeedState }) =>
  state.feed.orderModalData;
export const selectCurrentOrder = (state: { feed: TFeedState }) =>
  state.feed.currentOrder;
export const selectIsCurrentOrderLoading = (state: { feed: TFeedState }) =>
  state.feed.isCurrentOrderLoading;
