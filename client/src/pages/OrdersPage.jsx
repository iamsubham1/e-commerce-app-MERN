import React, { useState, useEffect } from 'react';
import { fetchOrderDetails } from './../apis/api'; // Import the function
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersData } from '../reducers/orderSlice';
const OrdersPage = () => {
    const dispatch = useDispatch();
    const { ordersData, loading, errors } = useSelector((state) => state.orders);


    useEffect(() => {
        dispatch(getOrdersData());
    }, [dispatch]);


    if (loading) {
        return (
            <div className="container text-center flex flex-col gap-2 items-center justify-center">
                <h1 className="text-5xl">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="container text-center flex flex-col gap-2 items-center justify-center">
            <h1 className="text-5xl mb-4">Your Orders</h1>
            {ordersData.length > 0 ? (
                <ul className="w-full max-w-lg">
                    {ordersData.map((order) => (
                        <li key={order._id} className="border p-4 my-4 rounded shadow-md w-full">
                            <h2 className="text-xl font-bold mb-2">Order ID: {order._id}</h2>
                            <p>Status: <strong>{order.status}</strong></p>
                            <p>Transaction ID: {order.transactionId}</p>
                            <p>Payment Mode: {order.paymentMode}</p>
                            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
                            <h3 className="font-semibold mt-4">Products:</h3>
                            <ul className="mt-2">
                                {order.products.map((product) => (
                                    <li key={product._id} className="border-b mb-2 pb-2">
                                        <div className="flex items-center">
                                            <img
                                                src={product.productId.pictures[0]}
                                                alt={product.productId.name}
                                                className="w-20 h-20 object-cover mr-4"
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {product.productId.name}
                                                </p>
                                                <p>Price: ${product.productId.price.toFixed(2)}</p>
                                                <p>Quantity: {product.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xl">No orders found.</p>
            )}
        </div>
    );
};

export default OrdersPage;
