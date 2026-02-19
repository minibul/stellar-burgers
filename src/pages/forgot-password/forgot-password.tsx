import { FC, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPassword,
  selectForgotPasswordError
} from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const ForgotPassword: FC = () => {
  const { values, handleChange } = useForm({ email: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotPasswordError = useSelector(selectForgotPasswordError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(values.email))
      .unwrap()
      .then(() => {
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <ForgotPasswordUI
      errorText={forgotPasswordError ?? ''}
      email={values.email}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
