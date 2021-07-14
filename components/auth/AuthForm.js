import { useState, useReducer, useEffect, Fragment, useRef } from 'react';
import { signIn } from 'next-auth/client';
import { useDispatch } from 'react-redux';

import classes from './AuthForm.module.css';
import Input from '../UI/input/Input';
import Alert from '../UI/alert/Alert';
import LoadingSpinner from '../UI/loading-spinner/LoadingSpinner';
import useCartDestiny from '../../hooks/use-cart-destiny';
import ChooseCartModal from './ChooseCartModal';
import { cartActions } from '../../store/cart/cart-slice';

const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const initialFormState = {
  email: { value: '', isValid: false },
  password: { value: '', isValid: false },
  rePassword: { value: '', isValid: false },
  formIsValid: false
};

const formReducer = (state, action) => {
  if (action.switchedToRegister !== undefined) {
    return { ...state, formIsValid: !action.switchedToRegister };
  }
  let newState = { ...state, [action.id]: { value: action.value, isValid: action.isValid } };
  if (action.isRegister) {
    newState.formIsValid = newState.email.isValid && newState.password.isValid && newState.rePassword.isValid;
  }
  return newState;
}

function AuthForm(props) {

  const [isRegister, setIsRegister] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartDestinyStatus, decideCartDestiny] = useCartDestiny();
  const dispatch = useDispatch();
  const logInButtonRef = useRef();
  const { email, password } = formState;

  useEffect(() => {
    setError('');
    dispatchFormState({ switchedToRegister: isRegister });
  }, [isRegister]);

  useEffect(() => {
    if (cartDestinyStatus === 'ASKING') {
      setIsLoading(false);
    }
    else if (cartDestinyStatus === 'DONE') {
      setIsLoading(true);
      dispatch(cartActions.noNeedToSave());
      signIn('credentials', { callbackUrl: '/profile', email: email.value, password: password.value, });
    }
    else if (cartDestinyStatus === 'ABORTED') {
      logInButtonRef.current.focus();
    }
    else if (cartDestinyStatus) {
      setIsLoading(false);
      setError(state => cartDestinyStatus.split('ERROR: ')[1] || state);
    }
  }, [cartDestinyStatus]);

  const toggleAuthHandler = () => setIsRegister(state => !state);

  const revalidationHandler = (id, value, isValid) => dispatchFormState({ isRegister, id, value, isValid })

  const userChoiceHandler = choice => decideCartDestiny(email.value, password.value, choice);

  const submitHandler = async event => {
    event.preventDefault();
    if (!formState.formIsValid) return;
    setIsLoading(true);
    setError('');

    try {
      if (!email.isValid || !password.isValid) throw new Error('Email or password invalid');
      if (isRegister) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error.message);
        window.location.href = '/auth?new=new';
      }
      else {
        const response = await fetch('/api/auth/pre-log-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error.message);
        decideCartDestiny(email.value, password.value, 'FINDOUT');
      }
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
    }
  }

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      {cartDestinyStatus === 'ASKING' && <ChooseCartModal onUserChoice={userChoiceHandler} />}
      {error && <Alert error={error} />}
      <section className={classes.auth}>
        <h1>{isRegister ? 'Create account' : 'Sign in'}</h1>
        <form onSubmit={submitHandler} noValidate>
          <Input
            htmlProps={{
              id: 'email',
              name: 'email',
              type: 'email',
              spellCheck: 'false',
            }}
            label='Email'
            showValidation={isRegister}
            testingFunction={email => emailRegExp.test(email)}
            info="Must be of the form: email@example.com"
            onRevalidated={revalidationHandler}
          />
          <Input
            htmlProps={{
              id: 'password',
              name: 'password',
              type: 'password',
            }}
            label='Your Password'
            showValidation={isRegister}
            testingFunction={password => password.length > 5}
            info="Must be at least six characters"
            onRevalidated={revalidationHandler}
          />
          {isRegister &&
            <Input
              htmlProps={{
                id: 'rePassword',
                name: 'rePassword',
                type: 'password',
              }}
              label='Re-enter Password'
              showValidation={isRegister}
              testingFunction={pass => pass && pass === password.value}
              dependency={formState.password.value}
              info="Must match the previous"
              onRevalidated={revalidationHandler}
            />
          }
          <div className={classes.actions}>
            <button type='submit' ref={logInButtonRef} aria-disabled={!formState.formIsValid} aria-live='assertive'>
              {isRegister ? 'Create your account' : 'Sign in'}
            </button>
            <button type='button' className={classes.toggle} onClick={toggleAuthHandler}>
              {isRegister ? 'Log in with an existing account' : 'Create a new account'}
            </button>
          </div>
        </form>
      </section>
    </Fragment>
  );
}

export default AuthForm;