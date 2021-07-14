import classes from './Product.module.css';
import MainProductData from './MainProductData';
import OrderSidebar from './OrderSidebar';
import RelatedProducts from './RelatedProducts';
import ProductDetails from './ProductDetails'
import AdditionalInfo from './AdditionalInfo';
import ReviewSummary from './ReviewSummary';
import Reviews from './Reviews';

function Product(props) {

  return (
    <section className={classes.product}>
      <article className={'card ' + classes.main}>
        <MainProductData name={props.name} price={props.price} />
      </article>
      <section className={'card ' + classes.order}>
        <OrderSidebar id={props.id} name={props.name} price={props.price} />
      </section>
      <section className={'card ' + classes.related}>
        <RelatedProducts relatedProducts={props.relatedProducts} />
      </section>
      <section className={'card ' + classes.details}>
        <ProductDetails />
      </section>
      <section className={'card ' + classes.additional_info}>
        <AdditionalInfo />
      </section>
      <section className={'card ' + classes.reviews_summary}>
        <ReviewSummary />
      </section>
      <section className={classes.reviews}>
        <Reviews />
      </section>
    </section>
  );
}

export default Product;