import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInitialCartState } from '../reducers/cartslice';
import { useDispatch } from 'react-redux';

const SuccessPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(fetchInitialCartState());
    }, [dispatch]);

    return (
        <div className="success-page">
            <div className="lottie-container -p-5">
                {/* Lottie animation */}
                <lottie-player
                    src="https://lottie.host/e8bcdbee-25b5-404e-b9fd-bf2d00d22b39/UY58UrSdeC.json"
                    background="transparent"
                    speed="1"
                    style={{ width: '350px', height: '350px' }}

                    autoplay
                ></lottie-player>
            </div>
            <div className="success-text">Your Order is placed</div>
            <div className="additional-info">
                <p className="info-text">Thank you for ordering with us!</p>
                <p className="info-text">We will send you an email once your order is shipped.</p>
                <p className="info-text">You can track your order status on the orders page.</p>
            </div>


            <button className="shine-btn" onClick={() => navigate('/orders')}>
                Go to &nbsp;Orders
            </button>
        </div>
    );
};

export default SuccessPage;
