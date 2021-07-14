import { useState } from 'react';

import classes from './ChooseCartModal.module.css';
import Modal from '../UI/modal/Modal';
import useTrapFocus from '../../hooks/use-trap-focus';

function ChoseCartModal(props) {

  const [radioState, setRadioState] = useState('MERGE');
  const setUntrapRef = useTrapFocus();

  const changeHandler = event => setRadioState(event.target.value);

  const goBackHandler = () => submitHandler(null, 'ABORT');

  const submitHandler = (event, abort) => {
    event?.preventDefault();
    props.onUserChoice(abort || radioState);
  }

  return (
    <Modal>
      <fieldset className={classes.give_choice}>
        <legend tabIndex='0'>It looks like you have built a cart while browsing as a guest.<br />Would you like to merge it with your personal cart?</legend>
        <form onSubmit={submitHandler}>
          <div className={classes.options}>
            <label>
              <input type='radio' name='chooseCart' value='MERGE' checked={radioState === 'MERGE'} onChange={changeHandler} />
              Yes, please. Merge the two carts.
            </label>
            <label>
              <input type='radio' name='chooseCart' value='DB' checked={radioState === 'DB'} onChange={changeHandler} />
              No, thanks. Discard the guest cart.
            </label>
            <label>
              <input type='radio' name='chooseCart' value='REDUX' checked={radioState === 'REDUX'} onChange={changeHandler} />
              I'd like to replace my personal cart with the one built as a guest.
            </label>
          </div>
          <div className={classes.actions}>
            <button type='button' onClick={goBackHandler} ref={setUntrapRef}>Go back</button>
            <button type='submit'>Continue</button>
          </div>
        </form>
      </fieldset>
    </Modal>
  );
}

export default ChoseCartModal;