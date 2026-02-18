import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  isUserLoading: boolean;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
  forgotPasswordError: string | null;
  resetPasswordError: string | null;
};

const initialState: TUserState = {
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

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка авторизации'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка регистрации'
      );
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка обновления данных'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await forgotPasswordApi({ email });
      localStorage.setItem('resetPassword', 'true');
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка восстановления пароля'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
      localStorage.removeItem('resetPassword');
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка сброса пароля'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    try {
      await dispatch(getUser());
    } finally {
      dispatch(authChecked());
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = (action.payload as string) ?? 'Ошибка авторизации';
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError =
          (action.payload as string) ?? 'Ошибка регистрации';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isUserLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isUserLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
        state.isUserLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.updateUserError =
          (action.payload as string) ?? 'Ошибка обновления данных';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordError =
          (action.payload as string) ?? 'Ошибка восстановления пароля';
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordError =
          (action.payload as string) ?? 'Ошибка сброса пароля';
      });
  }
});

export const { authChecked } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = (state: { user: TUserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: TUserState }) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: { user: TUserState }) =>
  state.user.isAuthChecked;
export const selectIsUserLoading = (state: { user: TUserState }) =>
  state.user.isUserLoading;
export const selectLoginError = (state: { user: TUserState }) =>
  state.user.loginError;
export const selectRegisterError = (state: { user: TUserState }) =>
  state.user.registerError;
export const selectUpdateUserError = (state: { user: TUserState }) =>
  state.user.updateUserError;
export const selectForgotPasswordError = (state: { user: TUserState }) =>
  state.user.forgotPasswordError;
export const selectResetPasswordError = (state: { user: TUserState }) =>
  state.user.resetPasswordError;
