import { Fragment, useRef } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div role='dialog' className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

function Modal(props) {

  const portalElement = useRef();

  portalElement.current = document.getElementById('overlays');

  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement.current)}
      {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement.current)}
    </Fragment>
  );
};

export default Modal;