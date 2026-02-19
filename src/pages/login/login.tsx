import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser, selectLoginError } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({ email: '', password: '' });

  const dispatch = useDispatch();
  const loginError = useSelector(selectLoginError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: values.email, password: values.password }));
  };

  return (
    <LoginUI
      errorText={loginError ?? ''}
      email={values.email}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
