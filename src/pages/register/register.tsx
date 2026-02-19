import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectRegisterError
} from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const registerError = useSelector(selectRegisterError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: values.name,
        email: values.email,
        password: values.password
      })
    );
  };

  return (
    <RegisterUI
      errorText={registerError ?? ''}
      email={values.email}
      userName={values.name}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
