import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classes from './InputInfo.module.css';
import { uiActions } from '../../../store/ui/ui-slice';

function InputInfo(props) {

  const [displayInfoInline, setDisplayInfoInline] = useState(false);
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  const windowWidth = useSelector(store => store.ui.windowWidth);
  const isSmall = windowWidth < 480;

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      dispatch(uiActions.notify({ notification: null }));
    }
  }, []);

  const showInline = () => {
    timerRef.current = setTimeout(() => setDisplayInfoInline(false), 3500);
    setDisplayInfoInline(true);
  };

  const hideInline = useCallback(() => {
    clearTimeout(timerRef.current);
    setDisplayInfoInline(false);
  }, [timerRef.current]);

  useEffect(() => {
    if (displayInfoInline) {
      document.body.addEventListener('click', hideInline);
      return () => document.body.removeEventListener('click', hideInline);
    }
  }, [displayInfoInline, hideInline]);

  useEffect(() => {
    hideInline();
    dispatch(uiActions.notify({ notification: null }));
  }, [isSmall]);

  const displayInfoHandler = event => {
    event.stopPropagation();
    isSmall ?
      dispatch(uiActions.notify({ notification: { title: props.info } })) :
      displayInfoInline ? hideInline() : showInline();
  }

  return (
    <Fragment>
      <span role='note' className={classes['info_message_inline--' + (displayInfoInline || (!isSmall && props.suggest) ? 'on' : 'off')]}>
        {props.info}
      </span>
      <button
        aria-label='input validation infomation'
        aria-haspopup='note'
        aria-expanded={displayInfoInline}
        type='button'
        className={classes.info_button}
        onClick={displayInfoHandler}>
        <svg width='1.25em' height='1.25em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="lightblue">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
    </Fragment>
  );
}

export default InputInfo;