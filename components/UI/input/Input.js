import { useEffect, useReducer } from 'react';

import classes from './Input.module.css';
import InputInfo from './InputInfo';

const initialState = {
  id: '',
  value: '',
  isTouched: false,
  isValid: false,
  triggerToLift: false,
  blur: false
};

const validationReducer = (state, action) => {
  const { id, value, type } = action;
  let { isTouched, isValid, triggerToLift } = state;

  if (type === 'change') {
    if (isTouched) {
      isValid = action.testingFunction(value);
      triggerToLift = !triggerToLift;
    }
  }
  else { // blur
    if (isTouched = !!value) isValid = action.testingFunction(value);
    triggerToLift = !triggerToLift;
  }

  return { id, value, isTouched, isValid, triggerToLift, blur: type === 'blur' };
}

function Input(props) {

  const [{ id, value, isTouched, isValid, triggerToLift, blur }, dispatchValidation] = useReducer(validationReducer, initialState);

  useEffect(() => {
    if (isTouched) validationHandler();
  }, [props.dependency]);

  useEffect(() => {
    props.onRevalidated(id, value, isValid);
  }, [triggerToLift]);

  const validationHandler = (event) => {
    if (event) {
      event.stopPropagation();
      const { id, value } = event.target;
      dispatchValidation({ type: event.type, id, value, testingFunction: props.testingFunction });
    }
    else dispatchValidation({ type: 'change', id, value, testingFunction: props.testingFunction });
  }

  return (
    <div>
      <label className={classes.label} htmlFor={props.htmlProps.id}>{props.label}</label>
      {props.showValidation && <InputInfo info={props.info} suggest={blur && !isValid && isTouched} />}
      <input
        {...props.htmlProps}
        className={classes.input + ' ' + (props.showValidation && isTouched ? classes[isValid ? 'valid' : 'invalid'] : '')}
        onChange={validationHandler}
        onBlur={validationHandler}
      />
    </div>
  );
};

export default Input;