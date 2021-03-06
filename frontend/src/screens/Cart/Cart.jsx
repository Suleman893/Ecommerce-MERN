import React, { useEffect } from "react";
import buy1 from "../../images/product2.jpg";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../component/Layout/MetaData";
import Checkout from "../../component/Checkout/Checkout";
import "../Cart/Cart.css";

const Cart = () => {
  const param = useParams();

  const productId = param.id;
  let [searchParams, setSearchParams] = useSearchParams();
  const qty = searchParams.get("qty");

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <React.Fragment>
      <MetaData title="Product Cart" />
      <div className="cart-container">
        <h2 className="page-title">Your Cart</h2>
        <table className="my-20">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Remove</th>
            <th>Subtotal</th>
          </tr>
          {cartItems.length === 0 ? (
            <div>
              <h1> Nothing added in cart </h1>
              <Link to="/products"> Buy somes products</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <tr>
                <td>
                  <div className="cart-img">
                    <img src={buy1} alt="cart-item" />
                  </div>
                </td>
                <td>
                  <Link to={`/productdetail/${item.product}`}></Link>
                  <h1 style={{ textTransform: "capitalize" }}>{item.name}</h1>
                </td>
                <td>
                  <small>PKR: {item.price}</small>
                </td>
                <td>
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <small
                    onClick={() => {
                      removeFromCartHandler(item.product);
                    }}
                  >
                    <li
                      className="fa fa-trash text-danger"
                      aria-hidden="true"
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "18px",
                      }}
                    ></li>
                  </small>
                </td>
                <td>
                  <b>{item.price}</b>
                </td>
              </tr>
            ))
          )}
        </table>
        <div className="total-price">
          <table>
            <tr>
              <td>
                <b>Total Items</b>{" "}
              </td>
              <td>
                <b>
                  {" "}
                  ({cartItems.reduce((qty, item) => Number(item.qty) + qty, 0)})
                </b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Subtotal</b>{" "}
              </td>
              <td>
                <b>
                  PKR:{" "}
                  {cartItems
                    .reduce((price, item) => item.price * item.qty + price, 0)
                    .toFixed(2)}
                </b>
              </td>
            </tr>
          </table>
        </div>
        <Checkout
          subTotal={cartItems
            .reduce((qty, item) => qty + item.qty * item.price, 0)
            .toFixed(2)}
        />
      </div>
    </React.Fragment>
  );
};

export default Cart;
