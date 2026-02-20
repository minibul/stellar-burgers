import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен вернуть корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      user: {
        isAuthChecked: false,
        isAuthenticated: false,
        user: null,
        isUserLoading: false,
        loginError: null,
        registerError: null,
        updateUserError: null,
        forgotPasswordError: null,
        resetPasswordError: null
      },
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
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
      }
    });
  });
});
