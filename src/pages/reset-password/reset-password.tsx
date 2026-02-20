import { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetPassword,
  selectResetPasswordError
} from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { values, handleChange } = useForm({ password: '', token: '' });
  const resetPasswordError = useSelector(selectResetPasswordError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password: values.password, token: values.token }))
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={resetPasswordError ?? ''}
      password={values.password}
      token={values.token}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
