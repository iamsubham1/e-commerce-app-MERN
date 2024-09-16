import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PhonePe = () => {
    const { totalValue } = useSelector((state) => state.cart);
    const { userData } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const data = {
        name: userData.name,
        amount: totalValue,
        number: '9999999999',
        MUID: "MUID" + Date.now(),
        transactionId: 'T' + Date.now(),
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        //console.log("triggered");
        try {
            const response = await fetch('https://e-commerce-app-mern-bmty.onrender.com/api/order/newPayment', {
                method: 'GET',

                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const resData = await response.json();
            //console.log(resData);

            if (resData && resData.data.instrumentResponse.redirectInfo.url) {
                window.location.href = resData.data.instrumentResponse.redirectInfo.url;
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <form onSubmit={handlePayment}>
            <div className='col-12 '>
                <p className='fs-5'><strong>Name:</strong> {data.name}</p>
            </div>
            <div className='col-12 '>
                <p className='fs-5'><strong>Number:</strong> {data.number}</p>
            </div>
            <div className='col-12 '>
                <p className='fs-5'><strong>Amount:</strong> {data.amount}Rs</p>
            </div>
            <div className='col-12 center'>
                <button className='w-100 ' type="submit" >Pay Now</button>
            </div>

        </form>
    )
}

export default PhonePe