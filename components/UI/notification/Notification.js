import { useDispatch } from 'react-redux';

import classes from './Notification.module.css';
import { uiActions } from '../../../store/ui/ui-slice';

const Notification = (props) => {

  const dispatch = useDispatch();

  const bgColor = props.status === 'success' || props.status === 'error' ? props.status : '';

  const hideNotificationHandler = () => dispatch(uiActions.notify({ notification: null }));

  return (
    <section
      className={`${classes.notification} ${classes[bgColor]}`}
      onClick={hideNotificationHandler}
    >
      <h2>{props.title}</h2>
      <p>{props.message}</p>
    </section>
  );
};

export default Notification;