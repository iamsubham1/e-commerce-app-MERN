import React from 'react';
import { PiShoppingCart } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { handleAddToCart, handleRemoveItem, handleDecreaseItem, clearCart } from '../reducers/cartslice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CartDetails = () => {
    const dispatch = useDispatch();
    const { items, totalValue } = useSelector((state) => state.cart);
    const navigate = useNavigate();

    const increaseCount = (product) => {
        const payload = {
            "productId": product,
            "quantity": 1
        }
        dispatch(handleAddToCart(payload));
    };

    const removeItem = (product) => {
        const payload = {
            "productId": product,
            "quantity": "0"
        }
        dispatch(handleRemoveItem(payload));
    };

    const reduceCount = (product) => {
        const payload = {
            "productId": product,
        }
        dispatch(handleDecreaseItem(payload));
    };


    return (
        <div className="container mx-auto mt-[7%] px-4 ">
            {items && items.length !== 0 ? (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-3/5 overflow-y-scroll ">
                        <ul className='h-[50vh]'>
                            {items.map((item) => (
                                <li key={item._id} className="border-b border-gray-200 py-4 px-2 flex text-sm md:text-base gap-2 items-center hover:bg-[#f1f1f1] hover:cursor-pointer" onClick={() => navigate(`/product/${item.product._id}`)}>
                                    <div className="mb-2 sm:mb-0 sm:w-1/6">
                                        <img
                                            src={item.product.pictures ? item.product.pictures[0] : "https://via.placeholder.com/300"}
                                            alt={item.product.name}
                                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md aspect-square"
                                        />
                                    </div>
                                    <div className="mb-2 sm:mb-0 sm:w-auto flex-1">{item.product.name}</div>
                                    <div className="mb-2 sm:mb-0 sm:w-1/6">${item.product.price.toFixed(2)}</div>
                                    <div className="mb-2 sm:mb-0 sm:w-1/6 flex items-center gap-2 ">
                                        <div>
                                            <button className="text-black rounded-full mr-3 bg-[#e6e6e6] px-[0.6px] hover:bg-[#d7d7d7]" onClick={(e) => {
                                                e.stopPropagation();
                                                reduceCount(item.product._id)
                                            }}>&nbsp;-&nbsp;</button>
                                            <span className="px-2 bg-[#000000] text-[#ffffff] rounded">{item.quantity}</span>
                                            <button className="text-black rounded-full ml-3 bg-[#e8e8e8] hover:bg-[#d7d7d7]" onClick={(e) => {
                                                e.stopPropagation();
                                                increaseCount(item.product._id)
                                            }}>&nbsp;+&nbsp;</button>
                                        </div>
                                    </div>
                                    <MdDelete className="text-[1.5rem]  hover:text-[rgb(255,0,0)] hover:cursor-pointer" onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(item.product._id)
                                    }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full md:w-2/5 bg-[#f4f4f4] text-[#000000] rounded-lg py-8 px-6 h-[60%]">
                        <h3 className="text-2xl font-bold mb-4">Cart Summary</h3>
                        <div className="mt-8 flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-bold">${totalValue.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <span>Taxes:</span>
                            <span className="font-bold">$10.00</span>
                        </div>
                        <div className="mt-2 mb-4 flex justify-between">
                            <span>Shipping Charges:</span>
                            <span className="font-bold">$5.00</span>
                        </div>
                        <div className='content w-full mt-8'></div>
                        <div className="mt-4 flex justify-between">
                            <span>Total:</span>
                            <span className="font-bold">${(totalValue + 10 + 5).toFixed(2)}</span>
                        </div>
                        <button className="shine-btn rounded-md mt-8" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                            <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                                <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd"></path>
                            </svg>
                        </button>
                        <button className="btn-clear-cart text-xs text-red-500 mt-4" onClick={() => dispatch(clearCart())} >
                            Clear Cart
                        </button>
                    </div>
                </div>
            ) : (
                <div className='container flex flex-col justify-center items-center'>
                    <h1 className='flex items-center gap-5 text-[2rem]'>
                        <PiShoppingCart /> Your cart is Empty
                    </h1>
                    <button className='shine-btn mt-8' onClick={() => navigate('/')}>Shop Now !</button>
                </div>
            )}
        </div>
    );
};

export default CartDetails;
