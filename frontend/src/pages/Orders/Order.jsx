import { useEffect } from "react"
import {Link, useParams, useNavigate} from 'react-router-dom'
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPayPalClientIdQuery, usePayOrderMutation } from "../../redux/api/orderApiSlice"

const Order = () => {
    const {id : orderId} = useParams();
    const navigate = useNavigate();
    const { data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
    
      const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
      const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
      const { userInfo } = useSelector((state) => state.auth);
    
      const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    
      const { data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();
    

    useEffect(() => {
        if(!loadingPayPal && !errorPayPal && paypal.clientId){
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD"
                    }
                });
                paypalDispatch({type: "setLoadingStatus", value: "pending"});
            };
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript();
                }
            }
        }
    }, [order, loadingPayPal, errorPayPal, paypal, paypalDispatch]);


    function onApprove(data, actions) {
        return actions.order.capture().then(async function(details) {
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success("Order paid successfully");
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        });
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
              {
                amount: { value: order.totalPrice },
              },
            ],
          }).then((orderID) => {
            return orderID;
        });
    }

    

    function onError(err) {
        toast.error(err.message);
    }

    const deliverHandler = async () => {
        await deliverOrder(orderId);
        refetch();
    };


    return isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <div className="container flex flex-col ml-[10rem] md:flex-row">
          <div className="md:w-2/3 pr-4">
            <div className="border gray-300 mt-5 pb-4 mb-5">
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-[80%]">
                    <thead className="border-b-2">
                      <tr>
                        <th className="p-2">Image</th>
                        <th className="p-2">Product</th>
                        <th className="p-2 text-center">Quantity</th>
                        <th className="p-2">Unit Price</th>
                        <th className="p-2">Total</th>
                      </tr>
                    </thead>
    
                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="p-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover"
                            />
                          </td>
    
                          <td className="p-2">
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </td>
    
                          <td className="p-2 text-center">{item.qty}</td>
                          <td className="p-2 text-center">{item.price}</td>
                          <td className="p-2 text-center">
                            $ {(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
    
          <div className="md:w-1/3">
            <div className="mt-5 border-gray-300 pb-4 mb-4">
              <h2 className="text-xl font-bold mb-2">Shipping</h2>
              <p className="mb-4 mt-4">
                <strong className="text-pink-500">Order:</strong> {order._id}
              </p>
    
              <p className="mb-4">
                <strong className="text-pink-500">Name:</strong>{" "}
                {order.user.username}
              </p>
    
              <p className="mb-4">
                <strong className="text-pink-500">Email:</strong> {order.user.email}
              </p>
    
              <p className="mb-4">
                <strong className="text-pink-500">Address:</strong>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
    
              <p className="mb-4">
                <strong className="text-pink-500">Method:</strong>{" "}
                {order.paymentMethod}
              </p>
    
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </div>
    
            <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>$ {order.itemsPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$ {order.shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>$ {order.taxPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span>$ {order.totalPrice}</span>
            </div>
    
            {!order.isPaid && (
              <div>
                {loadingPay && <Loader />}{" "}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  </div>
                )}
              </div>
            )}
    
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div>
                <button
                  type="button"
                  className="bg-pink-500 text-white w-full py-2 cursor-pointer hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
            {order.isPaid  && (
              <div className="mt-4">
                <button
                type="button"
                className="bg-pink-500 text-white w-full py-2 cursor-pointer hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
            )}
            
          </div>
        </div>
    );
}

export default Order
