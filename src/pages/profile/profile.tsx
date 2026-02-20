import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  selectUpdateUserError,
  updateUser
} from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUpdateUserError);

  const { values, handleChange, setValues } = useForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      name: user?.name ?? '',
      email: user?.email ?? ''
    }));
  }, [user]);

  const isFormChanged =
    values.name !== user?.name ||
    values.email !== user?.email ||
    !!values.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {})
      })
    )
      .unwrap()
      .then(() => {
        setValues((prev) => ({ ...prev, password: '' }));
      })
      .catch(() => {});
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setValues({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
      updateUserError={updateUserError ?? undefined}
    />
  );
};
