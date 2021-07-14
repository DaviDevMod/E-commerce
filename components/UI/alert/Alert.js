import classes from './Alert.module.css';

function Alert(props) {

  return (
    <div role='alert' className={classes.alert}>
      <span className={classes.alert_icon}>
        <svg width='2em' height='2em' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#c40000">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </span>
      <p className={classes.alert_message}>
        <span>There was a problem</span>
        {props.error}
      </p>
    </div>
  );
}

export default Alert;