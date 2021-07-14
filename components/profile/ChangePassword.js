import { Fragment, useReducer, useState } from 'react';
import { signOut } from 'next-auth/client';

import classes from './ChangePassword.module.css';
import Input from '../UI/input/Input';
import Alert from '../UI/alert/Alert';
import LoadingSpinner from '../UI/loading-spinner/LoadingSpinner';

const initialFormState = {
  oldPassword: { value: '', isValid: false },
  newPassword: { value: '', isValid: false },
  rePassword: { value: '', isValid: false },
  formIsValid: false
};

const formReducer = (state, action) => {
  let newState = { ...state, [action.id]: { value: action.value, isValid: action.isValid } };
  newState.formIsValid = newState.newPassword.isValid && newState.rePassword.isValid;
  return newState;
}

function ChangePassword(props) {

  const [formState, dispatchFormState] = useReducer(formReducer, initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const revalidationHandler = (id, value, isValid) => dispatchFormState({ id, value, isValid });

  const submitHandler = async event => {
    event.preventDefault();
    if (!formState.formIsValid) return;
    setIsLoading(true);
    setError('');
    try {
      if (!formState.oldPassword.isValid) throw new Error('The old password is wrong.');
      const response = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: formState.oldPassword.value,
          newPassword: formState.newPassword.value,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error.message);
      signOut({ callbackUrl: '/auth?cp=cp' });
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
    }
  };

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      {error && <Alert error={error} />}
      <section className={classes.change_password}>
        <h1>Change Password</h1>
        <form onSubmit={submitHandler} noValidate>
          <Input
            htmlProps={{
              id: 'oldPassword',
              name: 'oldPassword',
              type: 'password',
            }}
            label='Your Old Password'
            showValidation={false}
            testingFunction={password => password.length > 5}
            onRevalidated={revalidationHandler}
          />
          <Input
            htmlProps={{
              id: 'newPassword',
              name: 'newPassword',
              type: 'password',
            }}
            label='New Password'
            showValidation={true}
            testingFunction={password => password.length > 5}
            info="Must be at least six characters"
            onRevalidated={revalidationHandler}
          />
          <Input
            htmlProps={{
              id: 'rePassword',
              name: 'rePassword',
              type: 'password',
            }}
            label='Re-enter Password'
            showValidation={true}
            testingFunction={password => password && password === newPassword.value}
            dependency={formState.newPassword.value}
            info="Must match the previous"
            onRevalidated={revalidationHandler}
          />
          <div>
            <button type='submit' className={classes.submit} aria-disabled={!formState.formIsValid} aria-live='assertive'>
              Continue
            </button>
          </div>
        </form>
      </section>
    </Fragment>
  );
}

export default ChangePassword;