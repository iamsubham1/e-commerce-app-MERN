import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersData } from "../reducers/orderSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { ordersData, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrdersData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl">Loading...</h1>
      </div>
    );
  }

  // Utility function for status colors
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "text-green-600";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Your Orders</h1>
      {ordersData.length > 0 ? (
        <div className="flex flex-col gap-8">
          {ordersData.map((order) => (
            <div
              key={order._id}
              className="w-full border rounded-lg p-6 shadow-sm bg-white"
            >
              {/* Top Order Info */}
              <div className="flex flex-col md:flex-row md:justify-between mb-4">
                <div className="text-gray-600 text-sm flex flex-col gap-1">
                  <p>
                    <span className="font-semibold text-black">Order ID:</span>{" "}
                    {order._id}
                  </p>
                  <p>
                    <span className="font-semibold text-black">
                      Dispatch Status:
                    </span>{" "}
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} font-bold uppercase`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-black">Txn ID:</span>{" "}
                    {order.transactionId}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Payment:</span>{" "}
                    {order.paymentMode === "COD"
                      ? "Cash on Delivery"
                      : "Online"}
                  </p>
                  <p>
                    <span className="font-semibold text-black">
                      Payment Status:
                    </span>{" "}
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} font-bold uppercase`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="font-semibold text-black text-lg">
                    Total: ₹ {order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Product Items */}
              <div className="flex flex-wrap gap-6">
                {order.products.map((product) => (
                  <div
                    key={product._id}
                    className="flex border rounded-md p-3 w-full md:w-1/2 lg:w-1/3 hover:shadow-md transition"
                  >
                    <img
                      src={product.productId.pictures[0]}
                      alt={product.productId.name}
                      className="w-24 h-24 object-cover rounded mr-4"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold">{product.productId.name}</p>
                      <p className="text-gray-600 text-sm">
                        Price: ₹ {product.productId.price.toFixed(2)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Qty: {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
