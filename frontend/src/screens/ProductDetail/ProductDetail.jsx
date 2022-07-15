import React, { useEffect, useState } from "react";
import buy1 from "../../images/product2.jpg";
import user from "../../images/user.png";
import ReactStars from "react-rating-stars-component";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  addReviews,
  clearErrors,
} from "../../redux/actions/productAction";
import { addToCart } from "../../redux/actions/cartActions";
import ImageGallery from "react-image-gallery";
import "./ProductDetail.css";
import { animateScroll as scroll } from "react-scroll";
import HeadShake from "react-reveal/HeadShake";
import { Rating } from "@material-ui/lab";
import Loader from "../../component/Layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../../component/Layout/MetaData";

const ProductDetail = () => {
  const alert = useAlert();

  const { currentUser } = useSelector((state) => state.loginUser);

  const { success, reviewerror } = useSelector((state) => state.addReviews);
  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector(
    (state) => state.productDetail
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const toSend = { rating, comment, productId: product._id };
  const [qty, setQty] = useState(1);

  const increaseQuantity = () => {
    if (product.stock <= qty) return;
    const updatedQty = qty + 1;
    setQty(updatedQty);
  };
  const decreaseQuantity = () => {
    if (1 >= qty) return;
    const updatedQty = qty - 1;
    setQty(updatedQty);
  };

  const submitReview = (e) => {
    e.preventDefault();
    dispatch(addReviews(toSend, currentUser));
    setComment("");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewerror) {
      alert.error(reviewerror);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review added");
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(param.id));
    scroll.scrollTo(1);
  }, [dispatch, error, alert, success, reviewerror]);

  const addToCartHandler = () => {
    if (product.stock > 0) {
      dispatch(addToCart(product._id, qty));
      alert.success(`${product.productName} added to card`);
      navigate(`/cart/${param.id}?qty=${qty}`);
    } else {
      alert.error("Not added to cart");
    }
  };

  const images = [
    {
      original: buy1,
      thumbnail: buy1,
    },
    {
      original: buy1,
      thumbnail: buy1,
    },
    {
      original: buy1,
      thumbnail: buy1,
    },
  ];
  return (
    <React.Fragment>
      <MetaData title={product.productName} />
      {loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <div className="product-detail-container">
            <div className="product-detail-row">
              <div className="product-detail-left">
                {/*<div className="product-detail-img">
              <img src={buy1} alt="product-detail-img" />
              </div> */}
                <ImageGallery items={images} />
              </div>
              <div className="product-detail-right">
                <h1 className="mx-10" style={{ textTransform: "capitalize" }}>
                  {product.productName}
                  <p>{product._id}</p>
                  <p>{product.category}</p>
                </h1>
                <hr />
                <div className="no-of-reviews">
                  <ReactStars
                    edit={false}
                    color="rgba(20,20,20,0.1)"
                    activeColor="#ffd700"
                    size={window.innerWidth < 600 ? 20 : 25}
                    value={product.ratings}
                    isHalf={true}
                  />
                  <p>({product.numOfReviews} reviews) </p>
                </div>

                <hr />
                <p className="mx-10 product-card-price">Rs: {product.price}</p>
                <div className="product-add-to-cart">
                  <button onClick={decreaseQuantity}>-</button>
                  <input readOnly type="number" value={qty} />
                  <button onClick={increaseQuantity}>+</button>
                  {/*
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    >
                      {[...Array(product.stock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>

                      */}
                </div>
                <button
                  className="add-to-cart mx-10"
                  onClick={addToCartHandler}
                >
                  Add to cart
                </button>
                <hr />
                <h3 className={"mx-10" && product.stock > 0 ? "green" : "red"}>
                  {product.stock > 0 ? `In stock ` : "Out of stock"}
                </h3>
                <p className="mx-10">
                  <b>Description:</b> {product.description}
                </p>
              </div>
            </div>
          </div>
          <div className="product-detail-container">
            <h4 className="page-title-small">
              What others say's about {product.productName}{" "}
            </h4>
            {product.reviews &&
              product.reviews.map((curr) => (
                <HeadShake>
                  <div className="review-card mx-10">
                    <div className="review-card-info">
                      <img src={user} alt="user" />
                      <h5 className="mx-10">{curr.name}</h5>
                    </div>
                    <div>
                      <ReactStars
                        edit={false}
                        color="rgba(20,20,20,0.1)"
                        activeColor="#ffd700"
                        size={window.innerWidth < 600 ? 20 : 25}
                        value={curr.rating}
                        isHalf={true}
                      />
                    </div>
                    <p className="mx-10">{curr.comment}</p>
                  </div>
                </HeadShake>
              ))}

            <div className="leave-comment mx-20">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />
              <textarea
                cols="30"
                rows="5"
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={submitReview}></button>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ProductDetail;
