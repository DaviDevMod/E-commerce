import classes from './Reviews.module.css';

const fiveStars = (
  <span>
    {
      new Array(5).fill(
        <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ffcc33">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ).map((svg, index) => <span key={index}>{svg}</span>)
    }
  </span >
);

const lorem = <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

const customerReview = (
  <div className={'card ' + classes.customer_review}>
    <h3>Review title</h3>
    {fiveStars}
    {lorem}
  </div>
);

function Reviews() {

  return (
    <ul className={classes.reviews}>
      <li key={Math.random().toString(36).slice(2)}>{customerReview}</li>
      <li key={Math.random().toString(36).slice(2)}>{customerReview}</li>
      <li key={Math.random().toString(36).slice(2)}>{customerReview}</li>
    </ul>
  );
}

export default Reviews;