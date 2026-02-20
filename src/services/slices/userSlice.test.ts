import userReducer, {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  authChecked
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@test.ru',
  name: 'Test User'
};

describe('user slice', () => {
  const initialState = {
    isAuthChecked: false,
    isAuthenticated: false,
    user: null,
    isUserLoading: false,
    loginError: null,
    registerError: null,
    updateUserError: null,
    forgotPasswordError: null,
    resetPasswordError: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('authChecked', () => {
    it('должен установить isAuthChecked=true', () => {
      const state = userReducer(initialState, authChecked());

      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('должен сбросить loginError при pending', () => {
      const stateWithError = { ...initialState, loginError: 'Ошибка' };
      const action = loginUser.pending('', { email: '', password: '' });
      const state = userReducer(stateWithError, action);

      expect(state.loginError).toBeNull();
    });

    it('должен установить пользователя и isAuthenticated=true при fulfilled', () => {
      const action = loginUser.fulfilled(mockUser, '', {
        email: '',
        password: ''
      });
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginError).toBeNull();
    });

    it('должен записать ошибку при rejected', () => {
      const action = loginUser.rejected(
        null,
        '',
        { email: '', password: '' },
        'Неверный логин или пароль'
      );
      const state = userReducer(initialState, action);

      expect(state.loginError).toBe('Неверный логин или пароль');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('должен сбросить registerError при pending', () => {
      const stateWithError = { ...initialState, registerError: 'Ошибка' };
      const action = registerUser.pending('', {
        email: '',
        password: '',
        name: ''
      });
      const state = userReducer(stateWithError, action);

      expect(state.registerError).toBeNull();
    });

    it('должен установить пользователя и isAuthenticated=true при fulfilled', () => {
      const action = registerUser.fulfilled(mockUser, '', {
        email: '',
        password: '',
        name: ''
      });
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должен записать ошибку при rejected', () => {
      const action = registerUser.rejected(
        null,
        '',
        { email: '', password: '', name: '' },
        'Email уже используется'
      );
      const state = userReducer(initialState, action);

      expect(state.registerError).toBe('Email уже используется');
    });
  });

  describe('getUser', () => {
    it('должен установить isUserLoading=true при pending', () => {
      const action = getUser.pending('', undefined);
      const state = userReducer(initialState, action);

      expect(state.isUserLoading).toBe(true);
    });

    it('должен записать пользователя и установить isAuthenticated=true при fulfilled', () => {
      const action = getUser.fulfilled(mockUser, '', undefined);
      const state = userReducer(initialState, action);

      expect(state.isUserLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должен установить isAuthenticated=false при rejected', () => {
      const action = getUser.rejected(null, '', undefined);
      const state = userReducer(initialState, action);

      expect(state.isUserLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logoutUser', () => {
    it('должен установить isUserLoading=true при pending', () => {
      const action = logoutUser.pending('', undefined);
      const state = userReducer(initialState, action);

      expect(state.isUserLoading).toBe(true);
    });

    it('должен сбросить пользователя и установить isAuthenticated=false при fulfilled', () => {
      const authState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = logoutUser.fulfilled(undefined, '', undefined);
      const state = userReducer(authState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isUserLoading).toBe(false);
    });
  });
});
