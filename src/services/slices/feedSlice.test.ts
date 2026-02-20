import feedReducer, {
  fetchFeeds,
  createOrder,
  clearOrderModalData
} from './feedSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-id-123',
  status: 'done',
  name: 'Тест бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['bun-id-1', 'ingredient-id-1', 'bun-id-1']
};

const mockFeedData = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('feed slice', () => {
  const initialState = {
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

  it('должен вернуть начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchFeeds', () => {
    it('должен установить isFeedLoading=true при pending', () => {
      const action = fetchFeeds.pending('', undefined);
      const state = feedReducer(initialState, action);

      expect(state.isFeedLoading).toBe(true);
    });

    it('должен записать данные ленты и установить isFeedLoading=false при fulfilled', () => {
      const action = fetchFeeds.fulfilled(mockFeedData, '', undefined);
      const state = feedReducer(initialState, action);

      expect(state.isFeedLoading).toBe(false);
      expect(state.orders).toEqual(mockFeedData.orders);
      expect(state.total).toBe(mockFeedData.total);
      expect(state.totalToday).toBe(mockFeedData.totalToday);
    });

    it('должен установить isFeedLoading=false при rejected', () => {
      const action = fetchFeeds.rejected(null, '', undefined);
      const state = feedReducer(initialState, action);

      expect(state.isFeedLoading).toBe(false);
    });
  });

  describe('createOrder', () => {
    it('должен установить orderRequest=true и сбросить orderModalData при pending', () => {
      const stateWithModal = { ...initialState, orderModalData: mockOrder };
      const action = createOrder.pending('', []);
      const state = feedReducer(stateWithModal, action);

      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
    });

    it('должен записать данные заказа и установить orderRequest=false при fulfilled', () => {
      const loadingState = { ...initialState, orderRequest: true };
      const action = createOrder.fulfilled(mockOrder, '', []);
      const state = feedReducer(loadingState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должен установить orderRequest=false при rejected', () => {
      const loadingState = { ...initialState, orderRequest: true };
      const action = createOrder.rejected(null, '', []);
      const state = feedReducer(loadingState, action);

      expect(state.orderRequest).toBe(false);
    });
  });

  describe('clearOrderModalData', () => {
    it('должен сбросить данные модального окна заказа', () => {
      const stateWithModal = { ...initialState, orderModalData: mockOrder };
      const state = feedReducer(stateWithModal, clearOrderModalData());

      expect(state.orderModalData).toBeNull();
    });
  });
});
