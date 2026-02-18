import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPassword,
  selectForgotPasswordError
} from '../../services/slices/userSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotPasswordError = useSelector(selectForgotPasswordError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <ForgotPasswordUI
      errorText={forgotPasswordError ?? ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
